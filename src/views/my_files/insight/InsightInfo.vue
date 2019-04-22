<template>
  <div class="insight_info">
    <div class="bg"></div>
    <div class="file_nav">
      <span v-show="forNav"><span @click="backupToInsight">智能归档</span> > {{keyName}}</span>
    </div>
    <div class="six_info_outer">
      <div class="left">
        <div class="pics_outer">
          <div class="title">图片 <span class="no_result" v-show="!fives.pics">暂无图片搜索结果</span></div>
          <div class="pics">
            <div class="pics_item" v-for="(item, index) in fives.pics"
                 :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
              <div class="img_outer" @click="showInfo(item.id)"
                   :style="{'background-image': 'url('+getPicUrl(item.url) +')'}">
<!--                <img :src="getPicUrl(item.url)" alt="图片预览图">-->
              </div>
              <div class="highlight_info highlightbox" >
                <span class="keyword_pic">关键字</span><span v-for="smallItem in item.keyword" v-html="' ' + smallItem"></span>
                <br><span class="tag_pic">标签</span><span v-for="smallItem in item.tag" v-html="' ' + smallItem"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="videos_outer">
          <div class="title">视频 <span class="no_result" v-show="!fives.videos || !fives.videos.length">暂无视频搜索结果</span></div>
          <div class="videos">
            <div class="videos_item" v-for="(item, index) in fives.videos"  :key="index" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
              <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheck(item)"></span>
              <div class="img_outer" @click="videoPlay(item.id)">
                <img :src="getPicUrl(item.info.thumbUrl)" alt="视频预览图">
              </div>
              <p v-html="item.name"></p>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="count_show">

        </div>
        <div class="docs_outer">
          <div class="title">文档 <span class="no_result" v-show="!fives.docs">暂无文档搜索结果</span></div>
          <p v-for="item in fives.docs" @click.stop="itemCheck(item)" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true"><use :xlink:href=fileIconsOrOthers(item.id)></use></svg>
            <span @click="showFile(item.id)" v-html="item.name"></span></p>
        </div>
        <div class="audios_outer">
          <div class="title">音频 <span class="no_result" v-show="!fives.audios">暂无音频搜索结果</span></div>
          <p v-for="item in fives.audios" @click.stop="itemCheck(item)" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-mp3"></use></svg>
            <span v-html="item.name"></span></p>
        </div>
        <div class="others">
          <div class="title">其他 <span class="no_result" v-show="!fives.others">暂无其他</span></div>
          <p v-for="item in fives.others" @click.stop="itemCheck(item)" :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
            <span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span>
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-others"></use></svg>
            <span v-html="item.name"></span></p>
        </div>
      </div>
    </div>
    <!-- 自定义归档目录 -->
    <el-popover placement="top" width="160" popper-class="define_catalog_outer">
      <p class="def_catalog" v-show="chooseDefineCatalog" v-for="item in defineFiles" @click="defCatalogOk(item.id)">
        <svg v-show="item.id >= 0" class="icon" aria-hidden="true">
          <use xlink:href="#icon-aFile"></use>
        </svg>
        <span v-html="item.name"></span>
      </p>
      <span slot="reference" v-show="isDefineFile" class="defBtn" @click="defineFile">归档于</span>
    </el-popover>
    <!-- 新建自定义归档-->
    <div v-show="createDefCatalog" class="newDef">
      <svg class="icon" aria-hidden="true">
        <use xlink:href="#icon-aFile"></use>
      </svg>
      <input type="text" v-model="defCatName" placeholder="请输入文件名">
      <span class="iconfont icon-checked_circle" @click="newDefCatOk"></span>
      <span class="iconfont icon-close" @click="cancelNewDefCat"></span>
    </div>
  </div>
</template>

<script>
  import { mapState } from  "vuex";
  import { fetchList, uploadOrUpdate, toggleTip, inputIsEmpty } from "../../../publics/public";

  export default {
    name: "InsightInfo",
    data() {
      return {
        keyName:'',
        fives:{docs:[], pics: [], videos:[], audios: [], others: []},
        checkedIds:[],
        checkedCategory:[],
        fromInsight: false,
        forNav:false,
        defineFiles:[],
        chooseDefineCatalog:false,
        createDefCatalog: false,
        defCatName:'',
        mailFiles:[]
      }
    },
    computed:{
      ...mapState(['file_icons','intelFileTime','isDefineFile', 'searchKey', 'searchWay']),
      isDefineFile:{
        get(){
          return this.$store.state.isDefineFile
        },
        set(val){
          this.$store.state.isDefineFile = val
        }
      }
    },
    mounted(){
      console.log('insightIndo is coming')
      this.fetchNowTelFile()
    },
    methods:{
      backupToInsight(){
        this.$router.push('/main/insight')
      },
      fetchNowTelFile(){
        // 有fromInsight表示insight进入，否则默认搜索进入
        if (this.$route.params.fromInsight){
          this.fromInsight = true
          this.forNav = true
        }
        if (this.fromInsight){
          this.keyName = this.$route.params.name
          const id = this.$route.params.id
          const isTime = this.$route.params.isTime
          let childUrl
          if (isTime) {
            childUrl = '/gettimefile?id=' + id
          }else{
            childUrl = '/filefiling/' + id
          }
          fetchList(childUrl).then(data=>{
            for (let key in data){
              data[key].forEach(el=> {
                el.itemChecked = false
                if (el.info) {
                  el.info = JSON.parse(el.info)
                }
                if (el.keyword) {
                  el.keyword = el.keyword.split(' ')
                }
                if (el.tag) {
                  el.tag = el.tag.split(' ')
                } else {
                  el.tag = []
                }
              })
            }
            this.fives.docs = data.DOCUMENT
            this.fives.pics = data.IMAGE
            this.fives.videos = data.VIDEO
            this.fives.audios = data.AUDIO
            this.fives.others = data.OTHER
          })
          this.fromInsight = false
        }else{
          const childUrl = '/search'
          let formData = new FormData()
          formData.append('way',this.searchWay)
          formData.append('text',this.searchKey)
          uploadOrUpdate(childUrl, formData).then(data=>{
            for (let key in data){
              data[key].forEach(el=> {
                // el = JSON.parse(el)
                el.itemChecked = false
                el.mouseIn = false
                if (el.info) {
                  el.info = JSON.parse(el.info)
                }
                if (el.keyword) {
                  el.keyword = el.keyword.split(' ')
                }
                if (el.tag) {
                  el.tag = el.tag.split(',')
                } else {
                  el.tag = []
                }
              })
            }
            this.fives.docs = data.DOCUMENT
            this.fives.pics = data.IMAGE
            this.fives.videos = data.VIDEO
            this.fives.audios = data.AUDIO
            this.fives.others = data.OTHER
          })
        }
      },
      getPicUrl(url){
        var baseUrl = window.baseUrl +  "/testpreview/"
        return baseUrl + url
      },
      itemCheck(item){
        item.itemChecked = !item.itemChecked
        const index = this.checkedIds.findIndex(el=>{el.id === item.id})
        if (item.itemChecked && index < 0){
          this.checkedIds.push(item.id)
          this.checkedCategory.push(item.category)
          this.mailFiles.push({id: item.id, name: item.name})
        }else{
          this.checkedIds.splice(index, 1)
          this.checkedCategory.splice(index, 1)
          this.mailFiles.splice(index, 1)
        }
        if (this.checkedIds.length != 0){
          this.isDefineFile = true
          this.$store.commit('setMailFiles', this.mailFiles)
        } else{
          this.isDefineFile = false
        }
      },
      showInfo(id){
        let routeData = this.$router.resolve({
          name:'PicturesInfo',
          query:{
            id: id,
          }
        });
        window.open(routeData.href, '_blank');
      },
      videoPlay(id){
        let routerData = this.$router.resolve({
          path: '/videoInfo',
          query: {id: id}
        })
        window.open(routerData.href, '_blank')
      },
      fileIconsOrOthers(id){
        const nowFile = this.fives.docs.find(el=>{ return el.id == id})
        const ext = nowFile.name.split('.').pop()
        return "#icon-file_" + (this.file_icons.indexOf(ext) < 0 ? 'others' : ext)
      },
      showFile(id){
        const nowFile = this.fives.docs.find(el=>{return el.id == id})
        this.$store.commit('setNowFile', nowFile)
        this.$router.push({
          name:'ShowFile',
          params:{
            fromSearch: true
          }
        })
      },
      defCatalogOk(id) {
        // id>=0 表示归档到已有，id<0 表示新建
        if (id >= 0) {
          const childUrl = '/movedefined'
          let formData = new FormData()
          formData.append('id', id)
          formData.append('ids', this.checkedIds)
          formData.append('category', this.checkedCategory)
          uploadOrUpdate(childUrl, formData).then(data => {
            if (data.success) {
              toggleTip(this, '归档成功')
            }
          })
          this.chooseDefineCatalog = false
          this.isDefineFile = false
        } else {
          this.createDefCatalog = true
        }
      },
      newDefCatOk() {
        if (!this.defCatName) {
          inputIsEmpty(this, '文件名不能为空')
          return
        }
        const childUrl = '/createdefined'
        let formData = new FormData()
        formData.append('name', this.defCatName)
        formData.append('ids', this.checkedIds)
        formData.append('category', this.checkedCategory)
        uploadOrUpdate(childUrl, formData).then(data => {
          if (data.success) {
            toggleTip(this, '归档成功')
          }
        })
        this.createDefCatalog = false
        this.chooseDefineCatalog = false
        this.isDefineFile = false
      },
      cancelNewDefCat() {
        this.defCatName = ''
        this.createDefCatalog = false
      },
      defineFile() {
        this.chooseDefineCatalog = true
        fetchList('/getdefined').then(data => {
          this.defineFiles = data
          this.defineFiles.push({id: -1, name: '新建目录'})
        })
      },
    },
    watch: {
      intelFileTime() {
          this.fetchNowTelFile()
      }
    }
  }
</script>

<style scoped>
  .insight_info{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
  .bg{
    width: 100%;
    height: 200px;
    border-radius: 50px;
    box-shadow: 0px 0px 100px 10px #e3e3e3;
    position: absolute;
    top: -200px;
  }
  .file_nav{
    font-size: 14px;
    color: cornflowerblue;
  }
  /*自定义归档*/
  .def_catalog {
    padding: 5px;
    cursor: pointer;
  }

  .def_catalog:hover {
    background-color: #efefef;
    border-radius: 5px;
  }

  .defBtn {
    position: absolute;
    top: 30px;
    left: 50px;
    padding: 5px 10px;
    border: 1px solid #efefef;
    border-radius: 5px;
    color: cornflowerblue;
    background-color: #efefef;
    cursor: pointer;
  }

  .newDef {
    position: fixed;
    top: 160px;
    left: 600px;
    padding: 5px 10px;
    color: cornflowerblue;
  }

  .newDef > svg {
    font-size: 20px;
  }

  .newDef > input {
    padding: 5px;
    font-size: 13px;
    border: 1px solid #efefef;
    border-radius: 5px;
    outline: none;
  }

  /*  six_info */
  .pics_outer,.videos_outer,.count_show,
  .docs_outer,.audios_outer,.others{
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 10px 0px;
  }
  .six_info_outer .no_result{
    color: gray;
    font-size: 13px;
  }
  .six_info_outer .left{
    display: inline-block;
    width: 800px;
  }
  .six_info_outer .right{
    display: inline-block;
    width: 400px;
    margin-left: 10px;
  }
  .six_info_outer .title{
    margin: 10px 20px;
    color: cornflowerblue;
  }
  .six_info_outer .icon-checked_circle{
    cursor: pointer;
    position: absolute;
    font-size: 17px;
  }
  /*pics*/
  .six_info_outer .pics>.pics_item{
     display: inline-block;
     padding: 10px;
     margin: 10px;
     position: relative;
  }
  .highlight_info{
    position: absolute;
    left: 175px;
    top: 0px;
    background-color: white;
    width: 150px;
    height: 150px;
    border: 1px solid lightgray;
    border-radius: 5px;
    box-shadow: 0px 0px 10px 1px #acacac;
    padding: 10px;
    z-index: 999;
  }
  .highlight_info .keyword_pic,
  .highlight_info .tag_pic{
    display: inline-block;
    width: 50px;
    color: gray;
  }
  .six_info_outer .pics>.pics_item>.img_outer{
    width: 150px;
    height: 150px;
    display: inline-block;
    background-size: cover;
    /*transition: opacity linear .15s;*/
    /*background-position: center center;*/
    /*background-repeat: no-repeat;*/
    cursor: pointer;
  }
  .six_info_outer .pics>.pics_item>.img_outer>img{
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
  .highlightbox{
    display: none;
  }
  .pics_item:hover .checkbox,
  .pics_item:hover .highlightbox {
    display: block;
  }
/* right*/
  .six_info_outer>.right p{
    padding:5px 0px 5px 20px;
    cursor: pointer;
  }
  .six_info_outer>.right p>svg{
    font-size: 25px;
  }
  .six_info_outer>.right p>span{
    padding-left: 5px;
  }
</style>
