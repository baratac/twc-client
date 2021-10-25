import { mount } from '@vue/test-utils'
import QuestionForm from '../components/QuestionForm.vue';


test('Selecting Answer 1', async () => {

    const wrapper = mount(QuestionForm,{
    props: {
        question: {
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
    });

    expect(wrapper.get('[data-test="answer1"]').text()).toBe('Answer 1')
    await wrapper.get('[data-test="answer1-select"]').setValue()
    await wrapper.get('[data-test="answer1-select"]').trigger('click')
    expect(wrapper.emitted()).toHaveProperty('selectedAnswer');
})