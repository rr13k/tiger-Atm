// 音效管理器
type SoundEffect = {
    src:string,
    duration: number,
    type:string,
    name:string,
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
        for(let a = 0 ; a <  audioCount ;a++){
            const audioElement = document.createElement('audio')
            let dom = document.body.appendChild(audioElement)
            this.playerList.push({
                dom,
                finishTime:0
            })
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

    _play(player:Player,soundEffect:SoundEffect){
        let now = new Date().getTime()
        player.dom.setAttribute('src',soundEffect.src)
        player.dom.setAttribute('type',soundEffect.type)
        player.dom.volume = soundEffect.volume
        player.finishTime = now + soundEffect.duration
        // 非定时任务播放,可能播放旧的音频资源
        setTimeout(() => {
            player.dom.play()
        }, 0);
    }

    play(name:string){
        let sound = this.soundEffects.find(s=>{return s.name == name})
        if (sound == undefined){
            throw new Error(`无法播放音乐,未找到音乐-${name}`)
        }
        let player = this.getPlayer()
        this._play(player,sound)
    }
}