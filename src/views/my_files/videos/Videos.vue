<template>
  <div class="videos">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部视频</span>
    </div>
    <table>
      <thead>
      <tr>
        <td class="checked"></td>
        <td class="importance"></td>
        <td class="name">|文件名称</td>
        <td class="time">|日期</td>
        <td class="size">|大小</td>
        <td class="star">|标记</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in allVideos" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}" >
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td class="file_name"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-file_mp4"></use></svg>
          <span @click.stop="videoPlay(item.id)">{{item.name}}</span></td>
        <td>{{unixChange(item.serverTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click.stop="toggleCollection(index)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click.stop="toggleAttention(index)">
          <use v-show="!item.attention" xlink:href="#icon-like"></use>
          <use v-show="item.attention" xlink:href="#icon-like_fill"></use>
        </svg></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from "axios"
  import FileOperation from "../../../components/FileOperation"
  import {
    toggleCollection,
    toggleAttention,
    clickItem,
    inputIsEmpty,
    getFileSize,
    unixChange,
    toggleTip,
    fetchList
  } from "../../../publics/public"
  export default {
    data() {
      return {
        allVideos:[{
          name:'xxxxxxxx'
        }]
      }
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      this.fetchList()
      window.EE.on('fetchVideos',()=>{this.fetchList()})
    },
    methods:{
      fetchList(){
        fetchList('/videoinfo').then(data=>{
          data.forEach(el=>{
            el.itemChecked = false
            if (el.keyword) {
              el.keyword = el.keyword.split(',')
            }
            if (el.tag) {
              el.tag = el.tag.split(',')
            }else {
              el.tag = []
            }
          })
          this.allVideos = data
        }).catch(error=>{
          toggleTip(this,error)
        })
      },
      videoPlay(id){
        var nowVideo = this.allVideos.find(el=>{return el.id === id})
        let routerData = this.$router.resolve({
          name:'VideoInfo',
          query:{
            nowVideo:JSON.stringify(nowVideo)
          }
        })
        console.log('nowVideo:',nowVideo)
        window.open(routerData.href, '_blank')
      },
      getVideoUrl(url){
        let baseUrl = ''
        return baseUrl + url
      },
      clickItem(index){
        clickItem(this.allAudios, index, this.nowChecked)
      },
      toggleCollection(index){
        console.log(this.allAudios[index].collection)
        toggleCollection(this, this.allAudios, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.allAudios, index)
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
  .videos{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
</style>
