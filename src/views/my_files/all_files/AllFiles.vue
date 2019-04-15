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
        <tr v-for="(item, index) in allFiles" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
          <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
          <td class="file_importance">
            <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
          </td>
          <td><div class="file_name" @click.stop="openFile">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
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
  import axios from "axios"
  import FileOperation from "../../../components/FileOperation"
  import {toggleCollection, toggleAttention, clickItem, unixChange, getFileSize} from "../../../publics/public"
  export default {
    data() {
      return {
        nowChecked:[],
        allFiles:[
          {
            importance:0,// -1,0,1
            name:'汇总',
            time:new Date(),
            size:'22k',
            collection:true,
            like:true,
            itemChecked:false
          }
        ],
        childFiles:[],
        isChild:false
      }
    },
    mounted(){
      var url = '' // 获取所有文件
      axios.get(url).then(function (response) {
        if("succss") {
          // this.allFiles = JSON.parse(response.data.xxx)
        }
      })
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      var url = 'http://192.168.0.133:8080/fileinfo'
      axios.get(url).then(response =>{
        if (response.status === 200){
          this.allFiles = response.data
        }
      })
    },
    methods:{
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
