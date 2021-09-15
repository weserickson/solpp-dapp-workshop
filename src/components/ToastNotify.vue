<template>
</template>

<script>
export default {
  name: 'ToastNotify',
  props: {
  },
  mounted () {
    console.log(this.$store)
    this.$store.data = 5

    const toastLog = (log) => { this.$toast.success(log.log + " " + log['2'], {position: 'top', duration: 10000}) };
    const toastLogError = (log) => { this.$toast.error(log.log + " " + log['2'], {position: 'top', duration: 10000}) };
    this.$methods.subscribeToEvent("Funded", toastLog);
    this.$methods.subscribeToEvent("Awarded", toastLog);
    this.$methods.subscribeToEvent("Failed", toastLogError);
    
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
