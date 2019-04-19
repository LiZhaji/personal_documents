<template>
  <div>
    <!-- 上传文件  -->
    <transition name="alertTip">
      <div class="up_file_box" v-show="isUpFile">
        <p class="box_title">上传文件</p>
        <p><span class="location_file">上传至</span><span @click="chooseFileLocation" class="location_file_input" type="text">{{fileLocationShow}}</span></p>
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
    <!-- 新建任务-->
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
    <!-- 新建文件夹-->
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
    <!-- 音频播放 -->
    <div class="audios_play clearFix" v-if=" isAudioPlay" ref="audiosPlay">
      <div class="header" ref="handle">
        <span class="iconfont icon-audios">&nbsp&nbsp&nbsp{{nowAudio.name}}</span>
        <span class="close" @click="closeAudioPlay" title="点击关闭">&times</span>
      </div>
      <div class="body">
        <div>
          <div class="play" ref="wave"></div>
          <el-button @click="playOrPause">播放/暂停</el-button>
          <div id="Container " class="Container ">{{current}}/{{duration}}</div>
        </div>
        <div class="line"></div>
        <div class="info">
          <p><span>文件类型</span><span>{{getType(nowAudio.name)}}</span></p>
          <p><span>文件大小</span><span>{{getFileSize(nowAudio.size)}}</span></p>
          <p><span>上传时间</span><span>{{nowAudio.time}}</span></p>
          <p><span>关键词</span><span class="keyword" v-for="item in nowAudio.keywords">{{item}}</span></p>
          <div class="tag_audio"><span>标签</span>
            <span class="tag" v-for="(item,index) in nowAudio.tag" :key="index">
                {{item}} <img @click="delOneTag(index)" src="../assets/img/close.png" alt="删除" title="点击删除">
                </span>
            <div class="input_outer">
              <input class="tag_input" type="text" v-model="newTag" placeholder="自定义标签" v-on:keyup.enter="addTag">
              <span class="iconfont icon-checked_circle ok_tag_input" @click="addTag"></span>
            </div>
          </div>
          <div class="remark_audio"><span>用户评价</span>
            <span v-show="!isModifyRemark" class="remarks">{{nowAudio.remark}}</span>
            <span v-show="!isModifyRemark" class="iconfont icon-brush" @click="modifyRemark"></span>
            <div class="input_outer" v-show="isModifyRemark">
              <input v-model="nowAudio.remark" class="remark_input" type="text" placeholder="评价"  v-on:keyup.enter="completeModifyRemark">
              <span class="iconfont icon-checked_circle ok_remark_input" @click="completeModifyRemark"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 目录树形结构 -->
    <div class="catalog_tree" v-if="isCatalogTree">
      <div class="tree_title">选择路径</div>
      <div class="tree_content">
        <el-tree :data="catalog" :props="defaultProps" @node-click="handleNodeClick" @current-change="nodeChange"></el-tree>
        <div v-show="createFoldInUpload">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
          <input type="text" v-model="newFolderUpload.name" placeholder="请输入文件名">
          <span class="iconfont icon-checked_circle" @click="newFoldUploadOk"></span>
          <span class="iconfont icon-close" @click="cancelNewFoldUpload"></span>
        </div>
        <div class="buttons">
          <button type="button" class="cancel" @click="newFolderInUpload">新建</button>
          <button type="button"class="yes" @click="chooseLocationOk">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import Draggable from "draggable"
  import WaveSurfer from 'wavesurfer.js'
  import {
    inputIsEmpty,
    uploadOrUpdate,
    upFileSucceed,
    getFileSize,
    toggleTip,
    formatTime,
    getNowDay,
    fetchList,
  } from "../publics/public"
  export default {
    name: "Popup",
    data(){
      return{
        file: '',
        curFile:{name:'点击选择',tag:''},
        curType:'',
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
        newFolder:{name:'',importance:0},
        fileLocationShow:'/全部文件',
        fileLocation: 1,
        newFolderUpload:{pid: 1, name:''},
        createFoldInUpload: false,
        // audioUrl: this.getAudioUrl,
        audioUrl: 'https://src.fanmingfei.com/nigel.mp3',
        // audioUrl:'',
        nowAudio:{name:'因三月.mp3',size:12933,time:'',keyword:['xx','yy'],tag:['a','b'],remark:'好听....'},
        isOpacity:false,
        isModifyRemark:false,
        newTag:'',
        duration: formatTime(),
        current:  formatTime(),
        catalog: [],
        defaultProps: {children: 'children', label: 'label'},
        a:[{label:'x',children:[{label:'xw'},{label:'xxedede'}]}]
      }
    },
    computed:{
      ...mapState(['isUpFile','isNewTask', 'isNewFolder','isAudioPlay', 'isCatalogTree']),
      isAudioPlay:{
        get(){
          return this.$store.state.isAudioPlay
        },
        set(val){
          this.$store.state.isAudioPlay = val
        }
      },
      isCatalogTree:{
        get(){
          return this.$store.state.isCatalogTree
        },
        set(val){
          this.$store.state.isCatalogTree = val
        }
      }
    },
    mounted() {
      if(localStorage.getItem('tasks') === null) {
        localStorage.setItem('tasks',JSON.stringify(this.$store.state.tasks))
      }
      this.fetchNode()
      this.createWaveSurfer()
      new Draggable(this.$refs.audiosPlay, {
        handle: this.$refs.handle
      })
    },
    methods:{ // what'sx problem. handleNodeClick nodeChange 没有用 what operation i have look. do e
      // 文件树形目录
      fetchNode(){
        // fetchList('/catalogtree').
        Promise.resolve({ // 你继续操作一下下 我看看是啥
            "id": 1,
            "userId": 1,
            "name": "全部文件",
            "pid": 0,
            "nodes": [
              {
                "id": 2,
                "userId": 1,
                "name": "北京市",
                "pid": 1,
                "nodes": [
                  {
                    "id": 11,
                    "userId": 1,
                    "name": "密云县",
                    "pid": 2,
                    "nodes": []
                  }
                ]
              },
              {
                "id": 3,
                "userId": 1,
                "name": "广东省",
                "pid": 1,
                "nodes": [
                  {
                    "id": 5,
                    "userId": 1,
                    "name": "广州市",
                    "pid": 3,
                    "nodes": [
                      {
                        "id": 7,
                        "userId": 1,
                        "name": "海珠区",
                        "pid": 5,
                        "nodes": []
                      },
                      {
                        "id": 8,
                        "userId": 1,
                        "name": "天河区",
                        "pid": 5,
                        "nodes": []
                      }
                    ]
                  },
                  {
                    "id": 6,
                    "userId": 1,
                    "name": "深圳市",
                    "pid": 3,
                    "nodes": [
                      {
                        "id": 9,
                        "userId": 1,
                        "name": "福田区",
                        "pid": 6,
                        "nodes": []
                      },
                      {
                        "id": 10,
                        "userId": 1,
                        "name": "南山区",
                        "pid": 6,
                        "nodes": []
                      }
                    ]
                  }
                ]
              },
              {
                "id": 4,
                "userId": 1,
                "name": "上海市",
                "pid": 1,
                "nodes": [
                  {
                    "id": 12,
                    "userId": 1,
                    "name": "浦东",
                    "pid": 4,
                    "nodes": []
                  }
                ]
              }
            ]
          }
        ).then(data=>{
          console.log('data:',data)
          // data表示最外层，全部文件
          this.catalog.push({id: data.id, label: data.name})
          this.getNodes(this.catalog[0],data.nodes)
          console.log('catalog:',this.catalog)
        })
      },
      getNodes(parent,nodes){
        // parent表示当前nodes的父文件夹
        if (!parent.children) {
          parent.children = []
        }
        nodes.forEach((el, index)=>{
          parent.children.push({id: el.id, label: el.name})
          if (el.nodes){
            this.getNodes(parent.children[index], el.nodes)
          }
        })
      },
      handleNodeClick(parentObj, node, itself){
        console.log('parentObj:',parentObj)
        console.log('node:',node)
        console.log('itself:',itself)
      },
      nodeChange(data,obj){
        console.log('data:',data)
        this.fileLocation = data.id
        this.fileLocationShow = data.label
        this.newFolderUpload.pid = data.id
      },
      newFolderInUpload(){
        this.createFoldInUpload = true
      },
      chooseLocationOk(){
        this.isCatalogTree = false
        if (this.newFolderUpload.name){
          let formData = new FormData()
          formData.append('pid',this.newFolderUpload.pid)
          formData.append('name',this.newFolderUpload.name)
          uploadOrUpdate('/createcatalog').then(data=>{
            this.fileLocation = data
          })
          this.fileLocationShow = this.newFolderUpload.name
        }
      },
      newFoldUploadOk(){
        this.createFoldInUpload = false
      },
      cancelNewFoldUpload(){
        this.newFolderUpload.name = ''
        this.createFoldInUpload = false
      },
      // 上传或新建
      chooseFileLocation(){
        console.log('aaaa')
        this.isCatalogTree = true
      },
      cancelUpFile(){
        this.$store.commit('toggleUpFile')
        this.isCatalogTree = false
      },
      getFile() {
        // const {name, lastModified, size, collection, attention, itemChecked} = event.target.files[0]
        // this.curFile = {name, lastModified, size, collection, attention, itemChecked}
        this.curFile = event.target.files[0]
        this.curType = this.curFile.name.split('.').pop()
        if(['doc','docx','pdf','xls','txt','md'].indexOf(this.curType) >= 0){
          this.curType = 'docu'
        }else if (['jpg','png','gif'].indexOf(this.curType) >= 0){
          this.curType = 'image'
        }else if (['movie','mp4','avi'].indexOf(this.curType) >= 0){
          this.curType = 'video'
        }else if (['mp3','wav'].indexOf(this.curType) >= 0) {
          this.curType = 'audio'
        }else{
          this.curType = 'others'
        }
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
        // 2.实例化一个表单数据对象，遍历curFile数组插入到表单数据对象中,这里只有一个文件，所以不需要遍历
        let formData = new FormData()
        formData.append("uploadfile", this.curFile)
        formData.append("tag", this.newTag)
        formData.append('filelocation', this.fileLocation)
        // 3.提交到后台，成功后显示消息
        uploadOrUpdate('/upload', formData).then(data =>{
          if( data.success) {
            upFileSucceed(this)
            // 执行/发布一个事件用来自动更新列表
            switch (this.curType) {
              case "docu": window.EE.emit('fetchDocuments');break;
              case "image": window.EE.emit('fetchImages');break;
              case "video": window.EE.emit('fetchVideos');break;
              case "audio": window.EE.emit('fetchAudios');break;
              case "others": window.EE.emit('fetchOthers');break;
            }
            window.EE.emit('fetchAllFiles')
          }
        }).catch((error)=>{
          toggleTip(this,error)
        })
        this.$store.commit('toggleUpFile')
      },
      cancelNewTask(){
        this.$store.commit('toggleNewTask')
      },
      createNewTask(){
        if(!this.newTask.content) {
          inputIsEmpty(this,'请填写内容')
          return
        }
        this.newTask.createTime = this.getNowDay()
        this.newTask.state = 0
        this.$store.dispatch('createNewTask',this.newTask)
        this.newTask={content: '', createTime: '', tag: '',tipTime:'', remark:'',state:''}
        this.$store.commit('toggleNewTask')
      },
      getFolderImportance(){
        this.newFolder.importance = event.target.value
      },
      cancelNewFolder(){
        this.$store.commit('toggleNewFolder')
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
        this.$store.commit('toggleNewFolder')
      },
      getNowDay(){
        return getNowDay()
      },
      getAudioUrl(){
        var baseUrl = ''
        this.audioUrl = baseUrl + this.nowAudio.url
      },
      // 音频操作
      createWaveSurfer(){
        this.wavesurfer = WaveSurfer.create({
          container: this.$refs.wave,
          waveColor:'lightgray',
          progressColor:'cornflowerblue',
          height: 100
        })
        this.wavesurfer.load(this.audioUrl)
        this.wavesurfer.on('audioprocess',()=>{
          this.getCurrent()
        })
        this.wavesurfer.on('ready',()=>{
          console.log('readyreayready')
          this.getDuration()
          // this.wavesurfer.play()
        })
      },
      playOrPause(){
        console.log('playpause')
        this.wavesurfer.playPause()
      },
      getCurrent() {
        const current = formatTime(this.wavesurfer.getCurrentTime())
        this.current = current
      },
      getDuration(){
        const duration = formatTime(this.wavesurfer.getDuration())
        this.duration = duration
      },
      closeAudioPlay(){
        // 1.停止播放 2.弹窗关闭
        this.wavesurfer.pause()
        this. isAudioPlay = false
      },
      delOneTag(index) {
        // 1. 通知后台删除此标签
        // 2. 本地删除
        this.nowAudio.tag.splice(index, 1)
      },
      addTag() {
        // 1.本地验证
        if (!this.newTag) {
          inputIsEmpty(this, '不能添加空标签')
          return
        }
        // 2.通知后台添加标签
        // 3.本地显示添加
        this.nowAudio.tag.push(this.newTag)
        this.newTag = ''
      },
      modifyRemark() {
        this.isModifyRemark = true
      },
      completeModifyRemark() {
        // 1.通知后台该音频评论修改
        // 2.本地显示修改后的评论
        this.isModifyRemark = false
      },
      getType(name) {
        const type = name.split('.').pop()
        return type
      },
      getFileSize(size) {
        return getFileSize(size)
      },
    }
  }
</script>

<style scoped>
  /*目录树*/
  .catalog_tree{
    position: fixed;
    z-index: 999;
    width: 300px;
    overflow: auto;
    background-color: white;
    left: 44%;
    top: 20%;
    border-radius: 5px;
    border: 1px solid rgba(112, 112, 112, 0.63);
  }
  .catalog_tree>.tree_title{
    height: 15px;
    font-size: 13px;
    padding: 5px;
    background-color: rgba(95, 144, 228, 0.75);
  }
  .catalog_tree>.tree_content{
    padding: 10px;
  }
  .el-tree{
    height: 280px;
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
  /*audios_play*/
  .audios_play{
    position: fixed;
    z-index: 99;
    width:350px;
    background: white;
    /*border:1px solid rgba(211, 211, 211, 0.65);*/
    left: 200px;
    top: 15px;
    height: auto!important;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 1px 2px 9px 0px #949292fa;;
  }
  .audios_play>.header{
    background: rgba(1, 103, 241, 0.17);
    padding: 3px 8px;
    color: cornflowerblue;
  }
  .audios_play>.header .icon-audios{
    font-size: 14px;
  }
  .audios_play>.header .close{
    float: right;
    cursor: pointer;
  }
  .audios_play>.body{
    padding:10px;
  }
  .audios_play>.body div:first-child{
    text-align: center;
  }
  .audios_play>.body .play{
    text-align: center;
  }
  .audios_play>.body audio{
    width: 260px;
  }
  .audios_play .line{
    background-color: rgba(211, 211, 211, 0.65);
    height: 1px;
    margin: 10px 0px;
  }
  .audios_play>.body>.info>p>span:first-child,
  .audios_play>.body>.info>div>span:first-child{
    display: inline-block;
    width: 56px;
    margin: 5px 35px;
    color: cornflowerblue;
  }
  .audios_play .remark_audio{
    font-size: 0;
  }
  .audios_play .remark_audio span,
  .audios_play .tag_audio span{
    font-size: 14px;
  }
  .audios_play .tag_audio .tag{
    font-size: 11px;
  }
  .audios_play .remark_audio .remarks{
    font-size: 13px;
    margin-right: 10px;
  }
  .audios_play .remark_audio .icon-brush{
    font-size: 13px;
    color: cornflowerblue;
    cursor: pointer;
  }
  .audios_play .input_outer{
    position: relative;
    display: inline-block;
  }
  .audios_play .tag_input,
  .audios_play .remark_input{
    outline: none;
    border-radius: 5px;
    width: 130px;
    height: 20px;
    border: 1px solid lightgray;
    padding: 2px 17px 2px 4px;
    font-size: 12px;
  }
  .audios_play .tag_input{
    margin-left: 126px;
  }
  .audios_play .ok_tag_input,
  .audios_play .ok_remark_input{
    position: absolute;
    right: 5px;
    top: 5px;
    cursor: pointer;
  }
  /*audios_play*/
</style>
