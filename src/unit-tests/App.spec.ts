import { mount, shallowMount } from '@vue/test-utils'
import App from '../App.vue';
import CoverPage from '../components/CoverPage.vue';
import QuestionForm from '../components/QuestionForm.vue';
import axios from 'axios';

//
// To Run Build 

const mockPostResp = {data: {sid: '111-222'}};
const mockGetResp = 
{ data: 
    {
        id: 1,
        question: "The question text.",
        answers: [
            { id: 1, answer: "Answer 1", weight: 10 },
            { id: 2, answer: "Answer 2", weight: 20 },
            { id: 3, answer: "Answer 3", weight: 30 },
            { id: 4, answer: "Answer 4", weight: 40 }
        ]
    }
};

jest.mock('axios', () => ({
    get: jest.fn(() => Promise.resolve(mockGetResp)),
    post: jest.fn(() => Promise.resolve(mockPostResp))
  }))

test('Check Startup Elements', () => {
    const wrapper = mount(App) as any;

    expect(wrapper.get('[data-test="company"]').text()).toBe('Teamway')
    expect(wrapper.get('[data-test="author"]').text()).toBe('Carlos Barata')

    expect(wrapper.html()).toContain('Test: Are you an introvert or an extrovert?')
})

test('Starting Quiz', async () => {
    const wrapper = shallowMount(App);

    await wrapper.findComponent(CoverPage).vm.$emit('beginTest');

    expect(axios.post).toHaveBeenCalledTimes(1);
    // expect(axios.post).toHaveBeenCalledWith('/result');

    expect(axios.get).toHaveBeenCalledTimes(1);
    // expect(axios.get).toHaveBeenCalledWith('/query');
   
});

test('Launching Quiz Page', async() => {

    const wrapper = mount(App as any, {
        data() {
            return {
                scriptStatus: 'moving',
                currentQuestion: {
                    id: 1,
                    question: "The question text.",
                    answers: [
                        { id: 1, answer: "Answer 1", weight: 10 },
                        { id: 2, answer: "Answer 2", weight: 20 },
                        { id: 3, answer: "Answer 3", weight: 30 },
                        { id: 4, answer: "Answer 4", weight: 40 }
                    ]
                }
            }
        }
    } as any);

    expect(wrapper.findComponent(QuestionForm).vm.question.id).toBe(1)

});