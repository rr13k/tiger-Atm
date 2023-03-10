import { gameGm } from './../const/coust';
import Pizzicato from 'pizzicato'  // doc: https://alemangui.github.io/pizzicato/

// 音效管理器
type SoundEffect = {
    src:string,
    name:string,
    player?: Pizzicato.Sound,
    loop?:boolean,
    volume: number // 音量0-1
}

// 播放队列
type Player = {
    dom:HTMLAudioElement,
    finishTime:number // 当前时间大于完成时间表示可用
}

export class AudioControl {
    soundEffects:SoundEffect[] // 注册的音效
    playerList:Player[]
    bgmList:Pizzicato.Sound[] // 管理bgm
    turn?:Pizzicato.Sound

    /**
     * 
     * @param soundEffects 
     * @param audioCount 最大并发的音效数
     */
    constructor(soundEffects:SoundEffect[]){
        this.soundEffects = soundEffects
        this.playerList = []
        this.bgmList = []

        for(let sound of soundEffects){
            var acousticGuitar = new Pizzicato.Sound({
                source: 'file',
                options:{
                    path:sound.src,
                    volume: sound.volume,
                    loop:sound.loop,
                }
            }, function() {
                // Sound loaded!
            });
            sound.player = acousticGuitar
        }
    }

    // 获取一个可用的播放器
    getPlayer(){
        let now = new Date().getTime()
        let player = this.playerList.find(p=>{ return p.finishTime== 0 || now > p.finishTime })
        if(player == undefined){
            console.log(now,this.playerList)
            throw new Error("当前没有可用的音乐播放器")
        }
        return player
    }

    changeBgmVolume() {
        for(let bgm of this.bgmList ){
            bgm.volume = gameGm.bgmVolume / 100
        }
    }

    stopTurn(){
        if(this.turn){
            this.turn.stop()
        }else{
            console.error("终止异常")
        }
    }

    play(name:string){
        let sound = this.soundEffects.find(s=>{return s.name == name})
        if (sound == undefined || !sound.player){
            throw new Error(`无法播放音乐,未找到音乐-${name}`)
        }

        if(sound.player){
            sound.player.volume = gameGm.soundEffectVolume  / 100
        }

        let _player = sound.player
        // 播放中再播放就无效了, 因此临时clone一个播放
        if (sound.player?.playing){
            _player = sound.player.clone()
        } 

        if(sound.loop) { // loop为背景音乐
            _player.volume = gameGm.bgmVolume / 100
            this.bgmList.push(_player)
        }

        if(name == 'zhuandong') {
            this.turn = _player
        }

        // @ts-ignore 防止初始配置音量报错
        if ( _player.getRawSourceNode instanceof Function) {
            _player.play()
        }else{
            // 无法播放音乐，未加载完成
            return false
        }
        return true
    }
}