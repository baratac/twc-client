<template>
    <section class="mx-auto font-sans border border-green-800 rounded-lg shadow-lg flex flex-col content-between justify-between p-10">
        <h2 class="block text-6xl font-semibold tracking-wider text-green-900">Test: Are you an introvert or an extrovert?</h2>
        <button type="button" class="bg-yellow-200 hover:bg-yellow-400 border-2 rounded-xl shadow-lg p-2" @click="startTest()">
            <span class="text-lg text-green-800 font-bold tracking-wide">BEGIN</span> 
        </button>
    </section>
</template>

<script lang="ts">
    import { defineComponent } from 'vue';
    export default defineComponent({
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