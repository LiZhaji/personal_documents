<template>
  <div class="sidebar">
    <div class="logo">logo</div>
    <transition name="sidebarNav_left">
      <ul class="activities" v-show="!isMyFile">
        <li @click="toMyFile"><span class="iconfont icon-my-files"></span><span class="activity_name">我的文件</span></li>
        <router-link to="/main/useTimes"><li :class="{chosen: '/main/useTimes'=== $route.path}"><span class="iconfont icon-editor"></span><span class="activity_name">使用统计</span></li></router-link>
        <router-link to="/main/taskList"><li :class="{chosen:'/main/taskList' === $route.path}"><span class="iconfont icon-task"></span><span class="activity_name">任务清单</span></li></router-link>
        <router-link to="/main/myCollections"><li :class="{chosen:'/main/myCollections' === $route.path}"><span class="iconfont icon-my-collections"></span><span class="activity_name">我的收藏</span></li></router-link>
        <router-link to="/main/myLikes"><li :class="{chosen:'/main/myLikes' === $route.path}"><span class="iconfont icon-my-follows"></span><span class="activity_name">我的关注</span></li></router-link>
        <router-link to="/main/mail"><li :class="{chosen:'/main/mail' === $route.path}"><span class="iconfont icon-mail"></span><span class="activity_name">邮箱管理</span></li></router-link>
        <router-link to="/main/feedback"><li :class="{chosen:'/feedback' === $route.path}"><span class="iconfont icon-feedback"></span><span class="activity_name">意见反馈</span></li></router-link>
        <router-link to="/main/empty"><li :class="{chosen:'/main/empty' === $route.path}"><span class="iconfont icon-empty"></span><span class="activity_name">回收站</span></li></router-link>
        <router-link to="/main/setup"> <li :class="{chosen:$route.path==='/main/setup'  }"><span class="iconfont icon-setup"></span><span class="activity_name">设置</span></li></router-link>
      </ul>
    </transition>
    <transition name="sidebarNav_right">
      <ul class="activities_of_files" v-show="isMyFile">
        <li @click="toActivities"><span class="iconfont icon-undo"></span><span class="activity_name">返回</span></li>
        <router-link to="/main/latelyFiles"><li :class="{chosen: '/main/latelyFiles'=== $route.path}"><span class="iconfont icon-lately-files"></span><span class="activity_name">最近文件</span></li></router-link>
        <router-link to="/main/allFiles"><li :class="{chosen: '/main/allFiles'=== $route.path}"><span class="iconfont icon-all-files"></span><span class="activity_name">全部文件</span></li></router-link>
        <router-link to="/main/pictures"><li :class="{chosen: '/main/pictures'=== $route.path}"><span class="iconfont icon-picture"></span><span class="activity_name">图片</span></li></router-link>
        <router-link to="/main/documents"><li :class="{chosen: '/main/documents'=== $route.path}"><span class="iconfont icon-documents"></span><span class="activity_name">文档</span></li></router-link>
        <router-link to="/main/audios"><li :class="{chosen: '/main/audios'=== $route.path}"><span class="iconfont icon-audios"></span><span class="activity_name">音频</span></li></router-link>
        <router-link to="/main/videos"><li :class="{chosen: '/main/videos'=== $route.path}"><span class="iconfont icon-video"></span><span class="activity_name">视频</span></li></router-link>
        <router-link to="/main/others"><li :class="{chosen: '/main/others'=== $route.path}"><span class="iconfont icon-others"></span><span class="activity_name">其他</span></li></router-link>
      </ul>
    </transition>
    <div class="operations">
      <span class="iconfont icon-up-file up_file" title="点击上传文件" @click="upFile">&nbsp上传</span>
      <el-popover
        popper-class="new_folder"
        placement="top"
        width="150"
        trigger="click"
        >
        <p @click="needNewFolder">新建文件夹</p>
        <p @click="needNewTask">新建任务</p>
        <el-button slot="reference"><span  class="iconfont icon-add new_file" title="点击新建文件"  @click="newFile">&nbsp新建</span></el-button>
        <!--<el-button slot="reference"class="new_file"><span  class="iconfont icon-add " title="点击新建文件"  @click="newFile">&nbsp新建</span></el-button>-->
      </el-popover>
    </div>
    <transition name="alertTip">
      <div class="up_file_box" v-show="isUpFile">
        <p class="box_title">上传文件</p>
        <p><span class="location_file">上传至</span><input v-model="fileLocation" class="location_file_input" type="text"></p>
        <p><span class="choose_file">选择文件</span><span class="choose_file_input" placeholder="点击选择"><span>{{curFile.name}}</span><input type="file" @change="getFile" title="点击选择文件"></span></p>
        <p><span class="tag_file">标签</span><input class="tag_file_input" type="text" v-model="newTag" placeholder="以空格分隔"></p>
        <div class="importance_file"><span class="importance_title">标记</span>
          <input id="importance-11" class="importance-1" name="importance" type="radio" value=-1 @click="getFolderImportance"><label for="importance-11">重要</label>
          <input id="importance11" class="importance1" name="importance" type="radio" value=1 @click="getFolderImportance"><label for="importance11">重要吗</label>
          <input id="importance01" class="importance0" name="importance" type="radio" value=0 @click="getFolderImportance" checked="checked"><label for="importance01">一般</label>
        </div>
        <div class="buttons">
          <button type="button"class="yes" @click="submitFile">确定</button>
          <button type="button" class="cancel" @click="cancelUpFile">取消</button>
        </div>
      </div>
    </transition>
    <transition name="alertTip">
      <div class="new_task_box" v-show="isNewTask">
        <p class="box_title">新建任务</p>
        <p class="new_task_content">内容 <textarea v-model="newTask.content"></textarea></p>
        <p><span class="time">创建日期</span>{{getNowDay()}}</p>
        <div class="block ">
          <span class="demonstration tip_time">提醒时间</span>
          <el-date-picker
            v-model="newTask.tipTime"
            type="datetime"
            placeholder="选择时间">
          </el-date-picker>
        </div>
        <p><span class="tag_new_task">标签</span> <el-select class="" v-model="newTask.tag" placeholder="请选择">
          <el-option
            v-for="item in tag"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </p>
        <div class="buttons">
          <button type="button " class="yes" @click="createNewTask">确定</button>
          <button type="button " class="cancel" @click="cancelNewTask">取消</button>
        </div>
      </div>
    </transition>
    <transition name="alertTip">
      <div class="new_folder_box" v-show="isNewFolder">
        <p class="box_title">新建文件夹</p>
        <p><span class="name_folder">名称</span><input class="name_folder_input" v-model="newFolder.name" type="text"></p>
        <p><span class="time_folder">创建日期</span>{{getNowDay()}}</p>
        <div class="importance_folder"><span class="importance_title">标记</span>
          <input id="importance-1" class="importance-1" name="importance" type="radio" value=-1 @click="getFolderImportance"><label for="importance-1">重要</label>
          <input id="importance1" class="importance1" name="importance" type="radio" value=1 @click="getFolderImportance"><label for="importance1">重要吗</label>
          <input id="importance0" class="importance0" name="importance" type="radio" value=0 @click="getFolderImportance" checked="checked"><label for="importance0">一般</label>
        </div>
        <div class="buttons">
          <button type="button " class="yes" @click="createNewFolder">确定</button>
          <button type="button " class="cancel" @click="cancelNewFolder">取消</button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import axios from "axios";
  import { upFileSucceed,inputIsEmpty,getNowDay } from "../publics/public"
  export default {
    data() {
      return {
        fileLocation:'/我的文件',
        isMyFile: false,
        file: '',
        isUpFile: false,
        isNewTask:false,
        isNewFolder:false,
        curFile:{name:'点击选择',tag:''},
        tag: [{
          value: '重要紧急',
          label: '重要紧急'
        }, {
          value: '重要',
          label: '重要'
        }, {
          value: '紧急',
          label: '紧急'
        }, {
          value: '普通',
          label: '普通'
        }],
        newTask:{content: '', createTime: '', tag: '',tipTime:'', remark:'',state:''},
        newTag:'',
        newFolder:{name:'',importance:0}
      }
    },
    mounted(){
      if(localStorage.getItem('tasks') === null) {
        localStorage.setItem('tasks',JSON.stringify(this.$store.state.tasks))
      }
    },
    methods:{
      getNowDay(){
       return getNowDay()
      },
      toMyFile() {
        this.isMyFile = true
      },
      toActivities() {
        this.isMyFile = false
      },
      needNewTask(){
        this.isNewTask = true
      },
      cancelNewTask(){
        this.isNewTask = false
      },
      createNewTask(){
        if(!this.newTask.content) {
          inputIsEmpty(this,'请填写内容')
          return
        }
        this.newTask.createTime = getNowDay()
        this.newTask.state = 0
        this.$store.dispatch('createNewTask',this.newTask)
        this.newTask={content: '', createTime: '', tag: '',tipTime:'', remark:'',state:''}
        this.isNewTask = false
      },
      getFolderImportance(){
        this.newFolder.importance = event.target.value
      },
      needNewFolder(){
        this.isNewFolder = true
      },
      cancelNewFolder(){
        this.isNewFolder = false
      },
      createNewFolder(){
        console.log(this.newFolder)
        // 1.传到后台
        var url = ''
        // axios.post(url,JSON.stringify(this.isUpFile)).then(function () {
        //
        // }).catch(function () {
        //
        // })
      },
      upFile() {
        this.isUpFile = true
        this.$emit('needOpacity',this.isUpFile)
      },
      cancelUpFile(){
        this.isUpFile = false
        this.$emit('needOpacity',this.isUpFile)
      },
      getFile() {
        // const {name, lastModified, size, collection, attention, itemChecked} = event.target.files[0]
        // this.curFile = {name, lastModified, size, collection, attention, itemChecked}
        this.curFile = event.target.files[0]
        console.log(this.curFile)
      },
      submitFile() {
        // 1.本地验证输入
        if(!this.curFile) {
          inputIsEmpty(this,'请选择文件')
        }
        // this.curFile.tag = this.tag.split(" ")
        // this.curFile.collection = false
        // this.curFile.attention = false
        // this.curFile.itemChecked = false
        console.log(this.curFile)
        // 2.实例化一个表单数据对象，遍历curFile数组插入到表单数据对象中,这里只有一个文件，所以不需要遍历了
        let formData = new FormData()
        formData.append("uploadfile", this.curFile)
        formData.append("tag", this.newTag)
        // 3.提交到后台，成功后显示消息
        var url = 'http://192.168.0.133:8080/upload' // 上传地址
        axios.post(url, formData).then(function (response) {
          console.log('response:',response)
          if(response.status >= 200 && response.status < 300 ) {
            upFileSucceed(this)

          }
        })
        // this.$store.commit('setFile',this.curFile)
        this.isUpFile = false
      },
      newFile() {

      }
    },
  }
</script>

<style scoped>
  .operations{
    position: absolute;
    bottom: 50px;
  }
  .el-popover>p {
    cursor: pointer;
    padding: 10px;
  }
  .el-popover>p:hover{
    background-color: rgba(175, 175, 175, 0.41);
    border-radius: 3px;
  }
  .sidebar .up_file{
    background-color: #248dc7;
    border-radius: 5px;
    border: 1px solid #248dc7;
    margin: 10px;
    color: white;
    line-height: 30px;
    padding: 0px 25px;
    font-size: 14px;
    cursor: pointer;
    display: inline-block;
  }
  /*新建和上传文件框，以下通用*/
  .up_file_box,.new_task_box,.new_folder_box{
    width: 460px;
    /*height: 140px;*/
    position: fixed;
    left: 50%;
    top: 50%;
    margin-left: -200px;
    margin-top: -180px;
    border: 1px solid rgba(112, 112, 112, 0.63);
    border-radius:5px;
    background-color: #fff;
    padding:20px 15px;
    z-index: 999;
    color: gray;
  }
  .new_task_box p,.new_task_box .block,
  .up_file_box p,.up_file_box .importance_file,
  .new_folder_box p,
  .new_folder_box .importance_folder{
    margin:0px 10px 10px 5px;
  }
  .buttons{
    text-align: center;
  }
  .buttons>button{
    height: 30px;
    line-height: 30px;
    padding: 0px 25px;
    font-size: 14px;
    cursor: pointer;
    margin: 10px 25px;
    border-radius: 5px;
  }
  button.yes{
    background-color: #248dc7;
    border: 1px solid #248dc7;
    color: white;
  }
  button.cancel{
    background-color: white;
    color: #248dc7;
    border: 1px solid #248dc7;
  }
  .location_file,.choose_file,.tag_file,
  .time,.tip_time,.tag_new_task,
  .name_folder,.time_folder,.importance_title{
    display: inline-block;
    width: 70px;
    margin: 5px;
  }
  .up_file_box .location_file_input,
  .up_file_box .tag_file_input,
  .up_file_box .choose_file_input,
  .new_folder_box .name_folder_input {
    width: 325px;
    height: 25px;
    border-radius: 5px;
    outline: none;
    border: 1px solid rgba(112, 112, 112, 0.73);
    padding: 5px;
    display: inline-block;
    color: rgba(43, 43, 43, 0.86);
    font-size: 14px;
    line-height: 25px;
  }
  /*以下上传文件*/
  .choose_file_input{
    position: relative;
  }
  .choose_file_input>input{
    position: absolute;
    width: 100%;
    left: 0;
    opacity: 0;
  }
  /*以下新建任务*/
  .new_task_box textarea{
    margin-left: 45px;
    border-radius:5px;
    vertical-align: top;
    resize: none;
    width: 315px;
    height: 80px;
    padding: 5px;
    outline: none;
    border: 1px solid rgba(112, 112, 112, 0.73);
    color: #6a6a6a;
  }
  .new_task_box textarea:hover{
    border: 1px solid rgba(138, 138, 138, 0.62)
  }
  .new_task_box textarea:focus{
    border: 1px solid rgb(64, 158, 255)

  }
  .box_title{
    text-align: center;
  }
  /*以下新建文件夹*/
  .importance_folder>input,
  .importance_file>input{
    opacity: 0;
  }
  .importance_folder>label,
  .importance_file>label{
    position: relative;
    margin-right: 20px;
  }
  .importance_folder>input + label:before,
  .importance_file>input + label:before{
    content: '';
    width: 18px;
    height: 18px;
    border-radius:50px;
    cursor: pointer;
    display: inline-block;
    position: absolute;
    top: 2px;
    left: -20px;
  }
  .importance_folder>.importance-1 + label:before,
  .importance_file>.importance-1 + label:before{
     background-color: #f4ea2a;
   }
  .importance_folder>.importance0 + label:before,
  .importance_file>.importance0 + label:before{
    background-color: #bfbfbf;
  }
  .importance_folder>.importance1 + label:before,
  .importance_file>.importance1 + label:before{
    background-color: #1296db;
  }
  input[type='radio']:checked+label:before{
    background-image: url('../assets/img/checked.png');
    background-position: center center;
  }

  .sidebar{
    position: fixed;
    height: 100%;
    width: 240px;
    background-color: rgba(203, 203, 203, 0.27);
    z-index: 99;
  }
  .logo{
    margin: 20px auto;
    width: 150px;
    height: 50px;
    background-color: rgba(67, 112, 74, 0.42);
    border-radius: 15px;
    text-align: center;
    line-height: 50px;
  }
  .activities,
  .activities_of_files{
    list-style: none;
    margin: 0;
    overflow: hidden;
    color: gray;
  }
  .activities li,
  .activities_of_files li{
    padding-left: 40px;
    text-align: left;
    color: #616161;
    cursor: pointer;
  }
  a{
    text-decoration: none;
    color: #616161;
  }
  .activities li .iconfont,
  .activities_of_files li .iconfont{
    font-size: 18px;
    margin-right: 20px;
    padding: 12px 0 12px 0;
  }
  .activities li .icon-my-files{
    font-size: 16px;
  }
  .activities li .activity_name,
  .activities_of_files li .activity_name{
    display: inline-block;
    font-size: 14px;
    padding: 12px 0 12px 10px;
  }
  .activities li:hover, .activities_of_files li:hover{
    color: black;
    background-color: rgba(207, 207, 207, 0.29);
    border-radius: 3px;
  }
  .router-link-exact-active, .router-link-active .chosen {
    color: black;
    background-color: rgba(207, 207, 207, 0.29);
    border-radius: 3px;
  }

  /*只有文字部分有样式*/
  /*.activities li .activity_name:hover,*/
  /*.activities li .activity_name:checked,*/
  /*.activities_of_files li .activity_name:hover,*/
  /*.activities_of_files li .activity_name:checked{*/
    /*background-color: rgba(183, 183, 183, 0.33);*/
    /*border-radius: 3px;*/
  .sidebarNav_left-enter {
    opacity: 0;
    transform: translate3d(-100%, 0,0);
  }
  .sidebarNav_left-enter-active,
  .sidebarNav_left-leave-active {
    transition: all .5s;
  }
  .sidebarNav_left-leave {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }

  .sidebarNav_right-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .sidebarNav_right-enter-active,
  .sidebarNav_right-leave-active {
    transition: all .5s;
  }
  .sidebarNav_right-leave {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .operations .el-button {
    background-color: white;
    border-radius:5px;
    overflow: hidden;
    color: #248dc7;
    border: 1px solid #248dc7;
    cursor: pointer;
    line-height: 30px;
    padding:0px 25px;
    font-size: 14px;

  }
</style>
