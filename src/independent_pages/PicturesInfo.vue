<template>
  <div class="pictures_info">
    <div class="pic_show">
      <el-carousel :class="{showSpecificInfo:showSpecificInfo,cancelSpecificInfo:!showSpecificInfo}" @change="changes"
                   indicator-position="outside" :autoplay="F" height="690px" :initial-index="initIndex">
        <el-carousel-item v-for="(item,index) in allPictures " :key="index">
          <span></span>
          <img :src="getPicUrl(item.url)" alt="图片详情" >
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="nav" :class="{showSpecificInfo:showSpecificInfo,cancelSpecificInfo:!showSpecificInfo}" v-show="isEntering">
      <a href="nowPicture.url" download="img"><span class="iconfont icon-download">下载</span></a>
      <span class="iconfont icon-share-nocircle" @click="share">分享</span>
      <span class="iconfont icon-print" @click="printPic">打印</span>
      <span class="iconfont icon-show_info" @click="needSpecificInfo">显示详细信息</span>
    </div>
    <div class="specificInfo" v-show="showSpecificInfo" >
      <p class="info_title"><span class="cancel iconfont icon-close2" @click="cancelSpecificInfo" title="点击关闭详情"></span>图片详情</p>
      <div><span class="info_name_title">文件信息</span>
        <span class="info_name">{{nowPicture.name}}</span>
        <p class="WHAndSize"><span>{{getFileSize(nowPicture.size)}}&nbsp&nbsp&nbsp</span><span>{{nowPicture.info.width}}&times;{{nowPicture.info.height}}px</span></p>
      </div>
      <p v-show="nowPicture.info.createTime"><span>拍摄时间</span><span>{{unixChange(nowPicture.info.createTime)}}</span></p>
      <p v-show="!nowPicture.info.createTime"><span>上传时间</span><span>{{unixChange(nowPicture.uploadTime)}}</span></p>
      <p><span>拍摄参数</span>{{nowPicture.info.modal}}<span v-show="!nowPicture.info.modal">未知</span></p>
      <p><span>拍摄地点</span>{{nowPicture.info.location}}<span v-show="!nowPicture.info.location">未知</span></p>
      <div class="clearFix"><span class="color_title">色系</span>
        <div class="color clearFix">
          <div v-for="(colorItem, index) in nowPicture.info.colors" :key="index" :style="getColorWidth(colorItem)"></div>
        </div>
      </div>
      <div><span class="keyword_title">关键词</span>
        <div class="keyword_outer"><span class="keyword" v-for="(item,index) in nowPicture.keyword" :key="index">{{item}}</span></div>
      </div>
      <div class="tag_pic_info"><span>标签</span>
         <span class="tag" v-for="(item,index) in nowPicture.tag" :key="index">
          {{item}} <img @click="delOneTag(index)" src="../assets/img/close.png" alt="删除" title="点击删除">
        </span>
        <div class="input_outer">
          <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签" v-on:keyup.enter="addTag">
          <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag"></span>
        </div>
      </div>
      <div class="remark_pic_info"><span>用户评价</span>
        <span v-show="!isModifyRemark" class="remarks">{{nowPicture.remark}}</span>
        <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>
        <div class="input_outer" v-show="isModifyRemark">
          <input v-model="nowPicture.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">
          <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { toggleTip,getFileSize,inputIsEmpty,unixChange,fetchList } from "../publics/public"
  export default {
    data() {
      return {
        F:false,
        markup:'',
        allPictures: [],
        showSpecificInfo:true,
        nowPicture:{
          info: {}
          },
        initIndex:0,
        isEntering:true,
        isModifyRemark:false,
        newTag:''
      }
    },
    mounted() {
      const nowId = this.$route.query.id
      // 1.获取所有图片  2.显示之前点击图片
      fetchList('/imageinfo').then(data=>{
        data.forEach(el=>{
          el.info = JSON.parse(el.info)
          if (el.keyword) {
            el.keyword = el.keyword.split(',')
          }
          if (el.tag) {
            el.tag = el.tag.split(',')
          }else {
            el.tag = []
          }
        })
        this.allPictures = data
        this.initIndex = this.allPictures.findIndex(el=>{return el.id == nowId})
        this.nowPicture = this.allPictures[this.initIndex]
      }).catch( (error) =>{
        toggleTip(this, error)
      })
    },
    methods:{
      getPicUrl(url){
        var baseUrl = window.baseUrl +  "/testpreview/"
        return baseUrl + url
      },
      unixChange(timeStamp){
        return  unixChange(timeStamp)
      },
      getColorWidth(item){
        let r = item.red
        let g = item.green
        let b = item.blue
        let bgc = ("background-color: rgb(" + r + "," + g + "," + b + ");")
        console.log(bgc)
        let w = (Math.round( item.score * Math.pow( 10, 2 + 2 ) ) / Math.pow( 10, 2 ) ).toFixed(2) + '%'
        return  bgc + ("width: " + w)
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
        this.nowPicture.tag.splice(index, 1)
      },
      addTag() {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        // 2.通知后台添加标签
        // 3.本地显示添加
        this.nowPicture.tag.push(this.newTag)
        this.newTag = ''
      },
      getFileSize(size){
        return getFileSize(size)
      },
      cancelSpecificInfo(){
        this.showSpecificInfo = false
      },
      needSpecificInfo(){
        this.showSpecificInfo = true
      },
      share(){

      },
      printPic(){

      },
      addMarkup(){

      },
      changes(index,oldIndex){
        this.nowPicture = this.allPictures[index]
      }
    }
  }
</script>

<style scoped>
  .nav{
    position: absolute;
    top: 10px;
    z-index: 200;
    text-align: center;
  }
  .nav>a{
    text-decoration: none;
  }
  .nav span{
    color: white;
    margin: 10px;
    cursor: pointer;
  }
  .specificInfo{
    background-color: white;
    width: 24%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
  }
  .specificInfo .info_name_title{
    float: left;
  }
  .specificInfo .info_name{
    display: inline-block;
    width:225px;
    word-break: break-word;
  }
  .specificInfo>p>span:first-child,
  .specificInfo>div>span:first-child{
    color: rgba(133, 127, 127, 0.85);
    display: inline-block;
    width: 80px;
  }
  .specificInfo>div .WHAndSize{
    color: #c1c1c1;
    padding:5px 0  5px 80px;
    font-size: 14px;
  }
  .specificInfo .color_title{
    float: left;
  }
  .specificInfo .color{
    display: inline-block;
    width: 235px;
    height: 30px;
  }
  .specificInfo .color>div{
    height: 30px;
    float: left;
  }
  .specificInfo .keyword_title{
    float: left;
  }
  .specificInfo .keyword_outer{
    width: 235px;
    display: inline-block;
  }
  .info_title{
    color: rgba(51, 51, 51, 0.8);
    font-size: 20px;
  }
  .cancel:hover{
    color: rgba(33, 33, 33, 0.89);
  }
  .specificInfo>span{
    font-size: 20px;
  }
  .specificInfo>p,
  .specificInfo>div{
    padding: 10px;
    margin: 10px;
  }
  .specificInfo>p:first-child{
    margin-bottom: 15px;
  }
  .specificInfo .input_outer{
    position: relative;
    display: inline-block;
  }
  .specificInfo .tag_pic_info .input_outer{
    margin-left: 85px;
  }
  .specificInfo .tag_input,
  .specificInfo .remark_input{
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }
  .specificInfo .ok_tag_input,
  .specificInfo .ok_remark_input{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
  .specificInfo .tag_pic_info .tag{
    font-size: 11px;
  }
  .specificInfo .remark_pic_info .remarks{
    font-size: 13px;
    margin-right: 10px;
  }
  .specificInfo .remark_pic_info .icon-brush{
    font-size: 13px;
    color: cornflowerblue;
    cursor: pointer;
  }
  .specificInfo>.info_title>span.cancel{
    cursor: pointer;
    font-size: 18px;
    width: 40px
  }
  .showSpecificInfo{
    width: 76%;
  }
  .cancelSpecificInfo{
    width: 100%;
  }
  .el-carousel{
    height: 100%;
    text-align: center;
  }
  .el-carousel__item>span{
    height: 100%;
    display: inline-block;
    vertical-align: middle;
  }
  .el-carousel__item>img{
    vertical-align: middle;
    max-width: 100%;
    max-height: 96%;
  }
  .el-carousel__item {
    background-color: rgba(17, 17, 17, 0.97);
  }

</style>
