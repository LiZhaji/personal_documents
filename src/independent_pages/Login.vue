<template>
  <div class="login">
    <div class="smallBg">
      <div class="outer">
        <img class="logo" src="../assets/img/logo.png" alt="logo">
        <div class="input_outer">
          <div>
            <span class="iconfont icon-user"></span>
            <input v-model="user.name" type="text" placeholder="输入用户名">
            <div class="aLine"></div>
          </div>
          <div>
            <span class="iconfont icon-passward"></span>
            <input v-model="user.password" type="password" placeholder="输入密码" @keyup.enter="login">
            <div class="aLine"></div>
          </div>
          <div class="button_outer">
            <button type="button" @click="login">登录</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { inputIsEmpty, uploadOrUpdate} from "../publics/public";

  export default {
    data() {
      return {
        user:{name:'', password:''}
      }
    },
    methods:{
      login(){
        if (!this.user.name ) {
          inputIsEmpty(this, '用户名不能为空')
        }
        if (!this.user.password) {
          inputIsEmpty(this, '密码不能为空')
        }
        let formData = new FormData()
        formData.append('username', this.user.name)
        formData.append('password', this.user.password)
        uploadOrUpdate('/validation',formData).then(data=>{
          if (data.success) {
            this.$router.push('/main')
          }else {
            inputIsEmpty(this,data.errMsg)
          }
        })
      }
    }
  }
</script>

<style scoped>
.login{
  background: url("../assets/img/bg2.png");
  text-align: center;
  height: 750px;
}
  .smallBg{
    display: inline-block;
    background: url("../assets/img/bg1.png");
    background-size: cover;
    width: 80%;
    padding: 90px 845px 80px 0px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: left;
    height: 700px;
  }
  .smallBg .logo{
    width: 170px;
  }
  .outer{
    padding: 50px 0px;
    text-align: center;
  }

  .input_outer{
    margin: 110px 50px 5px 45px;
    text-align: left;
  }
  .input_outer>div{
    margin-bottom: 70px;
  }
  .input_outer span{
    color: #aaaaaa;
    padding: 5px;
  }
  .input_outer input{
    outline: none;
    padding: 1px 5px;
    border: none;
  }
  .input_outer .aLine{
    border-bottom: 1px solid #a0a0a0;
    margin-top: 5px;
  }
  .button_outer{
    text-align: center;
    margin-top: 80px;
  }
  .input_outer button{
    padding: 5px 50px;
    outline: none;
    color: white;
    background: linear-gradient(cornflowerblue, rgba(100, 149, 237, 0.81),cornflowerblue);
    border: 1px solid cornflowerblue;
    border-radius: 5px;
  }
</style>
