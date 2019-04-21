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
      <tr v-for="(item, index) in allPictures" :key="index" @click="itemCheckedDefault(item)"
          :class="item.itemChecked ? 'item_checked' : ''">
        <td><span v-show="item.itemChecked" class="iconfont icon-checked_circle"></span></td>
        <td class="file_importance">
          <svg class="icon" aria-hidden="true">
            <use :xlink:href="`#icon-importance${item.importance}`"></use>
          </svg>
        </td>
        <td class="file_preview">
          <!--<svg class="icon" aria-hidden="true"><use xlink:href="#icon-file_jpg"></use></svg>-->
          <img :src="getPicUrl(item.url)" alt="预览图" style="width: 35px; ">
        </td>
        <td class="file_name"><span @click.stop="showInfo(item.id)">{{item.name}}</span></td>
        <td>{{unixChange(item.serverTime)}}</td>
        <td>{{getFileSize(item.size)}}</td>
        <td class="star">
          <svg class="icon" aria-hidden="true" @click.stop="toggleCollection(index)">
            <use v-show="!item.collection" xlink:href="#icon-collection"></use>
            <use v-show="item.collection" xlink:href="#icon-collection_fill"></use>
          </svg>
          <svg class="icon" aria-hidden="true" @click.stop="toggleAttention(index)">
            <use v-show="!item.attention" xlink:href="#icon-like"></use>
            <use v-show="item.attention" xlink:href="#icon-like_fill"></use>
          </svg>
        </td>
      </tr>
      </tbody>
    </table>
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
  import {mapState} from "vuex"
  import FileOperation from "../../../components/FileOperation"
  import {
    toggleTip,
    toggleCollection,
    toggleAttention,
    unixChange,
    getFileSize,
    fetchList,
    uploadOrUpdate
  } from "../../../publics/public"

  export default {
    data() {
      return {
        allPictures: [],
        nowCheckedDefault: [],

        intelligenceOrderPics: [],
        classPics: [],
        nowCheckedClsPicIds: [],
        nowCheckedClsPicCategory: [],
        keyName: '',
        chooseDefineCatalog:false,
        createDefCatalog: false,
        defCatName:''
      }
    },
    computed: {
      ...mapState(['isDefineFile']),
      isDefineFile: {
        get() {
          return this.$store.state.isDefineFile
        },
        set(val) {
          this.$store.state.isDefineFile = val
        }
      }
    },
    components: {
      FileOperation: FileOperation
    },
    mounted() {
      // 获取所有图片,默认排列
      this.fetchListDefault()
      window.EE.on('fetchImages', () => {
        this.fetchList()
      })
    },
    methods: {
      defCatalogOk(id) {
        // id>=0 表示归档到已有，id<0 表示新建
        if (id >= 0) {
          const childUrl = '/movedefined'
          let formData = new FormData()
          formData.append('id', id)
          formData.append('ids', this.nowCheckedIds)
          formData.append('category', this.nowCheckedCategories)
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
        formData.append('ids', this.nowCheckedIds)
        formData.append('category', this.nowCheckedCategories)
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
      fetchListDefault() {
        fetchList('/imageinfo').then(data => {
          data.forEach(element => {
            element.itemChecked = false
          })
          this.allPictures = data
        }).catch(error => {
          toggleTip(this, error)
        })
      },
      defaultOrder() {
        this.isDefaultOrder = true
        this.isTimeLine = false
        this.isIntelligenceOrder = false
        this.enterIntelPic = false
        this.fetchListDefault()
      },
      timeLine() {
        this.isTimeLine = true
        this.isDefaultOrder = false
        this.isIntelligenceOrder = false
        this.enterIntelPic = false
      },
      intelOrder() {
        this.enterIntelPic = false
        // 从后台请求数据
        fetchList('/getimageinsight').then(data => {
          this.intelligenceOrderPics = data
        }).catch((error) => {
          toggleTip(this, error)
        })
      },
      itemCheckedCls(item) {
        item.itemChecked = !item.itemChecked
        if (item.itemChecked && this.nowCheckedClsPicIds.indexOf(item.id) === -1) {
          this.nowCheckedClsPicIds.push(item.id)
          this.nowCheckedClsPicCategory.push(item.category)
        } else {
          let index = this.nowCheckedClsPicIds.findIndex(el => {
            return el.id == item.id
          })
          this.nowCheckedClsPicIds.splice(index, 1)
          this.nowCheckedClsPicCategory.splice(index, 1)
        }
        if (this.nowCheckedClsPicIds) {
          this.isDefineFile = true
          this.$store.commit('setNowCheckedIds', this.nowCheckedClsPicIds)
          this.$store.commit('setNowCheckedCategories', this.nowCheckedClsPicCategory)
        } else {
          this.isDefineFile = true
        }
      },
      itemCheckedDefault(item) {
        item.itemChecked = !item.itemChecked
        if (item.itemChecked && this.nowCheckedDefault.indexOf(item.id) === -1) {
          this.nowCheckedDefault.push(item.id)
        } else {
          let index = this.nowCheckedDefault.findIndex(el => {
            return el.id == item.id
          })
          this.nowCheckedDefault.splice(index, 1)
        }
        console.log('nowCheckedDefault:', this.nowCheckedDefault)
      },
      showInfo(id) {
        let routeData = this.$router.resolve({
          name: 'PicturesInfo',
          query: {id: id}
        });
        window.open(routeData.href, '_blank');
      },
      getPicUrl(url) {
        const baseUrl = window.baseUrl + "/testpreview/"
        return baseUrl + url
      },
      toggleCollection(index) {
        toggleCollection(this, this.allPictures, index)
      },
      toggleAttention(index) {
        toggleAttention(this, this.allPictures, index)
      },
      unixChange(timeStamp) {
        return unixChange(timeStamp)
      },
      getFileSize(size) {
        return getFileSize(size)
      }
    }
  }
</script>

<style scoped>
  .pictures {
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }

  .file_nav_intel {
    color: cornflowerblue;
  }



  /*目录树*/
  .catalog_tree {
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

  .catalog_tree > .tree_title {
    height: 15px;
    font-size: 13px;
    padding: 5px;
    background-color: rgba(95, 144, 228, 0.75);
  }

  .catalog_tree > .tree_content {
    padding: 10px;
  }

  .el-tree {
    height: 280px;
    overflow: auto;
  }

  /*智能分类开始*/
  .intelligence_order > div {
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }

  .intelligence_order > div > svg {
    font-size: 60px;
  }

  /*pics*/
  .pics > .pics_item {
    display: inline-block;
    padding: 10px;
    margin: 10px;
    position: relative;
  }

  .pics > .pics_item > .img_outer {
    width: 150px;
    height: 150px;
    display: inline-block;
    background-size: cover;
    cursor: pointer;
  }

  .pics > .pics_item > .img_outer > img {
    width: 150px;
    display: inline-block;
  }

  /*智能分类结束*/

  .file_preview > svg {
    font-size: 30px;
  }

  .order_picker > p {
    padding: 5px;
  }

  .order_picker > p:hover {
    background-color: rgba(211, 211, 211, 0.64);
    border-radius: 5px;
    cursor: pointer;
  }

  .icon-order {
    margin-left: 80%;
  }
</style>
