<template>
  <div class="documents">
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
      <tr v-for="(item, index) in allDocuments" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click.stop="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td><div class="file_name" >
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(index)></use></svg>
          <span @click.stop="showFile(item.url,index)" title="点击查看详情">{{item.name}}</span>
        </div></td>
        <td>{{unixChange(item.serverTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
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
  import { mapState } from "vuex"
  import { toggleTip,toggleCollection,toggleAttention,clickItem,unixChange,getFileSize } from "../../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    computed:{
      ...mapState(['file_icons','nowFile']),
      nowFile:{
        get(){
          return this.$store.state.nowFile
        },
        set(val){
          this.$store.state.newFile = val
        }
      }
    },
    data() {
      return {
        nowChecked:[],
        allDocuments:[]
      }
    },
    mounted(){
      window.doc = this
      // 获取所有文档
      var url = 'http://192.168.0.133:8080/docuinfo'
      axios.get(url).then(response => {
        if (response.status === 200){
          console.log(response.data)
          this.allDocuments = response.data
          this.allDocuments.forEach(element =>{
            element.itemChecked = false
          })
        }
      }).catch(error => {
        toggleTip(this,error)
      })
    },
    beforeDestroy(){
      alert('aaaaa')
    },
    methods:{
      showFile(url, index){
        let nowFile = this.allDocuments[index]
        let pdfUrlTemp = url.split('.').slice(0, url.split('.').length - 1)
        pdfUrlTemp.push('.pdf')
        let pdfUrl = pdfUrlTemp.join("")
        this.$router.push({
          name: 'ShowFile',
          params: {
            fileUrl: pdfUrl,
            nowFile: nowFile
          }
        })
      },
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
        toggleCollection(this, this.allDocuments, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.allDocuments, index)
      }
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
