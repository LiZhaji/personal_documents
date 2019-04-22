<template>
  <div>
    <div class="bg"></div>
    <div class="file_operation">
<!--      <a href="../../../assets/img/head_photo.jpg" download="img"></a>-->
      <span class="iconfont icon-download"><span class="font">下载</span></span>
      <span class="iconfont icon-share-nocircle"><span class="font">分享</span></span>
      <span class="iconfont icon-delete"><span class="font">删除</span></span>
      <span class="iconfont icon-moveto"><span class="font">移动到</span></span>
      <span class="iconfont icon-rename"><span class="font">重命名</span></span>
      <span class="iconfont icon-mail" @click="mail"><span class="font">发送邮件</span></span>
      <span class="iconfont icon-refresh"><span class="font">刷新</span></span>
    </div>
  </div>

</template>

<script>

  export default {
    data() {
      return {}
    },
    methods:{
      mail(){
        this.$store.commit('openMail')
      }
    }
  }
</script>

<style scoped>
  .bg{
    width: 100%;
    height: 200px;
    border-radius: 50px;
    box-shadow: 0px 0px 100px 10px #e3e3e3;
    position: absolute;
    top: -200px;
  }
  .file_operation{
    margin-top: 20px;
  }
  .file_operation>span{
    margin-right: 30px;
    cursor: pointer;
    font-size: 16px;
    color: rgba(5, 5, 5, 0.77);
  }
  .file_operation span:hover{
    color: #5783d0;
  }
  .file_operation .font{
    font-size: 14px;
    padding-left: 5px;
  }
  a{
    text-decoration: none;
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
