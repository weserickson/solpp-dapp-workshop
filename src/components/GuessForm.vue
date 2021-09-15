<template>

<div>
  <b>Guess Form</b><br>
  <label>Answer: </label>
  <input type="text" v-model="answer">&nbsp;
  <button v-on:click="submit">Submit</button>
</div>

</template>

<script>
export default {
  name: 'GuessForm',
  props: {
  },
  methods : {
    submit : function() {
      console.log(this.answer)
      this.$methods.callGuess(this.answer);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
