<!-- 霓虹分数显示 -->
<script setup lang="ts">
import { ref } from 'vue'

// length 控制数字钟的个数 

interface Props {
  length?: number
  value?: number
  font_wight?: number
}

const props =  withDefaults(defineProps<Props>(),{
  length: 2,
  value: 0,
  font_wight: 10
})

const count = ref(0)
 
function pixelRender(index:number){
  let reverse_value = String(props.value).split("").reverse().join('')
  return 'pixel-' + reverse_value[props.length - index]
}
</script>

<template>
  <div class="scoreboard">
    <ul>
      <li class="pixelPoint"  :style="{width:font_wight + 'px',height:font_wight * 2 + 'px'}"  :class="pixelRender(i)" v-for="i in length">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </li>
    </ul>
  </div>

</template>

<style lang='scss' scoped>
    @import './scoreboard.scss';
</style>
