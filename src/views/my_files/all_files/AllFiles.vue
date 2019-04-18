<template>
  <div class="all_files">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部文件</span>
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
      <tr v-for="(item, index) in allFolders" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name" @click.stop="openFile">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td>{{unixChange(item.createTime)}}</td>
        <td>\</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click="toggleCollection(index)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click="toggleAttention(index)">
          <use v-show="!item.like" xlink:href="#icon-like"></use>
          <use v-show="item.like" xlink:href="#icon-like_fill"></use>
        </svg></td>
      </tr>
      <tr v-for="(item, index) in allFiles" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name" @click.stop="openFile">
          <svg class="icon" aria-hidden="true"><use :xlink:href="fileIconsOrOthers(index)"></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td>{{unixChange(item.createTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click="toggleCollection(index)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click="toggleAttention(index)">
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
  import {
    toggleCollection,
    toggleAttention,
    clickItem,
    unixChange,
    getFileSize,
    fetchList
  } from "../../../publics/public"
  export default {
    data() {
      return {
        nowChecked:[],
        allFolders:[],
        allFiles:[
        ],
        childFiles:[],
        isChild:false
      }
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      this.fetchList()
      window.EE.on('fetchAllFiles',()=>this.fetchList())
    },
    methods:{
      fetchList(){
        fetchList('/fileinfo').then(data=>{
          this.allFolders = data.folders
          this.allFiles = data.files
        })
      },
      fileIconsOrOthers(index){
        const ext =this.allDocuments[index].name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      clickItem(index){
        clickItem(this.allFiles, index, this.nowChecked)
      },
      toggleCollection(index){
        toggleCollection(this, this.allFiles, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.allFiles, index)
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      },
      getFileSize(size){
        return getFileSize(size)
      },
      changeImportance(index){

      },
      openFile(){
        this.isChild = true
      }
    }
  }
</script>

<style scoped>
  .all_files{
     overflow: hidden;
     position: relative;
     padding-left: 50px;
  }
  .file_name{
    display: inline-block;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
  }
</style>
