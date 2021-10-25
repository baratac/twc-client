
<template>
  <!-- <h1>{{ question }}</h1> -->
  <section class="mx-auto border border-gray-300 shadow-lg rounded-md p-4">
    <h2 class="text-left text-lg px-2 font-medium text-gray-900 mt-2 ml-4" data-test="question">{{  question.question }}</h2>
    <div class="mt-4 flex flex-col w-10/12  border-gray-200 border-t mx-auto ">
      <div class="flex flex-row py-5 px-2 bg-gray-50">
       <input id="answer-one" v-model="answerSelect" value="1" type="radio" class="h-4 w-4" data-test="answer1-select"/>
        <label for="answer-one" class="ml-3 block text-sm font-medium text-gray-700 text-left" data-test="answer1">
          {{ question.answers[0].answer }}
        </label>
      </div>
      <div class="flex flex-row  py-5 px-2 bg-gray-white">
        <input id="answer-two" v-model="answerSelect" value="2" type="radio" class="h-4 w-4" />
        <label for="answer-two" class="ml-3 block text-sm font-medium text-gray-700 text-left" data-test="answer2">
            {{ question.answers[1].answer }}
        </label>
      </div>
      <div class="flex flex-row  py-5 px-2 bg-gray-50">
        <input id="answer-three" v-model="answerSelect" value="3" type="radio" class="h-4 w-4" />
        <label for="answer-three" class="ml-3 block text-sm font-medium text-gray-700 text-left" data-test="answer3">
          {{ question.answers[2].answer}}
        </label>
      </div>
      <div class="flex flex-row  py-5 px-2 bg-gray-white border-gray-200 border-b">
        <input id="answer-four" v-model="answerSelect" value="4" type="radio" class="h-4 w-4" />
        <label for="answer-four" class="ml-3 block text-sm font-medium text-gray-700 text-left" data-test="answer4">
          {{ question.answers[3].answer}}
        </label>
      </div>
    </div>
  </section>

</template>

<script lang="ts">
  import { defineComponent } from 'vue';

  export default defineComponent({
    props: [ 'question' ],
    emits: ['selectedAnswer'],
    data() {
      return {
        answerSelect: '0',
        theQuestion: '0',
        doneQuestions: new Array<string>()
      }
    },
    methods: {

    },
    created() {
        const idx = Number(this.question.id);
        this.theQuestion = this.question.id;
        this.doneQuestions[idx] = '0';
    },
    //
    // Every change in the DOM it can mean 
    // selected answer or question change to be handle
    //
    updated() {
      
      const idx = Number(this.question.id);
       
      if (this.question.id !== this.theQuestion) {    // New question 
        if ( this.doneQuestions[idx] != undefined) {  // check if answer selected
          this.answerSelect = this.doneQuestions[idx];
        } else {
          this.answerSelect = '0';
        }
        this.theQuestion = this.question.id;
      } else { 
        //
        // Check if there is answer selected toe report
        this.doneQuestions[idx] = this.answerSelect;
        if (this.answerSelect !== '0') {
          this.$emit('selectedAnswer', this.answerSelect);
        }
      }
    }
  })

</script>


<style scoped>

section {
  max-width: 720px;
}
</style>
