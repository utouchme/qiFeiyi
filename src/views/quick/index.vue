<template>
  <div class="quick-page">
    <div class="materialZone"> </div>
    <div class="visualZone"> </div>
    <div class="configZone"> </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Test extends Vue {
  created() {}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.quick-page {
}
</style>
