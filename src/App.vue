<template>
  <img alt="Vue logo" src="./assets/logo.png">
  <hr width="25%">
  <ToastNotify/>
  <ViteConnectBox/>
  <FundForm/><br>
  <GuessForm/>
</template>

<script>
import ToastNotify from './components/ToastNotify.vue'
import ViteConnectBox from './components/ViteConnectBox.vue'
import FundForm from './components/FundForm.vue'
import GuessForm from './components/GuessForm.vue'

export default {
  name: 'App',
  components: {
    ToastNotify,
    ViteConnectBox,
    FundForm,
    GuessForm,
  }
}
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
</style>
