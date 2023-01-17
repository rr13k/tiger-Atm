<!-- 霓虹分数显示 -->
<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  length?: number // length 控制数字钟的个数 
  value?: number
  font_wight?: number
}

const props = withDefaults(defineProps<Props>(),{
  length: 2,
  value: 0,
  font_wight: 1
})

/**
 * @method 根据索引渲染对应的数字
 * @param index 
 */
function pixelRender(index:number){
  let reverse_value = String(props.value).split("").reverse().join('')
  if(props.value == 0 && reverse_value[props.length - index]){
    return 'pixel-zero-0'
  }

  return 'pixel-' + reverse_value[props.length - index]
}
</script>

<template>
  <div class="scoreboard">
    <ul>
      <li class="pixelPoint"  :style="{width: '20px',height:'40px',zoom:`${font_wight}`}"  :class="pixelRender(i)" v-for="i in length">
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
