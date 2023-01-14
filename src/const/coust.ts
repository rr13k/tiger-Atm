import { AudioControl } from "../utils/audioContrl"
import { reactive, Ref, ref } from "vue"

export enum itemClass {apple,orange,bell,jokey,lemon,watermelon,star,cherry,lucky}

export type GameGm = {
    audioControl?:AudioControl
    soundEffectVolume: number
    bgmVolume: number
}

export const gameGm:GameGm = reactive({
    audioControl:undefined,
    soundEffectVolume:ref(50),
    bgmVolume:ref(50),
})