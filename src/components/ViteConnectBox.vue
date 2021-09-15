<template>
  <div class="hello">
  ViteConnectBox: {{this.$store.state}} <br>
  <QRBox v-if="!connected" :qrdata="uri" />
  <span v-if="!connected">
  To submit a guess, scan the QR code using your Vite Wallet. <br>
  Download the Vite Wallet at <a href="https://app.vite.net/">app.vite.net</a>.
  </span>
  <br>
  </div>
</template>

<script>
import QRBox from './QRBox.vue';


export default {
  name: 'ViteConnectBox',
  components: {
  QRBox
  },
  computed: {
    connected: function (){
        if( this.$store.state == "connected" ){
	return true;
	} else {
	return false;
	}
    },
    uri: function(){
      console.log(this.$store.uri)
      return this.$store.uri
    }
  },
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
