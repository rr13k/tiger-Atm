<!-- 筹码区域 -->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { gameGm, itemClass } from '../../const/coust'
import { getAssertPath } from '../../utils/getAssertPath';
import { RandomNumBoth } from '../../utils/suger';
import Scoreboard from '../scoreboard/scoreboard.vue'

type itemType = {
  image: string,
  class: itemClass,
  point: number
}

const emit = defineEmits(["start", "betting", "costFraction","playAnimation"])

const state = reactive({
  itemChips: [
    {
      image: getAssertPath("/jokey_one.svg"),
      class: itemClass.jokey,
      point: 0,
    },
    {
      image: getAssertPath("/apple.svg"),
      class: itemClass.apple,
      point: 0,
    },
    {
      image: getAssertPath("/bell.svg"),
      class: itemClass.bell,
      point: 0,
    }, {
      image: getAssertPath("/cherry.svg"),
      class: itemClass.cherry,
      point: 0,
    },
    {
      image: getAssertPath("/lemon.svg"),
      class: itemClass.lemon,
      point: 0,
    },
    {
      image: getAssertPath("/orange.svg"),
      class: itemClass.orange,
      point: 0,
    }, {
      image: getAssertPath("/star.svg"),
      class: itemClass.star,
      point: 0,
    },
    {
      image: getAssertPath("/watermelon.svg"),
      class: itemClass.watermelon,
      point: 0,
    }
  ],
  starting: false
})

const { itemChips,starting } = toRefs(state);

/**
 * @method 获取投注总分数
 */
function getBetPoints(): number {
  var count = 0
  itemChips.value.map(item => {
    count += item.point
  })
  return count
}

function start() {
  if(starting.value){
    console.log("游戏进行中,无法重复按压.")
    gameGm.audioControl?.play('poor')
    return
  }

  const betPoints = getBetPoints()
  if (betPoints > 0) {
    // 下注后-游戏开始
    starting.value = true
    gameGm.audioControl?.play('zhuandong')
    emit("start", async (result: {
      point: number,
      class: itemClass,
      name: string,
      event?: 'lucky'
    }) => {
      // console.log("抽奖的结果", result)
      // 获取下注的内容
      const betItems = itemChips.value.filter(item => { return item.point > 0 })

      // 计算本次获得的积分
      var integral = 0
      for (let item of betItems) {
        if (item.class == result.class) {
          integral += item.point * result.point
        }
      }

      if(integral < 20 && integral > 0) {
        // 随机播放一种欢呼
        let huanhu = 'huanhu' + RandomNumBoth(1,4)
        gameGm.audioControl?.play(huanhu)
      } else if(integral >= 20 && integral < 50){
        console.log("执行播放动画")
        emit('playAnimation', 'yanhua1')
        gameGm.audioControl?.play('pao')
      } else if(integral >= 50) { // 播放终极烟花
        emit('playAnimation', 'yanhua3')
        // 放双炮
        gameGm.audioControl?.play('pao')
        setTimeout(() => {
          gameGm.audioControl?.play('pao')
        }, 300);
      }
      await new Promise((res)=>{
        emit("costFraction", integral, result.event != 'lucky', () => {
          res(true)
        })
      })

      // 当为幸运时，转盘并没有结束
      if(result.event == 'lucky') return

      emit("betting", -betPoints, (result: boolean) => {
        if (!result) {
          // 清空下注
          itemChips.value.map(item => {
            item.point = 0
          })
        }
        // 标记游戏轮次结束
        starting.value = false
      })

    })
  } else {
    gameGm.audioControl?.play('poor')
  }
}

/**
 * @method 进行下注
 */
function betting(item: itemType) {
  if(starting.value){
    console.log("已开始不能下注!")
    return
  }

  if (item.point >= 99) {
    alert("单品不能超过99")
    return
  }

  let bettingResult
  emit("betting", -1, (result: boolean) => {
    bettingResult = result
  })

  if (bettingResult) {
    gameGm.audioControl?.play("coin")
    item.point += 1
  } else {
    console.log("硬币不足，无法下注!")
    gameGm.audioControl?.play('poor')
  }
}

/**
 * @method 下注重制
 */
function clear() {
  // 获取当前的硬币总量
  var count = 0
  itemChips.value.map(item => {
    count += item.point
    item.point = 0
  })
  emit("betting", count)
}

</script>

<template >
  <div class="chip">
    <ul>
      <li v-for="item in itemChips">
        <div class="imgBox">
          <img :src="item.image" alt="" />
        </div>
        <div>
          <Scoreboard :value="item.point" />
        </div>
        <div>
          <div class="pixel-btn">
            <div class="pixel-btn-key">
              <input type="image" :src="item.image" value="" @click="betting(item)" />
            </div>
          </div>
        </div>
      </li>
      <div class="control">
        <main>
          <div class="pixel-btn-rect">
            <input type="button" value="重置" @click="clear">
          </div>
          <div class="pixel-btn-rect">
            <input type="button" value="开始"  :class="starting ? 'disabled' : ''"  @click="start">
          </div>
        </main>
      </div>
    </ul>
  </div>
</template>

<style lang='scss' scoped>
@import './chip.scss';
</style>
