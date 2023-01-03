<script setup lang="ts">
import { ref,onMounted,reactive,toRefs } from 'vue'
import Turntable from '../../components/turntable/turntable.vue'
import Scoreboard from '../../components/scoreboard/scoreboard.vue'
import Chip from '../../components/chip/chip.vue'
import { AudioControl } from '../../utils/audioContrl';
import { gameGm } from '../../const/coust';
import { ConstantTypes } from '@vue/compiler-core';
import { getAssertPath } from '../../utils/getAssertPath';

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

onMounted(()=>{
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
    duration: 300,
    type:'audio/mp3',
    name:'t1',
    volume: 1
  },{
    src:getAssertPath('/mp3/t2.mp3'),
    name:'t2',
    duration: 300,
    type:'audio/mp3',
    volume: 0.1
  },{
    src:'data:audio/mpeg;base64,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',
    name:'coin',
    duration: 1000,
    type:'audio/mpeg',
    volume: 0.2
  },{
    src:getAssertPath('/mp3/poor.mp3'),
    name:'poor',
    duration: 1000,
    type:'audio/mpeg',
    volume: 0.3
  }],20)

gameGm.audioControl = audioControl

/**
 * @method 金币结算
 * @param vlaue 结算的金币,可以为正也可以为负
 * @description return 获取不到返回值,必须使用callback
 * @returns 返回结算的结果，是否成功
 */
function goldCalc(value:number,callback?:(resule:boolean)=>{}){
  let result = true
  if(value < 0 && goldCoin.value + value < 0) {
    result = false
  }else{
    goldCoin.value += value
  }

  callback ? callback(result) : ''
}


const __sleep = (ms:number) => new Promise((res) => setTimeout(res, ms))

/**
 * @method 结算分数
 */
async function costFraction(_fraction:number,callback:()=>{}){
  fraction.value += _fraction

  await __sleep(1000)
  
  // 动画过完后，将积分加到金币中
  // 一个加,一个减同步进行
  goldCoin.value += _fraction
  fraction.value = 0

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
  <div>
    <div class="options">
      <button @click="changeVolume" :style="{backgroundImage: getVolumeStatus()}"   >
    </button>
    </div>
  </div>
  <header>
    <span>当前分数:</span> <Scoreboard :length="4" :value="fraction" :font_wight="20"/>
    <span>金币数:</span> <Scoreboard :length="4" :value="goldCoin" :font_wight="20"/>
  </header>
  <Turntable msg="nihao" ref="turntable" :size="100"/>
  <Chip @start="turntable.luckDraw" @betting="goldCalc" @costFraction="costFraction" />
  <!-- <button @click="test">test</button> -->
  <!-- 背景音乐 -->
  <audio id="bgm" src="/mp3/backage.mp3" loop="true" volume="0.2" ></audio>

  <!-- 测试 -->
  <!-- <audio id="bgm" src="/mp3/coin.mp3" controls ></audio> -->
</template>

<style lang='scss' scoped>
    @import './index.scss';
</style>