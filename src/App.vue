<template>
  <div class="container px-8 mx-auto">
    <header class="top-banner flex flex-wrap justify-between bg-yellow-600 rounded-xl">
          <div class="title-part font-semibold flex flex-col justify-between m-2 p-2 bg-gray-50 rounded-lg">
            <div class="flex flex-col font-sans">
              <div class="text-left  text-green-800 text-3xl tracking-tighter" data-test="company">Teamway</div> 
              <div class="text-left text-gray-500 text-xl text-tracking-wide ">Challenge</div>
            </div>
            <div class="flex flex-col tex-sm text-right text-tracking-wider text-gray-500">
              <div class="text-xs">developed by</div>
              <div data-test="author">Carlos Barata</div>
            </div>
          </div>
    </header>
    <main class="my-4">
      <CoverPage v-if="scriptStatus==='starting'" @beginTest="startTest()"></CoverPage>
      <section id="quering" v-if="scriptStatus==='moving'" class=" w-5/6 md:w-10/12 mx-auto border-b border-gray-300">
        <h2 class="text-right text-sm text-gray-700 mr-4">Question {{ currentIndex }} of {{ quiz_questions }}</h2>
        <QuestionForm :question="currentQuestion" @selectedAnswer="processAnswer($event)"></QuestionForm> 
        <div class="mx-auto flex flex-wrap w-10/12 justify-between mt-6 mb-2">
          <button type="button" @click="moveBack()" class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm  rounded-md  bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
            <span class="text-lg font-semibold tracking-wider text-white">Prev</span>
          </button>
          <div class="self-stretch"></div>
          <button v-if="!isThelast" type="button" @click="moveForward()" class="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm  rounded-md  bg-yellow-600 hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
            <span class="text-lg font-semibold tracking-wider text-white">Next</span>  
          </button>
          <button v-else type="button" @click="processResults()" class="inline-flex justify-center py-2 px-6  border border-transparent shadow-sm rounded-md bg-green-800 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300">
            <span class="text-lg font-semibold tracking-wider text-white">Results</span>  
          </button>
        </div>
      </section>
      <ResultPage v-if="scriptStatus==='ending'" :result="testScore" @beginTest="startTest()"></ResultPage>
    </main>
  </div>
</template>

<script  lang="ts">
  import axios from 'axios';
  import { defineComponent } from 'vue';
  
  import QuestionForm from './components/QuestionForm.vue';
  import CoverPage from './components/CoverPage.vue';
  import ResultPage from './components/ResultPage.vue';
  import Question from './types/Question';
  import { IntResults, EndResults, AnswersInfo } from './types/Results';

  const TOTAL_QUESTIONS = 14; // Total number of question on the DB

  const  baseURL = "http://localhost:3030";


  export default defineComponent({

    name: "App",
    components: { QuestionForm, CoverPage, ResultPage },

    data() {
      return {
        scriptStatus: 'starting',
        quiz_questions: 5,
        currentQuestion: <Question>{},
        questionNumber: 0, 
        resultTab: [] as IntResults[], // new Array<Results>(), // One position for each answer
        firstQuestion: 0,
        lastQuestion: 0,
        totalAnswered: 0,
        maxScore: 0,
        minScore: 0,
        testScore: 0,
        sessionID: ''
      }
    },
    computed: {
      isThelast(): boolean {
        return this.lastQuestion === this.questionNumber;
      },
      currentIndex(): number {
        return this.questionNumber - this.firstQuestion + 1;
      }
    },
    methods: {
      startTest() {
       
        // Get some Random Starting point Given there are 14 
        // questions and only a subset will be used in each test
        // 
        this.firstQuestion = Math.floor(Math.random() * (TOTAL_QUESTIONS - this.quiz_questions) + 1);
        this.lastQuestion =  this.firstQuestion + this.quiz_questions - 1;
        this.totalAnswered = 0;
        this.maxScore = 0;
        this.minScore = 0;
        this.resultTab = new Array();

        // START SESSIOn To Store Quiz Results ussing post with path /result
        // The payload is optional
        //
        axios.post(baseURL + "/result", {}).then((res: any) => {
          this.sessionID = res.data.sid;
        }).catch((e: Error) => {
          console.log("Failed to start new Session");
          this.sessionID = '';
        });
        //
        // Retrieve first question of the Quiz
        //
        axios.get(baseURL + "/query", {params: { current: this.firstQuestion}}).then(res => {
            //
            // Handle the response data and move the script for the next stage
            this.currentQuestion = <Question>res.data;
            this.questionNumber = this.firstQuestion;
            this.scriptStatus = 'moving';
        }).catch((e: Error) => {
          console.log("Failed to get something from the DB")
        });
      },
      moveBack() {
        //
        // Handle the return to previous question when it's not the first
        //
        if (this.questionNumber > this.firstQuestion) {
          axios.get(baseURL + "/query", {params: { current: this.questionNumber -1}}).then(res => {
            this.currentQuestion = <Question>res.data;
            this.questionNumber--; 
          }).catch((e: Error) => {
            console.log("Failed to get something from the DB")
          });
        } 
      },
      //
      // Handle the quiz move for the next quetsion
      //
      moveForward() {
        if (this.questionNumber < this.lastQuestion) {
          axios.get(baseURL + "/query", {params: { current: this.questionNumber + 1}}).then(res => {
            this.currentQuestion = <Question>res.data;
            this.questionNumber++; 
          }).catch((e: Error) => {
            console.log("Failed to get something from the DB")
          });
        } 
      },
      //
      // Handles the event from the QuestionForm component when
      // an answer has been selected, 
      // if it's the first time the question has been answered 
      // retrieves also the max and the min scores of the possible 
      // answers to process the result
      // 
      processAnswer(answerRef: number) {
        const idx = this.questionNumber - this.firstQuestion;
        
        if (this.resultTab[idx] == undefined) {
          this.totalAnswered++;
          this.maxScore += this.currentQuestion.answers.map( x => x.weight).reduce((prev, cur) => prev > cur ? prev : cur);
          this.minScore += this.currentQuestion.answers.map( x => x.weight).reduce((prev, cur) => prev < cur ? prev : cur);
        }
        this.resultTab[idx] = {
          question: this.questionNumber,
          answer: answerRef,
          weight: this.currentQuestion.answers[answerRef-1].weight
        } 
        // console.log(this.resultTab);
      },

      processResults() {
        
        if (this.resultTab.length > 0) {
          const totalScore = this.resultTab.map( x => x.weight).reduce((prev, cur) => prev + cur);
          this.testScore = Math.ceil(((totalScore - this.minScore)/(this.maxScore - this.minScore))*100);
          console.log("TEST SCORE:", this.testScore);
          const buffer : AnswersInfo = {};
          this.resultTab.forEach((item: IntResults)  => {
            buffer[item.question] = {answer: item.answer, weight: item.weight};
          });
          const results: EndResults = { answers: buffer, totalScore: totalScore, maxScore: this.maxScore, minScore: this.minScore };
          //
          // If the value is o high or low give it a nudge for visual purposes
          if (this.testScore < 10) {
            this.testScore += 10; 
          } else if (this.testScore > 90) {
            this.testScore -= 10; 
          }
          this.scriptStatus = 'ending';

          axios.put(baseURL + "/result", {sid: this.sessionID, ...results}).catch( err => {
              console.log("Error updating results", err);
          })
        }
      }
    }
  })


</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
section {
  max-width: 720px;
}
.top-banner {
  max-width: 240px;
  height: 140px;
  margin-top: -48px;
}
.title-part {
  width: 320px;
}
</style>
