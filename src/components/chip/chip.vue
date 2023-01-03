<!-- 筹码区域 -->
<script setup lang="ts">
import { ref,reactive,toRefs } from 'vue'
import {gameGm, itemClass} from '../../const/coust'
import Scoreboard from '../scoreboard/scoreboard.vue'

type itemType = {
  image:string,
  class:itemClass,
  point:number
}

const emit = defineEmits(["start","betting", "costFraction"])

const state = reactive({
  itemChips:[
  {
    image:"/jokey_one.svg",
    class: itemClass.jokey,
    point:0,
  },
  {
    image:"/apple.svg",
    class: itemClass.apple,
    point:0,
  },
  {
    image:"/bell.svg",
    class: itemClass.bell,
    point:0,
  }, {
    image:"/cherry.svg",
    class: itemClass.cherry,
    point:0,
  },
   {
    image:"/lemon.svg",
    class: itemClass.lemon,
    point:0,
  },
  {
    image:"/orange.svg",
    class: itemClass.orange,
    point:0,
  }, {
    image:"/star.svg",
    class: itemClass.star,
    point:0,
  },
  {
    image:"/watermelon.svg",
    class: itemClass.watermelon,
    point:0,
  }
] 
})

const { itemChips } = toRefs(state);

/**
 * @method 获取投注总分数
 */
function getBetPoints():number{
  var count = 0
  itemChips.value.map(item=>{
    count += item.point
  })
  return count
}

function start(){
  const betPoints = getBetPoints()
  if(betPoints > 0){
    emit("start",async (result:{
  point:number,
  class:itemClass,
  name:string
})=>{
      console.log("抽奖的结果",result)
      // 获取下注的内容
      const betItems =  itemChips.value.filter(item=>{return item.point > 0})
      console.log("下注的内容",betItems)
      var integral = 0
      for(let item of betItems){
        if(item.class == result.class){
          integral += item.point * result.point
        }
      }
      
      console.log("中奖获取到的分数",integral)
      if(integral > 0){
        console.log("恭喜你中奖了:",integral)
      }
      
      emit("costFraction", integral,()=>{
        // 回调表示处理完成
        console.log("结果顺序对吗，在这里扣除，下注的分数", betPoints)
        // 自动扣件上次下注的分数

        emit("betting",-betPoints,(result:boolean)=>{
          if(result){
            // 扣减成功
            console.log("分数足够，扣减成功")
          }else{
            console.log("扣减失败,历史下注清0")
            // 清空下注
            itemChips.value.map(item=>{
              item.point = 0
            })
          }
        })
      })
    })
  } else {
    gameGm.audioControl?.play('poor')
  }
}

/**
 * @method 进行下注
 */
function betting(item:itemType) {
  if(item.point >= 99) {
    alert("单品不能超过99")
    return
  }

  let bettingResult
  emit("betting",-1,(result:boolean)=>{
    bettingResult = result
  })
  
  if( bettingResult ){
    gameGm.audioControl?.play("coin")
    item.point += 1
  }else{
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
  itemChips.value.map(item=>{
    count += item.point
    item.point = 0
  })
  emit("betting", count)
}

</script>

<template >
  <div  class="chip">
    <ul>
      <li v-for="item in itemChips">
        <div class="imgBox">
          <img :src="item.image" alt="" />
        </div>
        <div>
          <Scoreboard  :value="item.point"/>
        </div>
        <div>
          <div class="pixel-btn">
            <div class="pixel-btn-key">
              <input type="image" :src="item.image" value=""  @click="betting(item)"/>
            </div>
          </div>
        </div>
      </li>
    </ul>

    <div class="control">
    <main>
      <div class="pixel-btn-rect">
        <input type="button" value="重制" @click="clear">
      </div>
      <div class="pixel-btn-rect">
        <input type="button" value="开始" @click="start">
      </div>
    </main>
    </div>
  </div>
</template>

<style lang='scss' scoped>
    @import './chip.scss';
</style>
