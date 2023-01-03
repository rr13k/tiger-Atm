<!-- 转盘 -->
<script setup lang="ts">
import { ref,reactive,toRefs } from 'vue'
import { gameGm } from '../../const/coust';
import {itemClass} from '../../const/coust'
import { getAssertPath } from '../../utils/getAssertPath';

defineProps<{ name?:"desc: 转盘组件",msg: string,size:number}>()

const tigerItems = [[{
 image:getAssertPath("/orange.svg"),
 point:10,
 class:itemClass.orange,
 index:0,
 name:"orange"
},{
 image:getAssertPath("/bell.svg"),
 index:1,
 point:10,
 class:itemClass.bell,
 name:"apple"
},{
 image:getAssertPath("/jokey_two.svg"),
 index:2,
 point:25,
 class:itemClass.jokey,
 name:"apple"
},{
 image:getAssertPath("/jokey_one.svg"),
 index:3,
 point:50,
 class:itemClass.jokey,
 name:"apple"
},{
  index:4,
 image:getAssertPath("/apple.svg"),
 point:5,
 class:itemClass.apple,
 name:"apple"
},{
  index:5,
 image:getAssertPath("/apple.svg"),
 point:2,
 class:itemClass.apple,
 name:"apple"
},{
 index:6,
 image:getAssertPath("/lemon.svg"),
 point:10,
 class:itemClass.lemon,
 name:"apple"
}],
// 左侧栏
[
{
  index:23,
 image:getAssertPath("/bell.svg"),
 point:2,
 class:itemClass.bell,
 name:"bell"
},{
  index:22,
 image:getAssertPath("/apple.svg"),
 point:5,
 class:itemClass.apple,
 name:"apple"
},{
  index:21,
 image:getAssertPath("/lucky_right.svg"),
 class:itemClass.lucky,
 point:0,
 name:"lucky"
},{
  index:20,
 image:getAssertPath("/star.svg"),
 point:20,
 class:itemClass.star,
 name:"star"
},{
  index:19,
 image:getAssertPath("/star.svg"),
 point:10,
 class:itemClass.star,
 name:"star"
}
],
// 右侧栏
[{
  index:7,
 image:getAssertPath("/watermelon.svg"),
 point:10,
 class:itemClass.watermelon,
 name:"apple"
},{
  index:8,
 image:getAssertPath("/watermelon.svg"),
 point:2,
 class:itemClass.watermelon,
 name:"apple"
},{
  index:9,
 image:getAssertPath("/lucky_left.svg"),
 class:itemClass.lucky,
 point:0,
 name:"apple"
},{
  index:10,
 image:getAssertPath("/apple.svg"),
 point:2,
 class:itemClass.apple,
 name:"apple"
},{
  index:11,
 image:getAssertPath("/orange.svg"),
 point:5,
 class:itemClass.orange,
 name:"apple"
}],
// 底部数据
[{
  index:18,
 image:getAssertPath("/lemon.svg"),
 point:10,
 class:itemClass.lemon,
 name:"apple"
},{
  index:17,
 image:getAssertPath("/lemon.svg"),
 point:2,
 class:itemClass.lemon,
 name:"apple"
},{
  index:16,
 image:getAssertPath("/apple.svg"),
 point:5,
 class:itemClass.apple,
 name:"apple"
},{
  index:15,
 image:getAssertPath("/cherry.svg"),
 point:20,
 class:itemClass.cherry,
 name:"apple"
},{
  index:14,
 image:getAssertPath("/cherry.svg"),
 point:2,
 class:itemClass.cherry,
 name:"apple"
},{
  index:13,
 image:getAssertPath("/bell.svg"),
 point:10,
 class:itemClass.bell,
 name:"apple"
},{
  index:12,
 image:getAssertPath("/orange.svg"),
 point:10,
 class:itemClass.apple,
 name:"apple"
}]] 

const __sleep = (ms:number) => new Promise((res) => setTimeout(res, ms))

const state = reactive({
  select: 23,
})

const { select } = toRefs(state);

/**
 * @method 开始抽奖-通过让数字模拟贝塔尔曲线变化即可实现滚动效果
 * @param value 总前进步数
 */
async function luckDraw(callback:(result:{
  point:number,
  class:itemClass,
  name:string
})=>{}){
  let value :number = RandomNumBoth(0,23)

  const baseTime = 10 // 基础的一格切换时间
  var bsr = 3 // 基础的变化系数
  if(value < 48){
    value = value + 48
  }
  // 执行的顺序应该为 慢->加速 -> 快 -> 逐渐慢
  // 10%  又慢到快，  90% 快 ， 10 逐步慢
  for(let i=0;i< value;i++) {
    let rots = i / value 
    if(rots < 0.2){ // 加速
      bsr -= 0.1
    }else if(rots > 0.9){ // 放慢
      bsr += 3  
    }
    await __sleep(baseTime * bsr)
    select.value = i % 24

    // gameGm.audioControl?.play("t2")
  }

  const prize = getItem(select.value)

  console.log("抽奖结束最后的结果为",prize)
  if(prize){
    callback(prize)
  }
  return prize
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
        <li v-for="item in tigerItems[0]" :class="{select:select == item.index}">
          <img :src="item.image" alt="" />
          <span>x{{item.point}}</span>
        </li>
      </ul>
    </header>
    <main>
      <div>
        <ul class="left">
          <li v-for="item in tigerItems[1]" :class="{select:select == item.index}">
          <img :src="item.image" alt="" />
          <span v-if="item.class != itemClass.lucky">x{{item.point}}</span>
        </li>
        </ul>
      </div>
      <div class="bg">
      </div>
      <div>
        <ul class="right">
          <li v-for="item in tigerItems[2]" :class="{select:select == item.index}">
          <img :src="item.image" alt="" />
          <span v-if="item.class != itemClass.lucky">x{{item.point}}</span>
        </li>
        </ul>
      </div>
    </main>
    <footer>
      <ul>
        <li v-for="item in tigerItems[3]" :class="{select:select == item.index}">
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
