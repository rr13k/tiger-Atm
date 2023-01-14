<script setup lang="ts">
import { ref, onMounted, reactive, toRefs, watch } from 'vue'
import Turntable from '../../components/turntable/turntable.vue'
import Scoreboard from '../../components/scoreboard/scoreboard.vue'
import Chip from '../../components/chip/chip.vue'
import { AudioControl } from '../../utils/audioContrl';
import { gameGm } from '../../const/coust';
import { getAssertPath } from '../../utils/getAssertPath';
import anime from 'animejs' // https://easings.net/zh-cn# 缓动函数参考
import { __sleep } from '../../utils/suger';

defineProps<{ msg: string }>()
let bgmStarted = false

const state = reactive({
  fraction: 0, // 分数
  goldCoin: 100, // 金币
  volume: false,
  dialogs: {
    setting: {
      visible: false,
    }
  }
})

const { fraction, goldCoin, volume, dialogs } = toRefs(state);

watch(() => gameGm.bgmVolume, async (v) => {
  // 调整背景音
  (document.getElementById("bgm") as HTMLAudioElement).volume = v / 100
}, { deep: true })

watch(() => gameGm.soundEffectVolume, (v) => {
  // 调整背景音
  gameGm.audioControl?.play('bi');
  (document.getElementById("bgm") as HTMLAudioElement).volume = v / 100
})

// 新年的动效
// https://assets4.lottiefiles.com/packages/lf20_CuF8dwGNHi.json

// 动画2023
// https://assets5.lottiefiles.com/packages/lf20_y7xcP4oERZ.json

onMounted(() => {
  // 限定每天100硬币
  let nowDate = getNowYYMMDD()
  let __goldCoin = localStorage.getItem(nowDate)
  // __goldCoin = null // 测试获得金币
  if (__goldCoin == null) {
    console.log("今天第一次进入,奖励100金币")
    localStorage.setItem(nowDate, "100")
  } else {
    goldCoin.value = Number(__goldCoin)
  }

  // 播放新年动画
  turntable.value.playAnimation("year2023")

  prohibitZoom()

  const startBgm = () => {
    if (bgmStarted) return
    bgmStarted = true;
    (document.getElementById("bgm") as HTMLAudioElement).play()
  }
  document.body.addEventListener('click', startBgm)
  copyright()
})

window.onbeforeunload = function (e) {
  let nowDate = getNowYYMMDD()
  localStorage.setItem(nowDate, String(goldCoin.value + fraction.value))
}

/**
 * @method 获取当前年月日
 */
function getNowYYMMDD(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
}

const turntable = ref(Turntable)

/**
 * @method 版权申明
 */
function copyright() {
  console.log('%c--------------版权声明-----------', 'color: blue')
  console.log('%c-         个人演示作品           -', 'color: blue')
  console.log('%c-         禁止商业使用           -', 'color: red')
  console.log('%c-        author:renran         -', 'color: green')
  console.log('%c-  github.com/rr13k/tiger-Atm  -', 'color: black')
  console.log('%c----------------end-------------', 'color: blue')
}

const audioControl = new AudioControl([{
  src: getAssertPath('/mp3/t1.mp3'),
  name: 't1',
  volume: 1
}, {
  src: getAssertPath('/mp3/t2.mp3'),
  name: 't2',
  volume: 0.1
}, {
  src: getAssertPath('/mp3/coin.mp3'),
  name: 'coin',
  volume: 0.2
}, {
  src: getAssertPath('/mp3/poor.mp3'),
  name: 'poor',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/apple.mp3'),
  name: 'apple',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/bell.mp3'),
  name: 'bell',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/big_jokey.mp3'),
  name: 'big_jokey',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/cherry.mp3'),
  name: 'cherry',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/lemon.mp3'),
  name: 'lemon',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/little_jokey.mp3'),
  name: 'little_jokey',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/orange.mp3'),
  name: 'orange',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/star.mp3'),
  name: 'star',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/watermelon.mp3'),
  name: 'watermelon',
  volume: 0.3
}, {
  src: getAssertPath('/mp3/fail.mp3'),
  name: 'fail',
  volume: 0.8
}, {
  src: getAssertPath('/mp3/bi.mp3'),
  name: 'bi',
  volume: 0.8
}, {
  src: getAssertPath('/mp3/huanhu1.mp3'),
  name: 'huanhu1',
  volume: 0.8
}, {
  src: getAssertPath('/mp3/huanhu2.mp3'),
  name: 'huanhu2',
  volume: 0.8
}, {
  src: getAssertPath('/mp3/huanhu3.mp3'),
  name: 'huanhu3',
  volume: 0.8
}, {
  src: getAssertPath('/mp3/huanhu4.mp3'),
  name: 'huanhu4',
  volume: 0.8
}, {
  src: getAssertPath('/mp3/pao.mp3'),
  name: 'pao',
  volume: 0.8
}
])

gameGm.audioControl = audioControl

/**
 * @method 金币结算
 * @param vlaue 结算的金币,可以为正也可以为负
 * @description return 获取不到返回值,必须使用callback
 * @returns 返回结算的结果，是否成功
 */
async function goldCalc(value: number, callback?: (resule: boolean) => {}) {
  let result = true
  if (value < 0 && goldCoin.value + value < 0) {
    result = false
  } else {
    if (Math.abs(value) != 1) {
      await animeSync({
        targets: goldCoin,
        value: goldCoin.value + value,
        duration: 500,
        round: 1,
        easing: 'easeInQuad' // 先慢后快
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
function prohibitZoom() {
  // 禁止双指放大
  document.documentElement.addEventListener('touchstart', function (event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);

  // 禁止h5长按触发右键
  document.oncontextmenu = (e) => { return false } // win
  document.addEventListener('contextmenu', (e) => { e.preventDefault() }) // mac
}

/**
 * @method 异步动画转同步动画
 */
function animeSync(params: anime.AnimeParams) {
  return new Promise<boolean>((resolve, reject) => {
    anime({
      ...params,
      complete: () => {
        resolve(true)
      }
    })
  })
}

/**
 * @method 结算分数
 * @param exchange 是否自动兑换成金币，默认true, 当多次抽取时不能立即换算金币
 */
async function costFraction(_fraction: number, exchange: boolean = true, callback: () => {}) {
  // 增加积分
  await animeSync({
    targets: fraction,
    value: fraction.value + _fraction,
    duration: 500,
    round: 1,
    easing: 'easeInQuad', // 先慢后快
  })

  await __sleep(500)

  if (exchange == false) return

  if (_fraction === 0 && fraction.value == 0) {
    callback()
    return
  }

  console.log("分数变化", _fraction)

  // 将积分兑换成硬币
  await Promise.all([
    animeSync({
      targets: goldCoin,
      value: goldCoin.value + fraction.value,
      duration: 500,
      round: 1,
      easing: 'easeInQuad', // 先慢后快
      complete: () => {
        console.log("动画执行完啦")
      }
    }),

    animeSync({
      targets: fraction,
      value: 0,
      duration: 500,
      round: 1,
      easing: 'easeInQuad', // 先慢后快
      complete: () => {
        console.log("动画执行完啦")
      }
    })
  ])

  // 结束后,等一会在返回(用于观测积分是否有问题)
  await __sleep(500)

  callback()
}

function closeSetting() {
  dialogs.value.setting.visible = false
}

function changeVolume() {
  volume.value = !volume.value
  console.log(volume.value)

  if (volume.value == false) {
    // 关闭bgm
    (document.getElementById("bgm") as HTMLAudioElement).pause()

  } else {
    // 开启bum
    (document.getElementById("bgm") as HTMLAudioElement).play()
  }
}

// 修改音效
function getVolumeStatus() {
  var img_path = ''
  if (volume.value) {
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
      <svg @click="dialogs.setting.visible = true" t="1673680468258" class="icon setting-icon" viewBox="0 0 1024 1024"
        version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3488" width="20" height="20">
        <path
          d="M512 697.6c102.4 0 182.4-83.2 182.4-185.6 0-102.4-83.2-185.6-182.4-185.6-102.4 0-182.4 83.2-182.4 185.6C329.6 614.4 412.8 697.6 512 697.6L512 697.6zM512 646.4c-73.6 0-134.4-60.8-134.4-134.4 0-73.6 60.8-134.4 134.4-134.4 73.6 0 134.4 60.8 134.4 134.4C646.4 585.6 585.6 646.4 512 646.4L512 646.4z"
          p-id="3489"></path>
        <path
          d="M249.015232 843.178592c35.2 28.8 73.6 51.2 112 67.2 41.6-38.4 96-60.8 150.4-60.8 57.6 0 108.8 22.4 150.4 60.8 41.6-16 80-38.4 112-67.2-12.8-54.4-3.2-112 22.4-163.2 28.8-48 73.6-86.4 128-102.4 3.2-22.4 6.4-44.8 6.4-67.2 0-22.4-3.2-44.8-6.4-67.2-54.4-16-99.2-54.4-128-102.4-28.8-48-35.2-108.8-22.4-163.2-35.2-28.8-73.6-51.2-112-67.2-41.6 38.4-92.8 60.8-150.4 60.8-54.4 0-108.8-22.4-150.4-60.8-41.6 16-80 38.4-112 67.2 12.8 54.4 3.2 112-22.4 163.2-28.8 48-73.6 86.4-128 102.4-3.2 22.4-6.4 44.8-6.4 67.2 0 22.4 3.2 44.8 6.4 67.2 54.4 16 99.2 54.4 128 102.4C252.215232 731.178592 261.815232 788.778592 249.015232 843.178592M361.015232 958.378592c-54.4-19.2-105.6-48-150.4-89.6-6.4-6.4-9.6-16-6.4-22.4 16-48 9.6-99.2-16-140.8-25.6-44.8-64-73.6-112-83.2-9.6-3.2-16-9.6-16-19.2-6.4-28.8-9.6-60.8-9.6-89.6 0-28.8 3.2-57.6 9.6-89.6 3.2-9.6 9.6-16 16-19.2 48-12.8 89.6-41.6 112-83.2 25.6-44.8 28.8-92.8 16-140.8-3.2-9.6 0-19.2 6.4-22.4 44.8-38.4 96-67.2 150.4-89.6 9.6-3.2 16 0 22.4 6.4 35.2 35.2 80 57.6 128 57.6 48 0 96-19.2 128-57.6 6.4-6.4 16-9.6 22.4-6.4 54.4 19.2 105.6 48 150.4 89.6 6.4 6.4 9.6 16 6.4 22.4-16 48-9.6 99.2 16 140.8 25.6 44.8 64 73.6 112 83.2 9.6 3.2 16 9.6 16 19.2 6.4 28.8 9.6 60.8 9.6 89.6 0 28.8-3.2 57.6-9.6 89.6-3.2 9.6-9.6 16-16 19.2-48 12.8-89.6 41.6-112 83.2-25.6 44.8-28.8 92.8-16 140.8 3.2 9.6 0 19.2-6.4 22.4-44.8 38.4-96 67.2-150.4 89.6-9.6 3.2-16 0-22.4-6.4-35.2-35.2-80-57.6-128-57.6-48 0-96 19.2-128 57.6-3.2 3.2-9.6 6.4-16 6.4C364.215232 958.378592 361.015232 958.378592 361.015232 958.378592z"
          p-id="3490"></path>
      </svg>
    </div>
  </div>
  <header>
    <div>
      <span>奖金数:</span>
      <Scoreboard :length="4" :value="fraction" :font_wight="20" />
    </div>
    <div>
      <span>金币数:</span>
      <Scoreboard :length="4" :value="goldCoin" :font_wight="20" />
    </div>
  </header>
  <Turntable msg="nihao" ref="turntable" :size="100" />
  <Chip @start="turntable.start" @playAnimation="turntable.playAnimation" @betting="goldCalc"
    @costFraction="costFraction" />
  <!-- 背景音乐 -->
  <audio id="bgm" :src="getAssertPath('/mp3/backage.mp3')" loop="true" :volume="gameGm.bgmVolume / 100"></audio>

  <Transition>
    <div v-if="dialogs.setting.visible" class="setting">
      <ul>
        <li>
          <svg @click="closeSetting" t="1673679286045" class="icon close" viewBox="0 0 1024 1024" version="1.1"
            xmlns="http://www.w3.org/2000/svg" p-id="2540" width="200" height="200">
            <path
              d="M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z"
              fill="#000000" p-id="2541"></path>
          </svg>
        </li>
        <li>
          <b>背景音量</b><input type="range" v-model="gameGm.bgmVolume" />
        </li>
        <li>
          <b>音效音量</b><input type="range" v-model="gameGm.soundEffectVolume" :volume="gameGm.soundEffectVolume / 100" />
        </li>
        <li>
          <b>作者</b> <a href="https://github.com/rr13k">任然</a>
        </li>
        <li>
          <b>玩法简介</b>
          <p>每日将免费获得<b style="color: #f1c41a;">100</b>金币,点击最下方按钮进行下注，当抽中下注的内容时会按
            <b style="color: rgb(206 123 177);">奖品分值*下注金币数</b>
            兑换为积分，积分在抽奖结束后将自动兑换为金币。
          </p>
        </li>
      </ul>
    </div>
  </Transition>

</template>

<style lang='scss' scoped>
@import './index.scss';
</style>