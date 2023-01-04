import Pizzicato from 'pizzicato'  // doc: https://alemangui.github.io/pizzicato/

// 音效管理器
type SoundEffect = {
    src:string,
    name:string,
    player?: Pizzicato.Sound,
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

    /**
     * 
     * @param soundEffects 
     * @param audioCount 最大并发的音效数
     */
    constructor(soundEffects:SoundEffect[], audioCount:number = 5){
        this.soundEffects = soundEffects
        this.playerList = []
        for(let sound of soundEffects){
            var acousticGuitar = new Pizzicato.Sound({
                source: 'file',
                options:{
                    path:sound.src,
                    volume: sound.volume,
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

    play(name:string){
        let sound = this.soundEffects.find(s=>{return s.name == name})
        if (sound == undefined){
            throw new Error(`无法播放音乐,未找到音乐-${name}`)
        }
        // 播放中再播放就无效了, 因此临时clone一个播放
        if (sound.player?.playing){
            let clone_player = sound.player.clone()
            clone_player.play()
        } else {
            sound.player?.play()
        }
        
    }
}