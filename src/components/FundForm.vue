<template>

<div v-if="owner">
<b>Funding Form</b><br>
  <label>Answer: </label>
  <input type="text" v-model="answer"><br>
  <label>Awards: </label>
  <input type="text" v-model="amount"><br>
  <button v-on:click="submit">Submit</button>
</div>

</template>

<script>
export default {
  name: 'FundForm',
  computed: {
    owner : function(){
      console.log(this.$store.address)
      if(this.$store.address === 'vite_ad43000f81aee4468387854e20a8c53e2c9027b8655ad2de6c'){
        return true;
      }
      return false;
    }
  },
  methods: {
  submit : function() {
    console.log(this.amount)
    console.log(this.answer)
    this.$methods.callFund(this.answer, this.amount);
  }
}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
