<template>
  <div class="audios">
    <FileOperation></FileOperation>
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
      <tr v-for="(item, index) in allAudios" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click.stop="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name">
          <svg class="icon aFile" aria-hidden="true"><use xlink:href="#icon-file_mp3"></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td>{{unixChange(item.lastModified)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click.stop="toggleCollection(index)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click.stop="toggleLike(index)">
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
  import { toggleCollection,toggleLike,clickItem } from "../../../publics/public"
  export default {
    data() {
      return {
        allAudios:[]
      }
    },
    components:{
      FileOperation: FileOperation
    },
    methods:{
      clickItem(index){
        clickItem(this.allAudios, index, this.nowChecked)
      },
      toggleCollection(index){
        console.log(this.allAudios[index].collection)
        toggleCollection(this, this.allAudios, index)
      },
      toggleLike(index){
        toggleLike(this, this.allAudios, index)
      }
    }
  }
</script>

<style scoped>
  .audios{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
</style>
