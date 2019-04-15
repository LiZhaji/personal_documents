<template>
  <div class="video_info clearFix">
    <div class="video_play_outer" :class="{showSpecificInfo:showSpecificInfo,cancelSpecificInfo:!showSpecificInfo}">
      <video src="http://192.168.0.133:8080/testpreview/zzz/VIDEO/81191347-1-6.mp4" controls></video>
    </div>
    <div class="specific_info" v-show="showSpecificInfo">
      <p class="info_title"><span class="cancel iconfont icon-close2" @click="cancelSpecificInfo" title="点击关闭详情"></span>图片详情</p>
      <div><span>文件信息</span><span>{{nowVideo.name}}</span>
      </div>
      <p><span>文件大小</span>{{getFileSize(nowVideo.size)}}</p>
      <p><span>拍摄时间</span>{{unixChange(nowVideo.createTime)}}</p>
      <p><span>视频信息</span>{{nowVideo.location}}<span v-show="!nowVideo.location">未知</span></p>
      <div><span class="keyword_title">关键词</span>
        <div class="keyword_outer"><span class="keyword" v-for="(item,index) in nowVideo.keyword" :key="index">{{item}}</span></div>
      </div>
      <div class="tag_video_info"><span>标签</span>
        <span class="tag" v-for="(item,index) in nowVideo.tag" :key="index">
        {{item}} <img @click="delOneTag(index)" src="../assets/img/close.png" alt="删除" title="点击删除">
      </span>
        <div class="input_outer">
          <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签" v-on:keyup.enter="addTag">
          <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag"></span>
        </div>
      </div>
      <div class="remark_video_info"><span>用户评价</span>
        <span v-show="!isModifyRemark" class="remarks">{{nowVideo.remark}}</span>
        <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>
        <div class="input_outer" v-show="isModifyRemark">
          <input v-model="nowVideo.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">
          <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { inputIsEmpty,getFileSize,unixChange } from "../publics/public"
  export default {
    name: "VideoInfo",
    data(){
      return{
        nowVideo:{
          name:'抗日战争.MP4',
          size:123283982,
          createTime:23244343,
          keyword:['xxs','ssssss'],
          tag:['xsxs']
        },
        showSpecificInfo:true,
        isModifyRemark:false,
        newTag:'',
        showSpecificInfo:true
      }
    },
    mounted() {
      this.nowVideo = this.$router.query.nowVideo
    },
    methods:{
      cancelSpecificInfo(){
        this.showSpecificInfo = false
      },
      needSpecificInfo(){
        this.showSpecificInfo = true
      },
      modifyRemark() {
        this.isModifyRemark = true
      },
      completeModifyRemark() {
        // 1.通知后台该音频评论修改
        // 2.本地显示修改后的评论
        this.isModifyRemark = false
      },
      delOneTag(index) {
        // 1. 通知后台删除此标签
        // 2. 本地删除
        this.nowVideo.tag.splice(index, 1)
      },
      addTag() {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        // axios.post()
        // 2.通知后台添加标签
        // 3.本地显示添加
        this.nowVideo.tag.push(this.newTag)
        this.newTag = ''
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      },
      getFileSize(size){
        return getFileSize(size)
      }
    }
  }
</script>

<style scoped>
  .video_play_outer{
    background-color: #444444;
    float: left;
    padding: 10px;
    box-sizing: border-box;
  }
  .video_play_outer video{
    width: 100%;
  }
  .showSpecificInfo{
    width: 74%;
  }
  .cancelSpecificInfo{
    width: 100%;
  }
  .specific_info{
    background-color: white;
    float: left;
    width: 24%;
  }
  .specific_info>p>span:first-child,
  .specific_info>div>span:first-child{
    color: rgba(133, 127, 127, 0.85);
    display: inline-block;
    width: 80px;
  }
  .specific_info .color>div{
    height: 30px;
    float: left;
  }
  .specific_info .keyword_title{
    float: left;
  }
  .specific_info .keyword_outer{
    width: 235px;
    display: inline-block;
  }
  .specific_info .info_title{
    color: rgba(51, 51, 51, 0.8);
    font-size: 20px;
  }
  .specific_info .cancel:hover{
    color: rgba(33, 33, 33, 0.89);
  }
  .specific_info>span{
    font-size: 20px;
  }
  .specific_info>p,
  .specific_info>div{
    padding: 10px;
    margin: 10px;
  }
  .specific_info>p:first-child{
    margin-bottom: 15px;
  }
  .specific_info .input_outer{
    position: relative;
    display: inline-block;
  }
  .specific_info .tag_video_info .input_outer{
    margin-left: 85px;
  }
  .specific_info .tag_input,
  .specific_info .remark_input{
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }
  .specific_info .ok_tag_input,
  .specific_info .ok_remark_input{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
  .specific_info .tag_video_info .tag{
    font-size: 11px;
  }
  .specific_info .remark_video_info .remarks{
    font-size: 13px;
    margin-right: 10px;
  }
  .specific_info .remark_video_info .icon-brush{
    font-size: 13px;
    color: cornflowerblue;
    cursor: pointer;
  }
  .specific_info>.info_title>span.cancel{
    cursor: pointer;
    font-size: 18px;
    width: 40px
  }

</style>
