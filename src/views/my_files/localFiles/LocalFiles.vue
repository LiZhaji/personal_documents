<template>
  <div class="local-files">
    <OperationBG :navContent="navContent"></OperationBG>
    <header>
      <span class="disk">当前绑定：<span>{{absolutePath}}</span></span>
      <span placeholder="重新绑定" class="choose_file_input"><span data-v-6be7b2a8="">重新绑定</span>
      <input class="file_input" type="file" webkitdirectory @change="getFiles"> </span>
      <el-switch
        v-model="toBackEnd"
        active-text="内容分析"
        inactive-text="">
      </el-switch>
      <input class="search-input" type="text" placeholder="文件名搜索" v-model="searchKey" @change="search">
    </header>
    <section class="clearFix content">
      <div class="left_content">
        <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText">
        </el-input>
        <el-tree :data="isSearch ? backup : catalog" :props="defaultProps" class="filter-tree"
                 default-expand-all
                 :filter-node-method="filterNode"
                 ref="tree2":highlight-current="T" @current-change="nodeChange"></el-tree>
      </div>
      <div class="six_info_outer">
        <div class="">
          <div class="pics_outer">
            <div class="title">图片 <span class="no_result" v-show="!fives.pics">暂无图片</span></div>
            <div class="pics">
              <div class="pics_item" v-for="(item, index) in fives.pics"
                   :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
                <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
                <div class="img_outer" @click="openFile(item)"
                     :style="{'background-image': 'url('+getPicUrl(item) +')'}"></div>
                <p>{{item.name}}</p>
              </div>
            </div>
          </div>
          <div class="videos_outer">
            <div class="title">视频 <span class="no_result" v-show="!fives.videos || !fives.videos.length">暂无视频</span>
            </div>
            <div class="videos">
              <div class="videos_item" v-for="(item, index) in fives.videos" :key="index"
                   :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
                <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
                <div class="img_outer" @click="openFile(item)">
<!--                  <img :src="getVideoPre(item)" alt="视频预览图">-->
                  <video id="video" :src="getPicUrl(item)" alt="视频预览图" controls></video>
                </div>
                <p v-html="item.name"></p>
              </div>
            </div>
          </div>
          <div class="docs_outer">
            <div class="title"> 文档 <span class="no_result" v-show="!fives.docs">暂无文档</span></div>
            <div class="docs_item" v-for="item in fives.docs" @click.stop="itemCheck(item)"
                 :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
              <svg class="icon" aria-hidden="true">
                <use :xlink:href=fileIconsOrOthers(item)></use>
              </svg>
              <span @click="openFile(item)" v-html="item.name"></span>
            </div>
          </div>
          <div class="audios_outer">
            <div class="title">音频 <span class="no_result" v-show="!fives.audios">暂无音频</span></div>
            <div v-for="item in fives.audios" @click.stop="itemCheck(item)"
                 :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
              <svg class="icon" aria-hidden="true">
                <use xlink:href="#icon-mp3"></use>
              </svg>
              <span v-html="item.name" @click="openFile(item)"></span>
            </div>
          </div>
          <div class="others">
            <div class="title">其他 <span class="no_result" v-show="!fives.others">暂无其他</span></div>
            <p class="others_item" v-for="item in fives.others" @click.stop="itemCheck(item)"
               :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
              <svg class="icon" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item)></use></svg>
              <span v-html="item.name"></span></p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
  import OperationBG from "../../../components/OperationBG";
  import { mapState } from "vuex";

  export default {
    components: {OperationBG},
    name: "LocalFiles",
    data() {
      return {
        navContent: {
          icon: '&#xe6f5;',
          text: '本地文件'
        },
        toBackEnd: true,
        absolutePath: '无绑定',
        catalog: [],
        fives:{docs:[], pics: [], videos:[], audios: [], others: []},
        searchKey: '',
        T: true,
        defaultProps: {children: 'children', label: 'label'},
        files:[],
        isSearch: false,
        backup: [],
        filterText:''
      }
    },
    mounted(){
      window.a = ActiveXObject
      var cmd = new ActiveXObject("wscript.shell")
      cmd.run("cmd.exe /k "+'node -v');
    },
    computed:{
      ...mapState(['file_icons'])
    },
    methods: {
      getFiles() {
        const fileList = [...event.target.files]
        this.absolutePath = fileList[0].webkitRelativePath.split('/')[0]
        const path = []
        let id = 0
        fileList.forEach(el => {
          el.id = id++
          this.classify(el)
          path.push({id: el.id, path: el.webkitRelativePath})
          this.files.push(el)
        })
        // console.log(path,222)
        this.setCatalog(path)
      },
      setCatalog(path) {
        const children = []
        let count = -1
        for (let item of path) {
          const arr = item.path.split('/')
          let currentChildren = children
          let child = null
          let i = 0
          for (let name of arr) {
            child = currentChildren.find(({label}) => label === name)
            if (!child) {
              child = {
                label: name,
                id: i === arr.length - 1 ? item.id : count--,
                children: []
              }
              currentChildren.push(child)
            }
            currentChildren = child.children
            i++
          }
        }
        this.catalog = children
      },
      classify(item){
        const curType = item.name.split('.').pop().toLocaleLowerCase()
        if (['doc', 'docx', 'pdf', 'xls', 'txt', 'md','ppt','pptx'].indexOf(curType) >= 0) {
          // item.type = 'docu'
          this.fives.docs.push(item)
        } else if (['jpg', 'png', 'gif'].indexOf(curType) >= 0) {
          // item.type = 'image'
          this.fives.pics.push(item)
        } else if (['movie', 'mp4', 'avi','wmv'].indexOf(curType) >= 0) {
          // item.type = 'video'
          this.fives.videos.push(item)
        } else if (['mp3', 'wav'].indexOf(curType) >= 0) {
          // item.type = 'audio'
          this.fives.audios.push(item)
        } else {
          // item.type = 'others'
          this.fives.others.push(item)

        }
      },
      nodeChange(data, obj) {
        // 点击对象为具体文件id>=0 或 总文件id=-1时
        // 当前问题：点击总文件时如何显示全部文件
        if (data.id >= 0) {
          return
        }
        this.fives = {docs:[], pics: [], videos:[], audios: [], others: []}
        data.children.forEach(el=>{
          this.findItem(el)
        })
      },
      findItem(el){
        // id < 0 为文件夹
        if (el.id < 0){
          el.children.forEach(el=>{
            this.findItem(el)
          })
        }
        let item = null
        for (let i=0; i< this.files.length - 1;i++){
          if (el.id === this.files[i].id){
            item = this.files[i]
            break
          }
        }
        this.classify(item)
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      search(){
        const searchKey = this.searchKey.trim()
        if(!searchKey){
          this.isSearch = false
          this.backup = []
          return
        }
        this.backup.push({
          label: searchKey,
          children: []
        })
        this.files.forEach(el=>{
          if (el.name.indexOf(searchKey) != -1){
            // el.name = [...el.name]
            this.backup[0].children.push({label: el.name, id: el.id})
            let item
            for (let i=0; i< this.files.length - 1;i++){
              if (el.id === this.files[i].id){
                item = this.files[i]
                break
              }
            }
            this.classify(item)
          }
        })
        // 没有搜索结果
        if (this.backup[0].children.length == 0){
          this.backup = []
        }
        console.log(this.backup)
        this.isSearch = true
      },
      fileIconsOrOthers(item){
        // const nowFile = this.others.find(el=>{ return el.id == id})
        const ext = item.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      openFile(){

      },
      itemCheck(){

      },
      getPicUrl(item){
        // var baseUrl = window.baseUrl +  "/testpreview/"
        let URL = window.URL || window.webkitURL
        const url = URL.createObjectURL(item)
        return url
      },
      getVideoPre(item){
        const scale = 0.5
        const video = document.querySelector("#video")
        const img = event.target
          // video = $('#videoarea').find('video')[0],
         const canvas = document.createElement("canvas")
          const canvasFill = canvas.getContext('2d');
        canvasFill.drawImage(video, 0, 0, 150, 100);
        return canvas.toDataURL("image/jpeg");
      }
    },
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
  }
</script>

<style scoped>
  .local-files {
    position: relative;
    padding-left: 50px;
    overflow: hidden;
  }
  .search-input{
    border: 1px solid #e0e0e0;
    box-shadow: 0px 0px 10px 0px #e0e0e0;
    outline: none;
    border-radius: 5px;
    padding: 8px 10px;
    font-size: 13px;
    margin-left: 380px;
    width: 300px;
  }
  .pics_item,
  .videos_item{
    font-size: 13px;
    text-align: center;
    overflow: hidden;
  }
  .disk{
    font-size: 14px;
    color: gray;
    display: inline-block;
    min-width: 150px;
  }
  .choose_file_input{
    border-radius: 5px;
    outline: none;
    padding: 3px 10px;
    display: inline-block;
    color: white;
    background: #409EFF;
    border: 1px solid #409EFF;
    font-size: 12px;
    line-height: 20px;
    position: relative;
    margin-right: 160px;
  }
  .file_input{
    position: absolute;
    width: 100%;
    left: 0;
    top: 0;
    opacity: 0;
  }
  .content{
    margin-top: 20px;
  }
  .left_content{
    width: 300px;
    float: left;
    border: 1px solid lightgray;
    border-radius: 5px;
    margin-right: 25px;
    -webkit-box-shadow: 0px 0px 10px 0px lightgrey;
    box-shadow: 0px 0px 10px 0px lightgrey;
    padding: 20px;
    height: 480px;
    overflow: auto;
  }
  /*  six_info */
  .six_info_outer{
    float: left;
  }
  .pics_outer, .videos_outer, .count_show,
  .docs_outer, .audios_outer, .others {
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 0px 20px 10px;
    width: 820px;
  }
  .docs_outer .docs_item{
    padding: 5px 10px;
  }
  .six_info_outer .folders_outer .folder_item {
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }
  #video{
    width: 220px;
  }
  .six_info_outer .folders_outer .folder_item > svg {
    font-size: 60px;
  }

  .six_info_outer .no_result {
    color: gray;
    font-size: 13px;
    margin-left: 10px;
  }

  .six_info_outer .title {
    margin: 10px 20px;
    color: cornflowerblue;
  }
  .six_info_outer .icon-checked_circle {
    cursor: pointer;
    position: absolute;
    font-size: 17px;
  }

  /*pics*/
  .six_info_outer .pics > .pics_item {
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
  }

  .six_info_outer .pics > .pics_item > .img_outer {
    width: 100px;
    height: 100px;
    display: inline-block;
    background-size: cover;
    cursor: pointer;
  }

  .six_info_outer .pics > .pics_item > .img_outer > img {
    width: 150px;
    display: inline-block;
  }
  /*videos*/
  .six_info_outer .videos>.videos_item{
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
    text-align: center;
    overflow: hidden;
    cursor: pointer;
  }
  .six_info_outer .videos>.videos_item>.img_outer>img{
    width: 200px;
    height: 100px;
    display: inline-block;
  }
  .six_info_outer .pics>.pics_item:hover{
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
  .pics_item:hover .checkbox,
  .videos_item:hover .checkbox{
    display: block;
  }
</style>
