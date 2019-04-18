<template>
  <div class="main">
    <Siderbar @needOpacity="needOpacity"></Siderbar>
    <div class="main_right">
      <Headerbar></Headerbar>
      <div class="content" :class="{opacity:isOpacity}" >
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
    </div>
      <div class="audios_play clearFix" v-show=" isAudioPlay" ref="audiosPlay">
        <div class="header" ref="handle">
          <span class="iconfont icon-audios">&nbsp&nbsp&nbsp{{nowAudio.name}}</span>
          <span class="close" @click="closeAudioPlay" title="点击关闭">&times</span>
        </div>
        <div class="body">
          <div>
            <div class="play" ref="wave"></div>
            <el-button @click="playOrPause">播放/暂停</el-button>
            <div id="Container " class="Container ">{{current}}/{{duration}}</div>
          </div>
          <div class="line"></div>
          <div class="info">
            <p><span>文件类型</span><span>{{getType(nowAudio.name)}}</span></p>
            <p><span>文件大小</span><span>{{getFileSize(nowAudio.size)}}</span></p>
            <p><span>上传时间</span><span>{{nowAudio.time}}</span></p>
            <p><span>关键词</span><span class="keyword" v-for="item in nowAudio.keywords">{{item}}</span></p>
            <div class="tag_audio"><span>标签</span>
              <span class="tag" v-for="(item,index) in nowAudio.tag" :key="index">
              {{item}} <img @click="delOneTag(index)" src="../assets/img/close.png" alt="删除" title="点击删除">
              </span>
              <div class="input_outer">
                <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签" v-on:keyup.enter="addTag">
                <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag"></span>
              </div>
            </div>
            <div class="remark_audio"><span>用户评价</span>
              <span v-show="!isModifyRemark" class="remarks">{{nowAudio.remark}}</span>
              <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>
              <div class="input_outer" v-show="isModifyRemark">
                <input v-model="nowAudio.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">
                <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
  import axios from "axios"
  import { formatTime } from "../publics/public";
  import Siderbar from '../components/Sidebar'
  import Headerbar from '../components/Headerbar';
  import Draggable from "draggable"
  import WaveSurfer from 'wavesurfer.js'

  import { mapState } from "vuex"
  import { getFileSize,inputIsEmpty } from "../publics/public"
  export default {
    name: 'staff',
    components:{
      Siderbar: Siderbar,
      Headerbar: Headerbar
    },
    data () {
      return {
        // audioUrl: this.getAudioUrl,
        audioUrl: 'https://src.fanmingfei.com/nigel.mp3',
        // audioUrl:'',
        isOpacity:false,
        isModifyRemark:false,
        newTag:'',
        duration: formatTime(),
        current:  formatTime()
      }
    },
    computed:{
      ...mapState([' isAudioPlay','nowAudio']),
      isAudioPlay:{
        get(){
          return this.$store.state. isAudioPlay
        },
        set(val){
          this.$store.state. isAudioPlay = val
        }
      },
      nowAudio:{
        get(){
          return this.$store.state.nowAudio
        },
        set(val){
          this.$store.state.nowAudio = val
        }
      }
    },
    mounted(){
      window.abcd = this
      this.createWaveSurfer()
      new Draggable(this.$refs.audiosPlay, {
        handle: this.$refs.handle
      })
      // this.play()
    },
    methods: {
      getAudioUrl(){
        var baseUrl = ''
        this.audioUrl = baseUrl + this.nowAudio.url
      },
      createWaveSurfer(){
        this.wavesurfer = WaveSurfer.create({
          container: this.$refs.wave,
          waveColor:'lightgray',
          progressColor:'cornflowerblue',
          height: 100
        })
        this.wavesurfer.load(this.audioUrl)
        this.wavesurfer.on('audioprocess',()=>{
          this.getCurrent()
        })
        this.wavesurfer.on('ready',()=>{
          console.log('readyreayready')
          this.getDuration()
          // this.wavesurfer.play()
        })
      },
      playOrPause(){
        console.log('playpause')
        this.wavesurfer.playPause()
      },
      getCurrent() {
        const current = formatTime(this.wavesurfer.getCurrentTime())
        this.current = current
      },
      getDuration(){
        const duration = formatTime(this.wavesurfer.getDuration())
        // 格式化
        this.duration = duration
        //console.log(this.wavesurfer.getDuration())
        //abcd.wavepur
      },
      closeAudioPlay(){
        // 1.停止播放 2.弹窗关闭
        this.wavesurfer.pause()
        this. isAudioPlay = false
      },
      delOneTag(index) {
        // 1. 通知后台删除此标签
        // 2. 本地删除
        this.nowAudio.tag.splice(index, 1)
      },
      addTag() {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        // 2.通知后台添加标签
        // 3.本地显示添加
        this.nowAudio.tag.push(this.newTag)
        this.newTag = ''
      },
      modifyRemark() {
        this.isModifyRemark = true
      },
      completeModifyRemark() {
        // 1.通知后台该音频评论修改
        // 2.本地显示修改后的评论
        this.isModifyRemark = false
      },
      needOpacity(needOpacity) {
        this.isOpacity = needOpacity
        console.log('sssss' + this.isOpacity)
      },
      getType(name) {
        const type = name.split('.').pop()
        return type
      },
      getFileSize(size) {
        return getFileSize(size)
      },
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  /*audios_play*/
  .audios_play{
    position: fixed;
    z-index: 99;
    width:350px;
    background: white;
    /*border:1px solid rgba(211, 211, 211, 0.65);*/
    left: 200px;
    top: 15px;
    height: auto!important;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 1px 2px 9px 0px #949292fa;;
  }
  .audios_play>.header{
    background: rgba(1, 103, 241, 0.17);
    padding: 3px 8px;
    color: cornflowerblue;
  }
  .audios_play>.header .icon-audios{
    font-size: 14px;
  }
  .audios_play>.header .close{
    float: right;
    cursor: pointer;
  }
  .audios_play>.body{
    padding:10px;
  }
  .audios_play>.body div:first-child{
    text-align: center;
  }
  .audios_play>.body .play{
    text-align: center;
  }
  .audios_play>.body audio{
    width: 260px;
  }
  .audios_play .line{
    background-color: rgba(211, 211, 211, 0.65);
    height: 1px;
    margin: 10px 0px;
  }
  .audios_play>.body>.info>p>span:first-child,
  .audios_play>.body>.info>div>span:first-child{
    display: inline-block;
    width: 56px;
    margin: 5px 35px;
    color: cornflowerblue;
  }
  .audios_play .remark_audio{
    font-size: 0;
  }
  .audios_play .remark_audio span,
  .audios_play .tag_audio span{
    font-size: 14px;
  }
  .audios_play .tag_audio .tag{
    font-size: 11px;
  }
  .audios_play .remark_audio .remarks{
    font-size: 13px;
    margin-right: 10px;
  }
  .audios_play .remark_audio .icon-brush{
    font-size: 13px;
    color: cornflowerblue;
    cursor: pointer;
  }
  .audios_play .input_outer{
    position: relative;
    display: inline-block;
  }
  .audios_play .tag_input,
  .audios_play .remark_input{
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }
  .audios_play .tag_input{
    margin-left: 126px;
  }
  .audios_play .ok_tag_input,
  .audios_play .ok_remark_input{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
  /*audios_play*/
  .main_right {
    margin-left: 240px;
  }
  a {
    text-decoraction: none;
  }
  headerbar{
    z-index: 100;
  }
  .opacity{
    opacity: .8;
  }

</style>
