import { AudioControl } from "../utils/audioContrl"

export enum itemClass {apple,orange,bell,jokey,lemon,watermelon,star,cherry,lucky}

export type GameGm = {
    audioControl?:AudioControl
}

export const gameGm:GameGm  = {
    audioControl:undefined 
}