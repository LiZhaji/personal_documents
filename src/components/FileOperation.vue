<template>
  <div>
    <div class="bg"></div>
    <div class="file_operation">
      <a href="../../../assets/img/head_photo.jpg" download="img"><span class="iconfont icon-download">下载</span></a>
      <span class="iconfont icon-share-nocircle">分享</span>
      <span class="iconfont icon-delete">删除</span>
      <span class="iconfont icon-moveto">移动到</span>
      <span class="iconfont icon-rename">重命名</span>
      <span class="iconfont icon-refresh">刷新</span>
    </div>
  </div>

</template>

<script>

  export default {
    data() {
      return {}
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
  .file_operation span{
    margin-right: 30px;
    cursor: pointer;
    color: rgba(5, 5, 5, 0.77);
  }
  .file_operation span:hover{
    color: black;
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
