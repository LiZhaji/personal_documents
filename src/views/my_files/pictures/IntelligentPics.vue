<template>
  <div class="intelligent_pics">
    <FileOperation></FileOperation>
    <div class="file_nav">
      <span v-show="!enterFolder" @click="intelOrder">智能分类</span>
      <span v-show="enterFolder" class="file_nav_intel"> > {{keyName}}</span>
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
    <div  v-if="!enterIntelPic" class="intelligence_order">
      <div v-for="(item, index) in intelPics" :key="'iop'+index"
           @click.stop="getClassPic(item.id, item.name)">
        <svg class="icon" aria-hidden="true">
          <use xlink:href="#icon-aFile"></use>
        </svg>
        <p>{{item.name}}</p>
      </div>
    </div>
    <div v-if="enterFolder" class="pics">
      <div class="pics_item" v-for="(item, index) in classPics" :key="index"
           :class="item.itemChecked ? 'blockItemCheckedClass' : ''">
        <span class="checkbox iconfont icon-checked_circle" @click.stop="itemCheckedCls(item)"></span>
        <div class="img_outer" @click="showInfo(item.id)" :style="{'background-image': 'url('+getPicUrl(item.url)+')'}">
          <!--          <img :src="getPicUrl(item.url)" alt="图片预览图">-->
        </div>
      </div>
    </div>
    <!-- 自定义归档目录 -->
    <el-popover placement="top" width="160" popper-class="define_catalog_outer">
      <p class="def_catalog" v-show="chooseDefineCatalog" v-for="item in defineFiles" @click="defCatalogOk(item.id)">
        <svg v-show="item.id >= 0" class="icon" aria-hidden="true">
          <use xlink:href="#icon-aFile"></use>
        </svg>
        {{item.name}}
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
  import FileOperation from "../../../components/FileOperation"
  import {
    toggleTip,
    fetchList,
    uploadOrUpdate,
    inputIsEmpty
  } from "../../../publics/public"
  export default {
    components: {
      FileOperation: FileOperation
    },
    data(){
      return{
        intelPics: {},
        checkedIds: [],
        checkedCategory: [],
        enterFolder: false,
        keyName:'',
        classPics:[],
        defineFiles:[],
        isDefineFile:false,
        chooseDefineCatalog:false,
        createDefCatalog: false,
        defCatName:''
      }
    },
    methods:{
      getClassPic(id, name) {
        this.enterFolder = true
        this.keyName = name
        const childUrl = '/filefiling/' + id
        fetchList(childUrl).then(data => {
          for (let key in data) {
            data[key].forEach(el => {
              if (el.info) {
                el.info = JSON.parse(el.info)
              }
              el.itemChecked = false
            })
          }
          this.classPics = data.IMAGE
        })
      },
      defaultOrder() {
        this.$router.push('/main/pictures')
      },
      timeLine() {
        this.$router.push('/main/timeLinePics')
      },
      intelOrder() {
        this.enterIntelPic = false
        // 从后台请求数据
        fetchList('/getimageinsight').then(data => {
          this.intelPics = data
        }).catch((error) => {
          toggleTip(this, error)
        })
      },
      showInfo(id) {
        let routeData = this.$router.resolve({
          name: 'PicturesInfo',
          query: {id: id}
        });
        window.open(routeData.href, '_blank');
      },
      itemCheckedTimeLine(item) {
        item.itemChecked = !item.itemChecked
        if (item.itemChecked && this.checkedIds.indexOf(item.id) === -1) {
          this.checkedIds.push(item.id)
          this.checkedIds.push(item.category)
        } else {
          let index = this.checkedIds.findIndex(el => {return el.id == item.id})
          this.checkedIds.splice(index, 1)
          this.checkedCategory.splice(index, 1)
        }
        if (this.checkedIds.length != 0) {
          this.isDefineFile = true
        } else {
          this.isDefineFile = true
        }
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
    }
  }
</script>

<style scoped>
  .intelligent_pics {
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }

  .file_nav_intel {
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
    top: 160px;
    left: 500px;
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
    top: 160px;
    left: 500px;
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
</style>
