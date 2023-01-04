<script setup lang="ts">
import { ref,onMounted,reactive,toRefs } from 'vue'
import Turntable from '../../components/turntable/turntable.vue'
import Scoreboard from '../../components/scoreboard/scoreboard.vue'
import Chip from '../../components/chip/chip.vue'
import { AudioControl } from '../../utils/audioContrl';
import { gameGm } from '../../const/coust';
import { getAssertPath } from '../../utils/getAssertPath';
import anime from 'animejs' // https://easings.net/zh-cn# 缓动函数参考
import Pizzicato from 'pizzicato'

defineProps<{ msg: string }>()

let bgmStarted = false 

const state = reactive({
  fraction: 0, // 分数
  goldCoin: 100, // 金币
  volume:false
})

const { fraction,goldCoin,volume } = toRefs(state);

/**
 * @method 版权申明
 */
function copyright(){
  console.log('%c--------------版权声明-----------','color: blue')
  console.log('%c-         个人演示作品           -','color: blue')
  console.log('%c-         禁止商业使用           -','color: red')
  console.log('%c-        author:renran         -','color: green')
  console.log('%c-  github.com/rr13k/tiger-Atm  -','color: black')
  console.log('%c----------------end-------------','color: blue')
}

/**
 * @method 测试专用函数
 */
function test(){
  console.log("执行了测试",Pizzicato)
}

onMounted(()=>{
  prohibitZoom()

  const startBgm = ()=>{
    if(bgmStarted) return
    bgmStarted = true;
    (document.getElementById("bgm") as HTMLAudioElement).play()
  }
  document.body.addEventListener('click',startBgm)
  copyright()
})

const turntable = ref(Turntable)

const audioControl = new AudioControl([{
    src:getAssertPath('/mp3/t1.mp3'),
    name:'t1',
    volume: 1
  },{
    src:getAssertPath('/mp3/t2.mp3'),
    name:'t2',
    volume: 0.1
  },{
    src:getAssertPath('/mp3/coin.mp3'),
    name:'coin',
    volume: 0.2
  },{
    src:getAssertPath('/mp3/poor.mp3'),
    name:'poor',
    volume: 0.3
  }],20)

gameGm.audioControl = audioControl

/**
 * @method 金币结算
 * @param vlaue 结算的金币,可以为正也可以为负
 * @description return 获取不到返回值,必须使用callback
 * @returns 返回结算的结果，是否成功
 */
async function goldCalc(value:number,callback?:(resule:boolean)=>{}){
  let result = true
  if (value < 0 && goldCoin.value + value < 0) {
    result = false
  } else {
    if (Math.abs(value) != 1) {
      await animeSync({
        targets: goldCoin,
        value: goldCoin.value + value,
        duration:500,
        round:1,
        easing:'easeInQuad' // 先慢后快
      })
    } else {
      goldCoin.value += value
    }
  }
  callback ? callback(result) : ''
}

/**
 * @method 禁止页面缩放
 */
function prohibitZoom(){
  // 禁止双指放大
  document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);

  // 禁止h5长按触发右键
  document.oncontextmenu = (e)=>{return false} // win
  document.addEventListener('contextmenu',(e)=>{e.preventDefault()}) // mac
}

const __sleep = (ms:number) => new Promise((res) => setTimeout(res, ms))

/**
 * @method 异步动画转同步动画
 */
function animeSync(params: anime.AnimeParams) {
  return  new Promise<boolean>((resolve, reject) => {
    anime({
      ...params,
      complete:()=>{
        resolve(true)
      }
    })
  })
}

/**
 * @method 结算分数
 */
async function costFraction(_fraction:number, callback:()=>{}){
  // 增加积分
  await animeSync({
    targets: fraction,
    value: fraction.value + _fraction,
    duration:500,
    round:1,
    easing:'easeInQuad', // 先慢后快
  })
  
  await __sleep(500)
  
  // 将积分兑换成硬币
  await Promise.all([
    animeSync({
        targets: goldCoin,
        value: goldCoin.value + _fraction,
        duration:500,
        round:1,
        easing:'easeInQuad', // 先慢后快
        complete:()=>{
          console.log("动画执行完啦")
        }
      }),

    animeSync({
    targets: fraction,
    value: 0,
    duration:500,
    round:1,
    easing:'easeInQuad', // 先慢后快
    complete:()=>{
      console.log("动画执行完啦")
    }
  })
  ])

  // 结束后,等一会在返回(用于观测积分是否有问题)
  await __sleep(500)

  callback()
}

function changeVolume(){
  volume.value = !volume.value
  console.log(volume.value)

  if(volume.value == false){
    // 关闭bgm
    (document.getElementById("bgm") as HTMLAudioElement).pause()
    
  }else{
    // 开启bum
    (document.getElementById("bgm") as HTMLAudioElement).play()
  }
}

function getVolumeStatus(){
  var img_path = ''
  if(volume.value) {
    img_path = `url(${getAssertPath('/volume_open.svg')})`
  } else {
    img_path = `url(${getAssertPath('/volume_close.svg')})`
  }
  return img_path
}

</script>

<template>
  <!-- <button @click="test">test</button> -->
  <div>
    <div class="options">
      <button @click="changeVolume" :style="{backgroundImage: getVolumeStatus()}"   >
    </button>
    </div>
  </div>
  <header>
    <div>
      <span>当前分数:</span> <Scoreboard :length="4" :value="fraction" :font_wight="20"/>
    </div>
    <div>
      <span>金币数:</span> <Scoreboard :length="4" :value="goldCoin" :font_wight="20"/>
    </div>
  </header>
  <Turntable msg="nihao" ref="turntable" :size="100"/>
  <Chip @start="turntable.luckDraw" @betting="goldCalc" @costFraction="costFraction" />
  <!-- <button @click="test">test</button> -->
  <!-- 背景音乐 -->
  <audio id="bgm" :src="getAssertPath('/mp3/backage.mp3')" loop="true" volume="0.2" ></audio>

  <!-- 测试 -->
  <!-- <audio id="bgm" src="/mp3/coin.mp3" controls ></audio> -->
</template>

<style lang='scss' scoped>
    @import './index.scss';
</style>