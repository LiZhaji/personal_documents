<!--collection为true的文件-->
<template>
  <div class="my_collections">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >我的收藏</span>
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
      <tr v-for="(item, index) in myCollections" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name">
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href="`#icon-file_${item.type}`"></use></svg>
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
  import FileOperation from "../../components/FileOperation"
  import {toggleCollection, toggleAttention, clickItem, fetchList} from "../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation,
    },
    data() {
      return {
        myCollections:[]
      }
    },
    mounted(){
      this.getCollections()
    },
    methods:{
      getCollections(){
        fetchList('/getcollections').then(data=>{
          data.forEach(el=>{
            el.itemChecked = false
          })
          this.myCollections = data
        })
      },
      clickItem(index){
        clickItem(this.myCollections, index, this.nowChecked)
      },
      toggleCollection(index){
        toggleCollection(this, this.myCollections, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.myCollections, index)
      },
      changeImportance(index){

      }
    }
  }
</script>

<style scoped>
  .my_collections{
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
