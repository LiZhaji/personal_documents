<template>
  <div class="pictures">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span v-show="!enterIntelPic">全部图片</span>
      <span v-show="enterIntelPic" class="file_nav_intel"><span @click="intelOrder">智能归档</span> > {{keyName}}</span>
      <el-popover
        popper-class="order_picker"
        placement="top"
        width="150">
        <p @click="intelOrder">智能分类</p>
        <p @click="timeLine">时光轴</p>
        <p @click="defaultOrder">默认排序</p>
        <span slot="reference" class="iconfont icon-order"></span>
        <!--<el-button >删除</el-button>-->
      </el-popover>
    </div>
    <table v-if="isDefaultOrder">
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
    <div v-if="isTimeLine" class="time_line">
      <div v-for="(item, key) in timeLinePics" class="month_div">
        <div><svg class="icon" aria-hidden="true"><use xlink:href="#icon-importance1"></use></svg>{{key}}</div>
        <div v-for="smallItem in item" class="img_outer_outer" :class="smallItem.itemChecked ? 'blockItemCheckedClass' : ''">
          <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheckedTimeLine(smallItem)"></span>
          <div class="img_outer" @click="showInfo(smallItem.id)" :style="{'background-image': 'url('+getPicUrl(smallItem.url)+')'}">

<!--            <img :src="getPicUrl(smallItem.url)" alt="图片预览图">-->
          </div>
        </div>
      </div>
      <div class="the_time_line"></div>
    </div>
    <div v-if="isIntelligenceOrder" class="intelligence_order">
      <div v-for="(item, index) in intelligenceOrderPics" :key="'iop'+index" @click.stop="getClassPic(item.id, item.name)">
        <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
        <p>{{item.name}}</p>
      </div>
    </div>
    <div v-if="enterIntelPic" class="pics">
      <div class="pics_item" v-for="(item, index) in classPics"  :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
        <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheckedCls(item)"></span>
        <div class="img_outer" @click="showInfo(item.id)" :style="{'background-image': 'url('+getPicUrl(item.url)+')'}">
<!--          <img :src="getPicUrl(item.url)" alt="图片预览图">-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import FileOperation from "../../../components/FileOperation"
  import { toggleTip,toggleCollection,toggleAttention,unixChange,getFileSize,fetchList } from "../../../publics/public"
  export default {
    data() {
      return {
        isDefaultOrder: true,
        allPictures: [],
        nowCheckedDefault: [],
        isTimeLine: false,
        timeLinePics: {},
        nowCheckedTimeLine: [],
        isIntelligenceOrder: false,
        intelligenceOrderPics: [],
        enterIntelPic: false,
        classPics: [],
        nowCheckedClsPic: [],
        keyName:''
      }
    },
    computed:{
      ...mapState(['isDefineFile']),
      isDefineFile:{
        get(){
          return this.$store.state.isDefineFile
        },
        set(val){
          this.$store.state.isDefineFile = val
        }
      }
    },
    components:{
      FileOperation: FileOperation
    },
    mounted(){
      // 获取所有图片,默认排列
      this.fetchListDefault()
      window.EE.on('fetchImages',()=>{this.fetchList()})
    },
    methods:{
      fetchListDefault(){
        fetchList('/imageinfo').then(data=>{
        data.forEach(element => {
            element.itemChecked = false
          })
        this.allPictures = data
        }).catch(error=>{
          toggleTip(this,error)
        })
      },
      defaultOrder(){
        this.isDefaultOrder = true
        this.isTimeLine = false
        this.isIntelligenceOrder = false
        this.enterIntelPic = false
        this.fetchListDefault()
      },
      timeLine(){
        this.isTimeLine = true
        this.isDefaultOrder = false
        this.isIntelligenceOrder = false
        this.enterIntelPic = false
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
      intelOrder(){
        this.isIntelligenceOrder = true
        this.isTimeLine = false
        this.isDefaultOrder = false
        this.enterIntelPic = false
        // 从后台请求数据
        fetchList('/getimageinsight').then(data=>{
          this.intelligenceOrderPics = data
        }).catch( (error) =>{
          toggleTip(this, error)
        })
      },
      getClassPic(id, name){
        this.enterIntelPic = true
        this.isIntelligenceOrder = false
        this.isTimeLine = false
        this.isDefaultOrder = false
        this.keyName = name
        const childUrl = '/filefiling/' + id
        fetchList(childUrl).then(data=> {
            for (let key in data){
              data[key].forEach(el=> {
                if (el.info) {
                  el.info = JSON.parse(el.info)
                }
                el.itemChecked = false
              })
            }
          this.classPics = data.IMAGE
        })
      },
      itemCheckedTimeLine(item){
        item.itemChecked = !item.itemChecked
        if (item.itemChecked && this.nowCheckedDefault.indexOf(item.id)=== -1){
          this.nowCheckedTimeLine.push(item.id)
        }else {
          let index = this.nowCheckedTimeLine.findIndex(el=>{return el.id == item.id})
          this.nowCheckedTimeLine.splice(index, 1)
        }
        if (this.nowCheckedTimeLine) {
          this.isDefineFile = true
          this.$store.commit('setNowCheckedIds', this.nowCheckedTimeLine)
        }else{
          this.isDefineFile = true
        }
      },
      itemCheckedCls(item){
        item.itemChecked = !item.itemChecked
        if (item.itemChecked && this.nowCheckedClsPic.indexOf(item.id) === -1){
          this.nowCheckedClsPic.push(item.id)
        }else {
          let index = this.nowCheckedClsPic.findIndex(el=>{ return el.id == item.id})
          this.nowCheckedClsPic.splice(index, 1)
        }
        if (this.nowCheckedClsPic) {
          this.nowCheckedClsPic = true
          this.$store.commit('setNowCheckedIds', this.nowCheckedClsPic)
        }else{
          this.nowCheckedClsPic = true
        }
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
        let routeData = this.$router.resolve({
          name:'PicturesInfo',
          query:{ id: id }
        });
        window.open(routeData.href, '_blank');
      },
      getPicUrl(url){
        const baseUrl = window.baseUrl +  "/testpreview/"
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
    }
  }
</script>

<style scoped>
  .pictures{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .file_nav_intel{
    color: cornflowerblue;
  }
  /*智能分类开始*/
  .intelligence_order>div{
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }
  .intelligence_order>div>svg{
    font-size: 60px;
  }
  /*pics*/
  .pics>.pics_item{
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
  }
  .pics>.pics_item>.img_outer{
    width: 150px;
    height: 150px;
    display: inline-block;
    background-size: cover;
    cursor: pointer;
  }
  .pics>.pics_item>.img_outer>img{
    width: 150px;
    display: inline-block;
  }
  /*智能分类结束*/
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
    overflow: hidden;
    background-size: cover;
    /*transition: opacity linear .15s;*/
    /*background-position: center center;*/
    /*background-repeat: no-repeat;*/
    cursor: pointer
  }
  .month_div>.img_outer_outer>.img_outer>img{
    width: 150px;
    /*height: 150px;*/
  }
  .month_div>.img_outer_outer:hover{
    background-color: rgba(221, 221, 221, 0.78);
  }
  .blockItemCheckedClass{
    background-color: rgba(221, 221, 221, 0.78);
  }
  .blockItemCheckedClass .checkbox {
    display: block
  }
  .checkbox {
    display: none;
  }
  .img_outer_outer:hover .checkbox {
    display: block;
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
