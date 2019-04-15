<template>
  <div class="lately_files">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >最近文件</span>
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
      <tr v-for="(item, index) in latelyFiles" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name">
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
  import FileOperation from "../../../components/FileOperation"
  import { toggleCollection,toggleAttention,clickItem } from "../../../publics/public"
  export default {
    data() {
      return {
        file_icons:['doc','exe','zip','txt','pdf','ppt','xls','css','mp3','avi','mp4','movie','jpg','png','gif'],
        nowChecked:[],
        latelyFiles:[
          {
            importance:0,// -1,0,1
            name:'服务外包省赛概要.doc',
            time:new Date(),
            type:'doc',
            size:'22k',
            collection:true,
            like:true,
            itemChecked:false
          }

        ]
      }
    },
    components:{
      FileOperation: FileOperation
    },
    methods:{
      fileIconsOrOthers(index){
        let temp = this.file_icons.indexOf(this.latelyFiles[index].type) < 0 ? 'others' : this.latelyFiles[index].type
        return "#icon-file_" + temp
      },
      clickItem(index){
        clickItem(this.latelyFiles, index, this.nowChecked)
      },
      toggleCollection(index){
        toggleCollection(this, this.latelyFiles, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.latelyFiles, index)
      }
    }
  }
</script>

<style scoped>
  .lately_files{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
  }
</style>
