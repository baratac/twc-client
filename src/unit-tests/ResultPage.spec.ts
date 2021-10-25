import { mount } from '@vue/test-utils'
import ResultPage from '../components/ResultPage.vue';


test('Result Page Structure', async () => {
    const wrapper = mount(ResultPage, {
        props: { result: 25}
    });

    expect(wrapper.find('[data-test="introvert-message"]').exists()).toBe(false)
    await wrapper.setProps({result: 89});
    expect(wrapper.get('[data-test="introvert-message"]').text()).toBe('Introvert')

    await wrapper.get('[data-test="begin-button"]').trigger('click');
    expect(wrapper.emitted()).toHaveProperty('beginTest');
});