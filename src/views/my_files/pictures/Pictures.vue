<template>
  <div class="pictures">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部文件</span>
      <el-popover
        popper-class="order_picker"
        placement="top"
        width="150"
        v-model="visible2">
        <p>智能分类</p>
        <p>时光轴</p>
        <span slot="reference" class="iconfont icon-order"></span>
        <!--<el-button >删除</el-button>-->
      </el-popover>
    </div>
    <table>
      <thead>
      <tr>
        <td class="checked"></td>
        <td class="importance"></td>
        <td class="preview">|预览</td>
        <td class="name">|文件名称</td>
        <td class="time">|日期</td>
        <td class="size">|大小</td>
        <td class="star">|标记</td>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(item, index) in allPictures" :key="index" @click="clickItem(index)" :class="{item_checked:item.itemChecked}" >
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td class="file_preview">
          <!--<svg class="icon" aria-hidden="true"><use xlink:href="#icon-file_jpg"></use></svg>-->
          <img :src="item.url" alt="预览图" style="width: 35px; ">
        </td>
        <td class="file_name"><span @click.stop="showInfo(index)">{{item.name}}</span></td>
        <td>{{unixChange(item.lastModified)}}</td>
        <td>{{item.size}}</td>
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
  import { toggleCollection,toggleLike,clickItem,unixChange } from "../../../publics/public"
  export default {
    data() {
      return {
        allPictures:[
          {
            importance:-1,// -1,0,1
            url:require('../../../assets/img/1.jpg'),
            name:'头像.png',
            lastModified:16594789,
            size:'22k',
            collection:true,
            like:true,
            itemChecked:true
          },
          {
            importance:-1,// -1,0,1
            url:require('../../../assets/img/2.jpg'),
            name:'头像.png',
            time:new Date(),
            size:'22k',
            collection:true,
            like:true,
            itemChecked:false
          }
        ],
        nowChecked:[]
      }
    },
    components:{
      FileOperation: FileOperation
    },
    computed:{

    },
    methods:{
      clickItem(index){
        clickItem(this.allPictures, index, this.nowChecked)
      },
      toggleCollection(index){
        toggleCollection(this, this.allPictures, index)
      },
      toggleLike(index){
        toggleLike(this, this.allPictures, index)
      },
      showInfo(index){
        localStorage.setItem("initIndex",index)
        let routeData = this.$router.resolve('/picturesInfo');
        window.open(routeData.href, '_blank');
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      }

    },
    watch:{

    }
  }
</script>

<style scoped>
  .pictures{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .file_preview>svg{
    font-size: 30px;
  }
  .order_picker>p{
    padding: 5px;
  }
  .order_picker>p:hover{
    background-color: rgba(211, 211, 211, 0.64);
    border-radius: 5px;
    cursor: pointer;
  }
  .file_nav{
    width: 100%;
    margin: 20px 0px;
    font-size: 14px;
    height: 20px;
  }
  .icon-order{
    margin-left: 80%;
  }
</style>
