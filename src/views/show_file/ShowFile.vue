<template>
  <div class="show_file clearFix" >
    <div class="file_nav">
      <span @click="backToAll">返回</span>
    </div>
    <div class="file_info">
      <svg class="icon" aria-hidden="true" @click.stop="toggleCollectionNotIndex">
        <use v-show="!nowFile.collection" xlink:href="#icon-collection"></use>
        <use v-show="nowFile.collection" xlink:href="#icon-collection_fill"></use>
      </svg><svg class="icon" aria-hidden="true" @click.stop="toggleAttentionNotIndex">
        <use v-show="!nowFile.attention" xlink:href="#icon-like"></use>
        <use v-show="nowFile.attention" xlink:href="#icon-like_fill"></use>
      </svg>
      <p><span>文件名</span>{{nowFile.name}}</p>
      <p><span>文件类型</span>{{getType(nowFile.name)}}</p>
      <p><span>文件大小</span>{{getFileSize(nowFile.size)}}</p>
      <p><span>创建时间</span>{{unixChange (nowFile.lastModified)}}</p>
      <div><span>关键词</span><span class="keyword" v-for="(item,index) in nowFile.keyword" :key="index">{{item}}</span>
        <p><img class="wordCloud" :src=nowFile.info.wordCloudUrl alt="词云"></p>
      </div>
      <div class="tag_file_info"><span>标签</span>
        <span class="tag" v-for="(item,index) in nowFile.tag" :key="index">
            {{item}} <img @click="delOneTag(index)" src="../../assets/img/close.png" alt="删除" title="点击删除">
            </span>
        <div class="input_outer">
          <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签" v-on:keyup.enter="addTag">
          <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag"></span>
        </div>
      </div>
      <div class="remark_file_info"><span>用户评价</span>
        <span v-show="!isModifyRemark" class="remarks">{{nowFile.remark}}</span>
        <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>
        <div class="input_outer" v-show="isModifyRemark">
          <input v-model="nowFile.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">
          <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>
        </div>
      </div>
  </div>
    <iframe :src="getFileUrl()" frameborder="0"></iframe>
  </div>
</template>

<script>
  import { getFileSize,unixChange,inputIsEmpty,toggleCollectionNotIndex,toggleAttentionNotIndex } from "../../publics/public";
  export default {
    name: "ShowFile",
    data(){
        return{
          markup:'',
          isModifyRemark:false,
          newTag:'',
          nowFile:{},
          url:'',
          hackReset:true
        }
    },
    mounted(){
      this.getNowFile()
    },
    watch(){
      this.$router.param(val)
      {
        this.getNowFile()
      }
    },
    methods:{
      backToAll(){
        this.$router.replace('/main/documents')
        // this.$destroy()
      },
      getFileUrl(){
        var baseUrl = 'http://192.168.0.133:8080/testpreview/'
        console.log("completeUrl:",baseUrl + this.url)
        return baseUrl + this.url
      },
      getNowFile(){
        this.url = this.$route.params.fileUrl
        this.nowFile = this.$route.params.nowFile
        this.nowFile.info = JSON.parse(this.nowFile.info)
        console.log('nowFile,:',this.nowFile)
        if (this.nowFile.keyword !== null) {
          this.nowFile.keyword = this.nowFile.keyword.split(' ')
        }
        if (this.nowFile.tag !== null) {
          this.nowFile.tag = this.nowFile.tag.split(',')
        }else{
          this.nowFile.tag = new Array()
        }
        console.log('nowFile.tag:',this.nowFile.tag)
      },
      getFileSize(size){
        return getFileSize(size)
      },
      unixChange (timestamp){
        return unixChange(timestamp)
      },
      getType(name){
        const ext = name.split('.').pop()
        return ext
      },
      toggleCollectionNotIndex(){
        toggleCollectionNotIndex(this, this.nowFile)
      },
      toggleAttentionNotIndex(){
        toggleAttentionNotIndex(this, this.nowFile)
      },
      modifyRemark() {
        this.isModifyRemark = true
      },
      completeModifyRemark() {
        // 1.通知后台该文档评论修改
        // 2.本地显示修改后的评论
        this.isModifyRemark = false
      },
      delOneTag(index) {
        // 1. 通知后台删除此标签
        // 2. 本地删除
        this.nowFile.tag.splice(index, 1)
      },
      addTag() {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        // 2.通知后台添加标签
        // 3.本地显示添加
        this.nowFile.tag.push(this.newTag)
        this.newTag = ''
      },
    },
    beforeDestroy() {
      this.url = ''
      this.nowFile = ''
    }
  }
</script>

<style scoped>
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
    padding-left: 50px;
    color: cornflowerblue;
  }
  .file_nav>span{
    cursor: pointer;
  }
.show_file iframe {
  width: 75%;
  height: 780px;
  background-color: #e3e3e3;
  float: right;
}
.file_info{
  background: linear-gradient(#ededed,white,white,white,white,white);
  width: 25%;
  float: left;
}
.file_info>svg{
  color: cornflowerblue;
  font-size: 20px;
  margin: 10px;
  padding: 10px;
}
.file_info .wordCloud{
  width: 260px;
}
.file_info>p>span:first-child,
.file_info>div>span:first-child{
  color: cornflowerblue;
  display: inline-block;
  width: 80px;
}
.file_info .color>div{
  height: 30px;
  float: left;
}
.file_info>span{
  font-size: 20px;
}
.file_info>p,
.file_info>div{
  padding: 10px;
  margin: 10px;
}
.file_info>p:first-child{
  margin-bottom: 15px;
}
.file_info .input_outer{
  position: relative;
  display: inline-block;
}
.file_info .tag_file_info .input_outer{
  margin-left: 85px;
}
.file_info .tag_input,
.file_info .remark_input{
  outline: none;
  border-radius: 5px;
  width: 130px;
  height: 20px;
  border: 1px solid lightgray;
  padding: 2px 17px 2px 4px;
  font-size: 12px;
}
.file_info .ok_tag_input,
.file_info .ok_remark_input{
  position: absolute;
  right: 5px;
  top: 5px;
  cursor: pointer;
}
.file_info .tag_file_info .tag{
  font-size: 11px;
}
.file_info .remark_file_info .remarks{
  font-size: 13px;
  margin-right: 10px;
}
.file_info .remark_file_info .icon-brush{
  font-size: 13px;
  color: cornflowerblue;
  cursor: pointer;
}
</style>
