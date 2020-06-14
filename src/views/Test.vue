<template>
  <div>
    <h1>绝对定位生成dom算法测试</h1>
    <div class="test">
      <div class="boxZone">
        <template v-for="(box, index) in mockData">
          <div
            class="box1"
            :key="'box_1_' + index"
            :style="{ left: box.x + 'px', top: box.y + 'px', width: box.width + 'px', height: box.height + 'px' }"
            >{{ box.id }}</div
          >
        </template>
      </div>
      <div class="boxZone" v-html="html"> </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mockData } from '../utils/GenDom/mockData';
import GenDom from '../utils/GenDom';
import '../utils/GenDom/index.scss';

@Component
export default class Test extends Vue {
  mockData: any[] = [];
  html = '';
  created() {
    this.mockData = mockData;
    const genDom = new GenDom(mockData);
    this.html = genDom.genHtml();
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.test {
  display: flex;
  .boxZone {
    width: 500px;
    height: 500px;
    border: 1px solid red;
    position: relative;
    flex: none;
    .box1 {
      position: absolute;
      border: 1px solid red;
      box-sizing: border-box;
    }
  }
}
</style>
