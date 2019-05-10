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
      <tr v-for="(item, index) in others" :key="index" @click="clickItem(item)" :class="{item_checked:item.itemChecked}">
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg @click="changeImportance(index)" class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.scale}`"></use></svg>
        </td>
        <td><div class="file_name" @click.stop="showFile(item)">
          <svg class="icon aFile" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(index)></use></svg>
          <span >{{item.name}}</span>
        </div></td>
        <td>{{item.time}}</td>
        <td>{{item.size}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click.stop="toggleCollection(item)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click.stop="toggleAttention(item)">
          <use v-show="!item.attention" xlink:href="#icon-like"></use>
          <use v-show="item.attention" xlink:href="#icon-like_fill"></use>
        </svg></td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import FileOperation from "../../../components/FileOperation"
  import JSZIP from "jszip"
  import { toggleTip,toggleCollection,toggleAttention,fetchList } from "../../../publics/public"
  export default {
    components:{
      FileOperation: FileOperation
    },
    data() {
      return {
        checkedFiles:[],
        others:[]
      }
    },
    computed:{
      ...mapState(['file_icons'])
    },
    mounted(){
      this.fetchList()
      window.EE.on('fetchOthers',()=>{this.fetchList()})
    },
    methods:{
      showFile(item){
        let zip = new JSZIP()
        fetchList(this.getUrl(item.url)).then(data=>{
          zip.loadAsync(data).then(zip=>{
            console.log(zip,"查看zip")
          })
        })
      },
      fetchList(){
        fetchList('/others').then(data=>{
          this.others = data
        }).catch(error=>{
          toggleTip(this,error)
        })
      },
      getUrl(url){
        return window.baseUrl + '/testpreview/' + url
      },
      fileIconsOrOthers(index){
        let temp = this.file_icons.indexOf(this.others[index].type) < 0 ? 'others' : this.others[index].type
        return "#icon-file_" + temp
        // return "#icon-file_" + this.file_icons.indexOf(this.others[index].type) < 0 ? 'others' : this.others[index].type
      },
      clickItem(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedFiles.findIndex(el=>{return el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedFiles.push({id: item.id, name: item.name, url:item.url})
        }else{
          this.checkedFiles.splice(index, 1)
        }
        if (this.checkedFiles.length != 0){
          this.$store.commit('setCheckedFiles', this.checkedFiles)
        }
      },
      toggleCollection(item){
        toggleCollection(this, item)
      },
      toggleAttention(item){
        toggleAttention(this, item)
      },

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
