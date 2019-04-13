<template>
  <div class="documents">
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
      <tr v-for="(item, index) in allDocuments" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click.stop="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name">
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(index)></use></svg>
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
    <a href="http://www.xdocin.com/xdoc?_func=to&amp;_format=html&amp;_cache=1&amp;_xdoc=http://www.xdocin.com/demo/demo.docx" target="_blank" rel="nofollow">XDOC</a>
  </div>
</template>

<script>
  import FileOperation from "../../../components/FileOperation"
  import { mapState } from "vuex"
  import { toggleCollection,toggleLike,clickItem,unixChange,getFileSize } from "../../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    computed:{
      ...mapState(['file_icons','allDocuments'])
    },
    data() {
      return {
        nowChecked:[],
        // allDocuments:[
        //   {
        //     importance:0,// -1,0,1
        //     name:'服务外包省赛概要.doc',
        //     lastModified:new Date(),
        //     type:'doc',
        //     size:'22k',
        //     collection:true,
        //     like:true,
        //     itemChecked:false
        //   },
        //   {
        //     importance:1,// -1,0,1
        //     name:'你好好密密麻麻.xls',
        //     lastModified:new Date(),
        //     type:'xls',
        //     size:'19k',
        //     collection:false,
        //     like:true,
        //     itemChecked:false
        //   }
        // ]
      }
    },
    methods:{
      unixChange (timestamp){
        return unixChange(timestamp)
      },
      getFileSize(size){
        return getFileSize(size)
      },
      fileIconsOrOthers(index){
        const ext =this.allDocuments[index].name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      clickItem(index){
        clickItem(this.allDocuments, index, this.nowChecked)
      },
      toggleCollection(index){
        console.log(this.allDocuments[index].collection)
        toggleCollection(this, this.allDocuments, index)
      },
      toggleLike(index){
        toggleLike(this, this.allDocuments, index)
      }
    },
    mounted(){
      window.doc = this
    }
  }
</script>

<style scoped>
  .documents{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }

</style>
