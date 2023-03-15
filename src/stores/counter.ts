import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
const counter = 'counter'

export const useCounterStore = defineStore('counter', {
  state: () => ({
    [counter]: 0,
  }),
  getters: {
    doubleCount: (state) => state[counter] * 2,
  },
  actions: {
    increment() {
      this[counter]++;
    } //, test() {this.router.push('/test')}
  } // https://quasar.dev/quasar-cli-vite/state-management-with-pinia#introduction
}) // https://pinia.vuejs.org/core-concepts/#option-stores

export const useCounterStore2 = defineStore('counter', () => {
  const counter = ref(0) // ref()s become state properties
  const doubleCount = computed(() => counter.value * 2) //computed()s become getters
  function increment() {
    counter.value++
  } // function()s become actions
  return { counter, doubleCount, increment }
}) // https://pinia.vuejs.org/core-concepts/#setup-stores
