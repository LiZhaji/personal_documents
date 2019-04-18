<template>
  <div class="pictures">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span >全部图片</span>
      <span v-show="nowCheckedDefault || nowCheckedTimeLine || nowCheckedIntelOrder">存入文件夹</span>
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
      <tr v-for="(item, index) in allPictures" :key="index" @click="itemCheckedDefault(item)" :class="item.itemChecked ? 'item_checked' : ''" >
        <td ><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg class="icon" aria-hidden="true"><use :xlink:href="`#icon-importance${item.importance}`"></use></svg>
        </td>
        <td class="file_preview">
          <!--<svg class="icon" aria-hidden="true"><use xlink:href="#icon-file_jpg"></use></svg>-->
          <img :src="getPicUrl(item.url)" alt="预览图" style="width: 35px; ">
        </td>
        <td class="file_name"><span @click.stop="showInfo(item.id)">{{item.name}}</span></td>
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
      <div v-for="(item, key) in timeLinePics" class="month_div">
        <div><svg class="icon" aria-hidden="true"><use xlink:href="#icon-importance1"></use></svg>{{key}}</div>
        <div v-for="smallItem in item" class="img_outer_outer" :class="smallItem.itemChecked ? 'blockItemCheckedClass' : ''"
             @mouseover="mouseOvering(smallItem)" @mouseout="mouseDowning(smallItem)">
          <span v-show="smallItem.itemChecked" class="iconfont icon-checked_circle" @click.stop="itemCheckedTimeLine(smallItem)"></span>
          <div class="img_outer" @click="showInfo(smallItem.id)" :style="{'background-image': 'url('+getPicUrl(smallItem.url)+')'}"></div>
        </div>
      </div>
      <div class="the_time_line"></div>
    </div>
  </div>
</template>

<script>
  import axios from "axios"
  import FileOperation from "../../../components/FileOperation"
  import { toggleTip,toggleCollection,toggleAttention,unixChange,getFileSize,fetchList } from "../../../publics/public"
  export default {
    data() {
      return {
        allPictures:[],
        isDefaultOrder:true,
        nowCheckedDefault:[],
        timeLinePics:{},
        isTimeLine:false,
        nowCheckedTimeLine:[],
        intelligenceOrderPics:[],
        isIntelligenceOrder:false,
        nowCheckedIntelOrder:[],
      }
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      // 获取所有图片
      this.fetchList()
      window.EE.on('fetchImages',()=>{this.fetchList()})
    },
    methods:{
      fetchList(){
        fetchList('/imageinfo').then(data=>{
        data.forEach(element => {
            element.itemChecked = false
          })
        this.allPictures = data
        // console.log(this.allPictures[0].itemChecked)
        }).catch(error=>{
          toggleTip(this,error)
        })
      },
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
        fetchList('/sortimage').then(data=>{
          console.log(data)
          for(let key in data){
            console.log(data[key])
            data[key].forEach(el=>{
              el.itemChecked = false
            })
          }
          this.timeLinePics = data
        }).catch( (error) =>{
          toggleTip(this, error)
        })
      },
      mouseOvering(item){
        item.itemChecked = true
      },
      mouseDowning(item){
        item.itemChecked = false
      },
      itemCheckedTimeLine(item){
        console.log(item)
        console.log('前：',item.itemChecked)
        item.itemChecked = !item.itemChecked
        console.log('后:',item.itemChecked)
        if (item.itemChecked && this.nowCheckedDefault.indexOf(item.id)=== -1){
          this.nowCheckedTimeLine.push(item.id)
        }else {
          let index = this.nowCheckedTimeLine.findIndex(el=>{return el.id == item.id})
          this.nowCheckedTimeLine.splice(index, 1)
        }
        console.log('nowCheckedTimeLine:',this.nowCheckedTimeLine)
      },
      itemCheckedDefault(item){
        item.itemChecked = !item.itemChecked
        if (item.itemChecked && this.nowCheckedDefault.indexOf(item.id)=== -1){
          this.nowCheckedDefault.push(item.id)
        }else {
          let index = this.nowCheckedDefault.findIndex(el=>{return el.id == item.id})
          this.nowCheckedDefault.splice(index, 1)
        }
        console.log('nowCheckedDefault:',this.nowCheckedDefault)
      },
      showInfo(id){
        // localStorage.setItem("initIndex",index)
        // let id = this.allPictures[index].id
        let routeData = this.$router.resolve({
          path:'/picturesInfo',
          query:{ id:id }
        });
        window.open(routeData.href, '_blank');
      },
      getPicUrl(url){
        var baseUrl = window.baseUrl +  "/testpreview/"
        return baseUrl + url
      },
      toggleCollection(index){
        toggleCollection(this, this.allPictures, index)
      },
      toggleAttention(index){
        toggleAttention(this, this.allPictures, index)
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
  .month_div>.img_outer_outer{
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
  }
  .month_div>.img_outer_outer .icon-checked_circle{
    cursor: pointer;
    position: absolute;
    font-size: 17px;
  }
  .month_div>.img_outer_outer>.img_outer{
    width: 150px;
    height: 150px;
    display: inline-block;
    transition: opacity linear .15s;
    background-position: center center;
    background-repeat: no-repeat;
    cursor: pointer;
  }
  .month_div>.img_outer_outer:hover{
    background-color: rgba(221, 221, 221, 0.78);
  }
  .blockItemCheckedClass{
    background-color: rgba(221, 221, 221, 0.78);
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
