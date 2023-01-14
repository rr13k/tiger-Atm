<!-- 转盘 -->
<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import { gameGm } from '../../const/coust';
import { itemClass } from '../../const/coust'
import { getAssertPath } from '../../utils/getAssertPath';
import anime from 'animejs'
import lottie from 'lottie-web'
import { RandomNumBoth } from '../../utils/suger';

defineProps<{ name?: "desc: 转盘组件", msg: string, size: number }>()

// 背景图片设置
const backageImage = getAssertPath("/bg3.jpeg")

const tigerItems = [[{
  image: getAssertPath("/orange.svg"),
  point: 10,
  class: itemClass.orange,
  index: 0,
  name: "orange",
  probability: 5
}, {
  image: getAssertPath("/bell.svg"),
  index: 1,
  point: 10,
  class: itemClass.bell,
  name: "bell",
  probability: 5
}, {
  image: getAssertPath("/jokey_two.svg"),
  index: 2,
  point: 25,
  class: itemClass.jokey,
  name: "little_jokey",
  probability: 3,
  backageColor:"rgb(153 204 242 / 44%)",
}, {
  image: getAssertPath("/jokey_one.svg"),
  index: 3,
  point: 50,
  class: itemClass.jokey,
  name: "big_jokey",
  backageColor:"rgb(255 135 115 / 42%)",
  probability: 2
}, {
  index: 4,
  image: getAssertPath("/apple.svg"),
  point: 5,
  class: itemClass.apple,
  name: "apple",
  probability: 8
}, {
  index: 5,
  image: getAssertPath("/apple.svg"),
  point: 2,
  class: itemClass.apple,
  name: "apple",
  probability: 8
}, {
  index: 6,
  image: getAssertPath("/lemon.svg"),
  point: 10,
  class: itemClass.lemon,
  name: "lemon",
  probability: 5
}],
// 左侧栏
[
  {
    index: 23,
    image: getAssertPath("/bell.svg"),
    point: 2,
    class: itemClass.bell,
    name: "bell",
    probability: 12
  }, {
    index: 22,
    image: getAssertPath("/apple.svg"),
    point: 5,
    class: itemClass.apple,
    name: "apple",
    probability: 8
  }, {
    index: 21,
    image: getAssertPath("/lucky_right.svg"),
    class: itemClass.lucky,
    point: 0,
    probability: 8,
    backageColor: "rgb(200 176 255 / 45%)",
  }, {
    index: 20,
    image: getAssertPath("/star.svg"),
    point: 20,
    class: itemClass.star,
    name: "star",
    probability: 3
  }, {
    index: 19,
    image: getAssertPath("/star.svg"),
    point: 10,
    class: itemClass.star,
    name: "star",
    probability: 5
  }
],
// 右侧栏
[{
  index: 7,
  image: getAssertPath("/watermelon.svg"),
  point: 10,
  class: itemClass.watermelon,
  name: "watermelon",
  probability: 5
}, {
  index: 8,
  image: getAssertPath("/watermelon.svg"),
  point: 2,
  class: itemClass.watermelon,
  name: "watermelon",
  probability: 12
}, {
  index: 9,
  image: getAssertPath("/lucky_left.svg"),
  class: itemClass.lucky,
  backageColor: "rgb(200 176 255 / 45%)",
  point: 0,
  probability: 8,
}, {
  index: 10,
  image: getAssertPath("/apple.svg"),
  point: 2,
  class: itemClass.apple,
  name: "apple",
  probability: 5
}, {
  index: 11,
  image: getAssertPath("/orange.svg"),
  point: 5,
  class: itemClass.orange,
  name: "orange",
  probability: 8
}],
// 底部数据
[{
  index: 18,
  image: getAssertPath("/lemon.svg"),
  point: 10,
  class: itemClass.lemon,
  probability: 5,
  name: "lemon"
}, {
  index: 17,
  image: getAssertPath("/lemon.svg"),
  point: 2,
  probability: 12,
  class: itemClass.lemon,
  name: "lemon"
}, {
  index: 16,
  image: getAssertPath("/apple.svg"),
  point: 5,
  probability: 8,
  class: itemClass.apple,
  name: "apple"
}, {
  index: 15,
  image: getAssertPath("/cherry.svg"),
  point: 20,
  probability: 4,
  class: itemClass.cherry,
  name: "cherry"
}, {
  index: 14,
  image: getAssertPath("/cherry.svg"),
  point: 2,
  class: itemClass.cherry,
  name: "cherry",
  probability: 12
}, {
  index: 13,
  image: getAssertPath("/bell.svg"),
  point: 10,
  class: itemClass.bell,
  probability: 5,
  name: "bell"
}, {
  index: 12,
  image: getAssertPath("/orange.svg"),
  point: 10,
  probability: 5,
  class: itemClass.orange,
  name: "orange"
}]]

const __sleep = (ms: number) => new Promise((res) => setTimeout(res, ms))
const distributionData = toDistributionData() // 根据原数据,获取分布数据
const state = reactive({
  select: [{
    value: 0
  }],
})

const { select } = toRefs(state);

function playAnimation(name:string,onFinish:()=>[]){
  type animaDataType = {
    [propName:string]:string
  }

  let animaData:animaDataType = {
    mostGold: "https://assets4.lottiefiles.com/packages/lf20_cx0mfs3q.json",
    ferrisWheel:"https://assets7.lottiefiles.com/packages/lf20_plgay0gr.json", // 摩天轮
    yanhua1: getAssertPath("/lotties/yanhua1.json"),
    yanhua2: getAssertPath("/lotties/yanhua2.json"),
    yanhua3: getAssertPath("/lotties/yanhua3.json"),
    year2023: getAssertPath("/lotties/2023.json"),
  }

  let fallGold = document.getElementById("animation")
  if(fallGold != undefined){
   let lottiePlayer = lottie.loadAnimation({
      container: fallGold,
      renderer:"svg",
      autoplay:true,
      loop:false,
      path:animaData[name],
    })

    lottiePlayer.addEventListener('complete',()=>{
      // 播放完毕后必需销毁
      lottiePlayer.destroy()
    })
  }
}
/**
 * @method 按概率分布随机
 */
function distributionRandom(datas: {
  id: number,
  count: number
}[]): number {
  const jackpot: number[] = [] // 构建奖池
  datas.map(data => {
    for (let c = 0; c < data.count; c++) {
      jackpot.push(data.id)
    }
  })

  // 为了更好的效果打乱数组 
  jackpot.sort(() => {
    return Math.random() - 0.5;
  })

  const coloredBall = RandomNumBoth(0, jackpot.length)
  const prize = jackpot[coloredBall]
  return prize
}

/**
 * @method 将二维数组转换为概率分布数组
 */
function toDistributionData() {
  let datas: {
    id: number,
    count: number
  }[] = []

  for (let items of tigerItems) {
    items.map(item => {
      datas.push({
        id: item.index,
        count: item.probability || 1
      })
    })
  }
  return datas
}


/**
 * 抽到幸运时随机触发的抽奖
 * @lastPrize 上次抽奖的奖品，以此为起点
 */
async function luckyDraw(lastPrize: number) {
  
  const drawIndex = select.value.length
  // 增加一个抽奖
  select.value.push({
    value: lastPrize
  })

  const selected = select.value.map(i=>{return i.value % 24})
  selected.pop() // 去除新增的轮盘

  // 抽奖概率中去除幸运和已中奖的物品
  var prizeValue = distributionRandom(distributionData.filter(i => { return ![21, 9].concat(selected).includes(i.id) }))
  console.log("幸运获取的值为", prizeValue)
  const round = Math.random() > 0.5 ? 24 : 48

  let value: number = prizeValue + round

  await new Promise((resolve, reject) => {
    anime({
      targets: select.value[drawIndex],
      value: value,
      duration: 1000,
      round: 1,
      easing: 'cubicBezier(.25,.01,.25,1)', // 先慢，后快，再慢
      change(anim) {
        gameGm.audioControl?.play("t2")
      },
      complete: () => {
        resolve(true)
      }
    })
  })

  const prize = getItem(select.value[drawIndex].value % 24)
  console.log("幸运抽奖获取的奖品为:", prize)
  prize?.name ? gameGm.audioControl?.play(prize.name) : ''
  return prize
}

/**
 * @method 开始抽奖
 * @param value 总前进步数
 */
async function start(callback: (result: {
  point: number,
  class: itemClass,
  event?: 'lucky'
  name?: string
}) => {}, options?: {
  avoid?: Number // 躲避概率(0-1),配置后将按概率回避,用户投注的奖项
}) {
  select.value = [{ value: select.value[0].value % 24 }] //  开始时,始终恢复为一个

  var prizeValue = distributionRandom(distributionData)
  const round = Math.random() > 0.5 ? 72 : 48

  // prizeValue = 2 // 测试奖项写死
  let value: number = prizeValue + round

  await new Promise((resolve, reject) => {
    anime({
      targets: select.value[0],
      value: value,
      duration: 2000,
      round: 1,
      easing: 'cubicBezier(.25,.01,.25,1)', // 先慢，后快，再慢
      change(anim) {
        gameGm.audioControl?.play("t2")
      },
      complete: () => {
        resolve(true)
      }
    })
  })

  const prize = getItem(select.value[0].value % 24)

  if (prize?.class == itemClass.lucky) {
    console.log("抽到了幸运")
    enum luckyItems { fail, x2, x3 }
    let luckyDistributionData = [{
      id: luckyItems.fail,
      count: 3
    }, {
      id: luckyItems.x2,
      count: 8
    }, {
      id: luckyItems.x3,
      count: 5
    }]
    var luckyResult = distributionRandom(luckyDistributionData)

    switch (luckyResult) {
      case luckyItems.fail: // 吞币
        console.log('哈哈, 真倒霉～被吞币了!')
        gameGm.audioControl?.play("fail")
        break

      case luckyItems.x2:
      case luckyItems.x3:
        const numbers = luckyResult == luckyItems.x2 ? 2 : 3
        for(let i=0;i<numbers;i++){
          const _prize = await luckyDraw(prizeValue)
          if(_prize != undefined){
            callback({
                ..._prize,
                event:'lucky'
            })
          }
        }
        break
      default:
        console.error("出现了错误", luckyResult)
    }
  }

  if (prize) {
    prize.name ? gameGm.audioControl?.play(prize.name) : ''
    await __sleep(500)
    callback(prize)
  }
}

/**
 * @method 获取指定索引的物品
 * @param index 
 */
function getItem(index: number) {
  for (let items of tigerItems) {
    // @ts-ignore
    let result = items.find((item:any) => {
      if (item.index == index) {
        return item
      }
    })
    if (result != undefined) {
      return result
    }
  }
}

/**
 * @method 标记奖品选中逻辑
 */
function selectActive(index: number) {
  return select.value.filter(i => { return i.value % 24 == index }).length > 0
}

defineExpose({
  start,
  playAnimation
})

function test() {
  console.log(select)
}

</script>

<template>

  <main class="turntable">
    <header>
      <ul>
        <li v-for="item in tigerItems[0]" :class="{ select: selectActive(item.index) }" :style="{backgroundColor: item.backageColor}">
          <img :src="item.image" alt="" />
          <span>x{{ item.point }}</span>
        </li>
      </ul>
    </header>
    <main>
      <div>
        <ul class="left">
          <li v-for="item in tigerItems[1]" :class="{ select: selectActive(item.index) }" :style="{backgroundColor: item.backageColor}"  >
            <img :src="item.image" alt="" />
            <span v-if="item.class != itemClass.lucky">x{{ item.point }} </span>
          </li>
        </ul>
      </div>
      <div class="bg" :style="{backgroundImage: `url('${backageImage}')` }">
        <div id="animation"></div>
      </div>
      <div>
        <ul class="right">
          <li v-for="item in tigerItems[2]" :class="{ select: selectActive(item.index) }" :style="{backgroundColor: item.backageColor}">
            <img :src="item.image" alt="" />
            <span v-if="item.class != itemClass.lucky">x{{ item.point }}</span>
          </li>
        </ul>
      </div>
    </main>
    <footer>
      <ul>
        <li v-for="item in tigerItems[3]" :class="{ select: selectActive(item.index) }" :style="{backgroundColor: item.backageColor}">
          <img :src="item.image" alt="" />
          <span>x{{ item.point }}</span>
        </li>
      </ul>

    </footer>
  </main>
</template>

<style lang='scss' scoped>
@import './turntable.scss';
</style>
