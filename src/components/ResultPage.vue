<template>
    <section class="mx-auto font-sans border border-green-800 rounded-lg shadow-lg flex flex-col content-between justify-between p-10">
        <h2 class="block text-3xl font-semibold tracking-wide text-green-900">Test: Are you an introvert or an extrovert?</h2>
        <div>
            <div class="flex flex-row justify-between">
                <div class="text-xs tracking-wide  text-gray-600">Extrovert</div>
                <div class="flex-grow"> </div>
                <div class="text-xs tracking-wide text-gray-600">Introvert</div>
            </div>
            <div class="bg-gray-200 w-full" style="height: 24px;">
                <div class="bg-yellow-300 rounded-xl h-full" :style="{ width: result + '%' }"></div>
            </div>
        </div>

        <div v-if="result >= 60" class="text-6xl text-green-400 font-bond " data-test="introvert-message">Introvert</div>
        <div v-if="result <= 40" class="text-6xl text-green-800 font-bond font-serif ">Extrovert</div>
        <div v-if="result > 40 && result < 60" class="text-6xl text-gray-600 font-bond font-serif ">Inconclusive</div>
        
        <button type="button" class="bg-gray-200 hover:bg-yellow-100 border-2 rounded-xl shadow-lg p-2" @click="startTest()" data-test="begin-button">
            <span class="text-lg text-green-800 font-bold tracking-wide">BEGIN</span> 
        </button>
    </section>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
        props:['result'],
        emits: ['beginTest'],

        methods:  {
            startTest() {
                this.$emit('beginTest');
            }
        }
    });
</script>
<style scoped>
section {
    height: 400px;
    width: 720px; 
}
</style>