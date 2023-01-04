<!-- 转盘 -->
<script setup lang="ts">
import { ref,reactive,toRefs } from 'vue'
import { gameGm } from '../../const/coust';
import {itemClass} from '../../const/coust'
import { getAssertPath } from '../../utils/getAssertPath';
import anime from 'animejs'

defineProps<{ name?:"desc: 转盘组件",msg: string,size:number}>()

const tigerItems = [[{
 image:getAssertPath("/orange.svg"),
 point:10,
 class:itemClass.orange,
 index:0,
 name:"orange",
 probability:5
},{
 image:getAssertPath("/bell.svg"),
 index:1,
 point:10,
 class:itemClass.bell,
 name:"bell",
 probability:5
},{
 image:getAssertPath("/jokey_two.svg"),
 index:2,
 point:25,
 class:itemClass.jokey,
 name:"little_jokey",
 probability:2
},{
 image:getAssertPath("/jokey_one.svg"),
 index:3,
 point:50,
 class:itemClass.jokey,
 name:"big_jokey",
 probability:1
},{
  index:4,
 image:getAssertPath("/apple.svg"),
 point:5,
 class:itemClass.apple,
 name:"apple",
 probability:8
},{
  index:5,
 image:getAssertPath("/apple.svg"),
 point:2,
 class:itemClass.apple,
 name:"apple",
 probability:8
},{
 index:6,
 image:getAssertPath("/lemon.svg"),
 point:10,
 class:itemClass.lemon,
 name:"lemon",
 probability:5
}],
// 左侧栏
[
{
  index:23,
 image:getAssertPath("/bell.svg"),
 point:2,
 class:itemClass.bell,
 name:"bell",
 probability:12
},{
  index:22,
 image:getAssertPath("/apple.svg"),
 point:5,
 class:itemClass.apple,
 name:"apple",
 probability:8
},{
  index:21,
 image:getAssertPath("/lucky_right.svg"),
 class:itemClass.lucky,
 point:0,
 name:"star",
 probability:8
},{
  index:20,
 image:getAssertPath("/star.svg"),
 point:20,
 class:itemClass.star,
 name:"star",
 probability:3
},{
  index:19,
 image:getAssertPath("/star.svg"),
 point:10,
 class:itemClass.star,
 name:"star",
 probability:5
}
],
// 右侧栏
[{
  index:7,
 image:getAssertPath("/watermelon.svg"),
 point:10,
 class:itemClass.watermelon,
 name:"watermelon",
 probability:5
},{
  index:8,
 image:getAssertPath("/watermelon.svg"),
 point:2,
 class:itemClass.watermelon,
 name:"watermelon",
 probability:12
},{
  index:9,
 image:getAssertPath("/lucky_left.svg"),
 class:itemClass.lucky,
 point:0,
 name:"apple",
 probability:8
},{
  index:10,
 image:getAssertPath("/apple.svg"),
 point:2,
 class:itemClass.apple,
 name:"apple",
 probability:5
},{
  index:11,
 image:getAssertPath("/orange.svg"),
 point:5,
 class:itemClass.orange,
 name:"orange",
 probability:8
}],
// 底部数据
[{
  index:18,
 image:getAssertPath("/lemon.svg"),
 point:10,
 class:itemClass.lemon,
 probability:5,
 name:"lemon"
},{
  index:17,
 image:getAssertPath("/lemon.svg"),
 point:2,
 probability:12,
 class:itemClass.lemon,
 name:"lemon"
},{
  index:16,
 image:getAssertPath("/apple.svg"),
 point:5,
 probability:8,
 class:itemClass.apple,
 name:"apple"
},{
  index:15,
 image:getAssertPath("/cherry.svg"),
 point:20,
 probability:4,
 class:itemClass.cherry,
 name:"cherry"
},{
  index:14,
 image:getAssertPath("/cherry.svg"),
 point:2,
 class:itemClass.cherry,
 name:"cherry",
 probability:12
},{
  index:13,
 image:getAssertPath("/bell.svg"),
 point:10,
 class:itemClass.bell,
 probability:5,
 name:"bell"
},{
  index:12,
 image:getAssertPath("/orange.svg"),
 point:10,
 probability:5,
 class:itemClass.apple,
 name:"orange"
}]] 

const __sleep = (ms:number) => new Promise((res) => setTimeout(res, ms))
const distributionData = toDistributionData() // 根据原数据,获取分布数据
const state = reactive({
  select: 23,
})

const { select } = toRefs(state);

 /**
  * @method 按概率分布随机
  */
function distributionRandom(datas:{
  id:number ,
  count:number
}[]):number {
  const jackpot:number[] = [] // 构建奖池
  datas.map(data=>{
    for(let c=0;c< data.count ; c++){
      jackpot.push(data.id)
    }
  })

  // 为了更好的效果打乱数组 
  jackpot.sort(()=>{
    return Math.random() - 0.5;
  })

  const coloredBall = RandomNumBoth(0, jackpot.length)
  const prize = jackpot[coloredBall]
  return prize
}

/**
 * @method 将二维数组转换为概率分布数组
 */
function toDistributionData(){
  let datas:{
  id:number,
  count:number}[]= []

  for(let items of tigerItems){
    items.map(item=>{
      datas.push({
        id: item.index,
        count: item.probability || 1
      })
    })
  }
  return datas
}

/**
 * @method 开始抽奖-通过让数字模拟贝塔尔曲线变化即可实现滚动效果
 * @param value 总前进步数
 */
async function luckDraw(callback:(result:{
  point:number,
  class:itemClass,
  name:string
})=>{},options?:{
  avoid?: Number // 躲避概率(0-1),配置后将按概率回避,用户投注的奖项
}){
  select.value = select.value % 24 // 从上次中奖位置开始启动

  const prizeValue = distributionRandom(distributionData)
  const round = Math.random() > 0.5 ? 72 : 48
  let value :number = prizeValue + round
  
  await new Promise((resolve,reject)=>{
    anime({
        targets: select,
        value: value,
        duration:2000,
        round:1,
        easing:'cubicBezier(.25,.01,.25,1)', // 先慢，后快，再慢
        change(anim) {
          gameGm.audioControl?.play("t2")
        },
        complete:()=>{
          resolve(true)
        }
      })
  })

  const prize = getItem(select.value % 24)
  console.log("抽奖结束最后的结果为",prize)

  if(prize){
    gameGm.audioControl?.play(prize.name)
    callback(prize)
  }
}

function RandomNumBoth(Min:number,Max:number):number{
      var Range = Max - Min;
      var Rand = Math.random();
      var num = Min + Math.round(Rand * Range); //四舍五入
      return num;
}

/**
 * @method 获取指定索引的物品
 * @param index 
 */
function getItem(index:number){
  for(let items of tigerItems){
    let result = items.find(item=>{
      if(item.index == index){
        return item
      }
    })
    if(result != undefined){
      return result
    }
  }
}

defineExpose({
  luckDraw
})

</script>

<template>

  <main class="turntable">
    <header>
      <ul>
        <li v-for="item in tigerItems[0]" :class="{select: select % 24 == item.index}">
          <img :src="item.image" alt="" />
          <span>x{{item.point}}</span>
        </li>
      </ul>
    </header>
    <main>
      <div>
        <ul class="left">
          <li v-for="item in tigerItems[1]" :class="{select: select % 24 == item.index}">
          <img :src="item.image" alt="" />
          <span v-if="item.class != itemClass.lucky">x{{item.point}}</span>
        </li>
        </ul>
      </div>
      <div class="bg">
      </div>
      <div>
        <ul class="right">
          <li v-for="item in tigerItems[2]" :class="{select: select % 24 == item.index}">
          <img :src="item.image" alt="" />
          <span v-if="item.class != itemClass.lucky">x{{item.point}}</span>
        </li>
        </ul>
      </div>
    </main>
    <footer>
      <ul>
        <li v-for="item in tigerItems[3]" :class="{select: select % 24 == item.index}">
          <img :src="item.image" alt="" />
          <span>x{{item.point}}</span>
        </li>
      </ul>

    </footer>
  </main>
</template>

<style lang='scss' scoped>
    @import './turntable.scss';
</style>
