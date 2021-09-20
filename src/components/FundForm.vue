<template>

<div v-if="owner&&connected">
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
      if(this.$store.address === this.$store.contract_owner){
        return true;
      }
      return false;
    },
    connected: function (){
      if( this.$store.state == "connected" ){
        return true;
      } else {
        return false;
      }
    },
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
