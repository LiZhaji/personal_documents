<template>
  <div class="others">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部文档</span>
    </div>
    <table>
      <thead>
      <tr>
        <td class="checked"></td>
        <td class="importance"></td>
        <td class="name">|文件名称</td>
        <td class="time">|修改日期</td>
        <td class="size">|大小</td>
        <td class="star">|标记</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in others" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name" @click.stop="showFile">
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(index)></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td>{{item.time}}</td>
        <td>{{item.size}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click.stop="toggleCollection(index)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click.stop="toggleAttention(index)">
          <use v-show="!item.like" xlink:href="#icon-like"></use>
          <use v-show="item.like" xlink:href="#icon-like_fill"></use>
        </svg></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import axios from "axios"
  import FileOperation from "../../../components/FileOperation"
  import { toggleCollection,toggleAttention,clickItem } from "../../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    data() {
      return {
        file_icons:['doc','exe','zip','txt','pdf','ppt','xls','css','mp3','avi','mp4','movie','jpg','png','gif'],
        nowChecked:[],
        others:[
          {
            importance:0,// -1,0,1
            name:'服务外包省赛概要三十三.pbg',
            time:new Date(),
            type:'pbg',
            size:'22k',
            collection:true,
            like:true
          },
          {
            importance:1,// -1,0,1
            name:'你好好密密麻麻.rfg',
            time:new Date(),
            type:'rfg',
            size:'19k',
            collection:false,
            like:true
          }
        ]
      }
    },
    methods:{
      fileIconsOrOthers(index){
        let temp = this.file_icons.indexOf(this.others[index].type) < 0 ? 'others' : this.others[index].type
        return "#icon-file_" + temp
        // return "#icon-file_" + this.file_icons.indexOf(this.others[index].type) < 0 ? 'others' : this.others[index].type
      },
      clickItem(index){
        clickItem(this.others, index, this.nowChecked)
      },
      toggleCollection(index){
        toggleCollection(this, this.others, index)
      },
      toggleAttention(index) {
        toggleAttention(this, this.others, index)
      },
      showFile(){
        window.open('http://192.168.0.133:8080/testpreview/zzz/%E6%97%B6%E9%97%B4%E8%A1%A8.pdf', '_blank');
      }
    }
  }
</script>

<style scoped>
  .others{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }

</style>
