<template>
<div v-html="imgtag"></div>
</template>

<script>
import qrcode from 'qrcode-generator/qrcode.js'

export default {
  name: 'QRBox',
  props: {
    qrdata: String
  },
  computed: {
    imgtag : function (){
        if (typeof this.qrdata !== 'undefined') {
          const typeNumber = 0;
          const errorCorrectionLevel = 'M';
          const cellSize = 4;
          const qr = qrcode(typeNumber, errorCorrectionLevel);
          qr.addData(this.qrdata);
          qr.make();
          return qr.createImgTag(cellSize);
        } else { return "QR loading" }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>





