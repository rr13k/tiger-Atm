<!-- 筹码区域 -->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { gameGm, itemClass } from '../../const/coust'
import { getAssertPath } from '../../utils/getAssertPath';
import Scoreboard from '../scoreboard/scoreboard.vue'

type itemType = {
  image: string,
  class: itemClass,
  point: number
}

const emit = defineEmits(["start", "betting", "costFraction"])

const state = reactive({
  starting: false
})

const { starting } = toRefs(state);

/**
 * @method 获取投注总分数
 */
function getBetPoints(): number {
  var count = 0
  return count
}

</script>

<template >
  <div class="setting">
    <!-- 背景声音 -->
    <!-- 音效 -->
    <!-- 自动下注 -->
    <!-- github: -->
  </div>
</template>

<style lang='scss' scoped>
@import './setting.scss';
</style>
