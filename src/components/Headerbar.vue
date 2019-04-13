<template>
  <div class="header clearFix">
    <!--搜索-->
    <div class="search">
      <input type="text" placeholder="搜索关键字" v-model="searchKey">
      <span class="iconfont icon-search" @click="search"></span>
    </div>
    <!--通知和历史操作-->
    <div class="two_icon">
      <span class="iconfont icon-remind" title="点击查看通知"></span>
      <span class="iconfont icon-history" title="查看历史操作"></span>
    </div>
    <!--个人信息-->
    <div class="person_info">
      <img :src="personInfo.headPhoto" alt="头像">
      <div class="pi_right">
        <div>
          <span class="username" >{{personInfo.username}}</span>
          <div class="vip">
            <span v-show="personInfo.vip">会员</span>
            <span v-show="!personInfo.vip">非会员</span>
            <!--会员icon默认是灰色的，表示非会员-->
            <span :class="{is_vip:personInfo.vip }" class="iconfont icon-vip"></span>
          </div>
        </div>
        <div>
          <div class="capacity">
            <div class="used"></div>
          </div>
          <span class="capacity_num">100/600GB</span>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        searchKey:'',
        personInfo:{
          headPhoto: require('../assets/img/head_photo.jpg'),
          username:'userA',
          vip:true,
          usedSize:'100',
          totalSize:'600'
        }
      }
    },
    methods:{
      search() {

      }
    }
  }
</script>

<style scoped>

  .header{
    padding: 20px 0px 20px 50px;
    color: gray;
  }
  .search{
    width: 700px;
    position: relative;
    float: left;
  }
  .search input{
    width: 94%;
    height: 40px;
    border-radius: 5px;
    border: 1px solid rgba(203, 203, 203, 0.27) ;
    background-color: rgba(203, 203, 203, 0.27);
    padding: 2px 3%;
    font-size: 15px;
  }
  .search input:hover, .search input:focus{
    border: 1px solid rgba(100, 100, 100, 0.27);
    outline: none;
  }
  .search span{
    position: absolute;
    top: 32%;
    right: 10px;
    cursor: pointer;
  }
  .two_icon{
    float: left;
    padding: 10px 30px;
  }
  .two_icon .icon-remind, .two_icon .icon-history{
    font-size: 25px;
    padding: 0px 10px;
    cursor: pointer;
  }
  .person_info{
    float: left;
    padding: 0px 30px;
  }
  .person_info img{
    width: 50px;
    height: 50px;
    border-radius: 50px;
    cursor: pointer;
    float: left;
  }
  .pi_right{
    float: left;
    padding:0px 20px;
  }
  .person_info .username{
    cursor: pointer;
    padding: 5px;
  }
  .person_info .vip {
    display: inline-block;
    padding: 5px 50px;

  }
  .is_vip{
    color: #c7a32d;
  }
  .capacity{
    width: 100px;
    background-color: rgba(199, 199, 199, 0.26);
    border-radius: 5px;
    height: 10px;
    display: inline-block;
  }
  .capacity .used{
    background-color: #248dc7;
    width: 20%;
    border-radius: 5px;
    height: 10px;
  }
  .capacity_num{
    font-size: 13px;

  }
</style>
