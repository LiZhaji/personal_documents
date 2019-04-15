<template>
  <div class="pictures">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部图片</span>
      <el-popover
        popper-class="order_picker"
        placement="top"
        width="150">
        <p>智能分类</p>
        <p @click="timeLine">时光轴</p>
        <p @click="defaultOrder">默认排序</p>
        <span slot="reference" class="iconfont icon-order"></span>
        <!--<el-button >删除</el-button>-->
      </el-popover>
    </div>
    <table v-show="isDefaultOrder">
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
          <img :src="getPicUrl(item.url)" alt="预览图" style="width: 35px; ">
        </td>
        <td class="file_name"><span @click.stop="showInfo(index)">{{item.name}}</span></td>
        <td>{{unixChange(item.serverTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star"><svg class="icon" aria-hidden="true" @click.stop="toggleCollection(index)">
          <use v-show="!item.collection" xlink:href="#icon-collection"></use>
          <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
        </svg><svg class="icon" aria-hidden="true" @click.stop="toggleAttention(index)">
          <use v-show="!item.attention" xlink:href="#icon-like"></use>
          <use v-show="item.attention" xlink:href="#icon-like_fill"></use>
        </svg></td>
      </tr>
      </tbody>
    </table>
    <div v-show="isTimeLine" class="time_line">
      <div v-for="(item, key, index) in timeLinePics"   class="month_div">
        <div><svg class="icon" aria-hidden="true"><use xlink:href="#icon-importance1"></use></svg>{{key}}</div>
        <div class="img_outer" v-for="(smallItem,index) in item"><img :src="getPicUrl(smallItem.url)" alt="图片"></div>
      </div>
      <div class="the_time_line"></div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import FileOperation from "../../../components/FileOperation"
  import { toggleTip,toggleCollection,toggleAttention,clickItem,unixChange,getFileSize } from "../../../publics/public"
  export default {
    data() {
      return {
        isDefaultOrder:true,
        allPictures:[],
        nowChecked:[],
        isTimeLine:false,
        timeLinePics:{},
        isIntelligenceOrder:false,
        intelligenceOrderPics:[]
      }
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      // 获取所有图片
      var url = "http://192.168.0.133:8080/imageinfo"
      axios.get(url).then(response =>{
        if (response.status === 200){
          this.allPictures = response.data
          this.allPictures.forEach(element =>{
            element.itemChecked = false
          })
          console.log("picturesin:",this.allPictures)
        }
      }).catch(error=>{
        toggleTip(this,error)
      })
    },
    methods:{
      defaultOrder(){
        this.isDefaultOrder = true
        this.isTimeLine = false
        this.isIntelligenceOrder = false
      },
      timeLine(){
        this.isTimeLine = true
        this.isDefaultOrder = false
        this.isIntelligenceOrder = false
        // 从后台请求数据
        var url = "http://192.168.0.133:8080/sortimage"
        axios.get(url).then( (response)=> {
          if (response.status === 200){
            console.log(response.data)
            this.timeLinePics = response.data
            console.log('aaaa',this.timeLinePics)
          }
        }).catch( (error) =>{
          // console.log(error)
          toggleTip(this, error)
        })
      },
      getPicUrl(url){
        var baseUrl = "http://192.168.0.133:8080/testpreview/"
        console.log(baseUrl + url)
        return baseUrl + url
      },
      clickItem(index){
        clickItem(this.allPictures, index, this.nowChecked)
      },

      toggleCollection(index){
        toggleCollection(this, this.allPictures, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.allPictures, index)
      },
      showInfo(index){
        // localStorage.setItem("initIndex",index)
        let id = this.allPictures[index].id
        let routeData = this.$router.resolve({
          path:'/picturesInfo',
          query:{ index: index}
        });
        window.open(routeData.href, '_blank');
      },
      unixChange(timeStamp){
        return unixChange(timeStamp)
      },
      getFileSize(size){
        return getFileSize(size)
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
  /*时光轴开始*/
  .time_line{

  }
  .month_div{
    padding: 10px 0;
  }
  .month_div>div>svg{
    font-size: 25px;
    margin-right: 20px;
  }
  .month_div>.img_outer{
    display: inline-block;
    padding: 5px;
  }
  .month_div>div>img{
    width: 150px;
    height: auto;
  }

  /*时光轴结束*/
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
  .icon-order{
    margin-left: 80%;
  }
</style>
