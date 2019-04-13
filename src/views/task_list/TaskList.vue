<template>
  <div class="task_list">
    <OperationBG :navContent="navContent"></OperationBG>
    <div class="block timeSelect">
      <span class="demonstration"><svg class="icon" aria-hidden="true"><use xlink:href="#icon-importance1"></use></svg></span>
      <el-date-picker
        v-model="rangeTime"
        type="month"
        default-value
        placeholder="2019 年 04 月"
        format="yyyy 年 MM 月"
      >
      </el-date-picker>
    </div>
    <div >
        <div class="task_table" >
          <el-table id="table"
          ref="filterTable"
          :data="tasks"
          style="width: 100%"
         @select="selectItem"
          @row-click="clickRow"
         :row-class-name="getRowClassName"
          >
          <el-table-column
            type="selection"
            width="55"
            @click="completed">
          </el-table-column>
          <el-table-column
            prop="content"
            label="内容"
            width="180"
          >
            <!--show-overflow-tooltip="true"-->
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="日期"
            sortable
            width="180"
            column-key="createTime"
          >
          </el-table-column>
          <el-table-column
            prop="tag"
            label="优先级"
            width="100"
            :filters="[{ text: '重要紧急', value: '重要紧急' }, { text: '重要', value: '重要' }, { text: '紧急', value: '紧急' }, { text: '普通', value: '普通' }]"
            :filter-method="filterTag"
            filter-placement="bottom-end">
            <template slot-scope="scope">
              <el-tag
                :type=tagType(scope.row.tag)
                disable-transitions>{{scope.row.tag}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="remark"
            label="备注"
            width="180">
          </el-table-column>
        </el-table>
        </div>
        <div class="task_info">
        <p><span class="close" @click="closes">&times;</span>详细信息</p>
        <p><span class="item_content1">内容</span><span class="item_content2" contenteditable="true">{{chosenItem.content}}</span></p>
        <p><span class="item_tip_time1">提醒时间</span><span class="item_tip_time2">{{chosenItem.tipTime}}</span></p>
        <p><span class="item_add_remark1">添加评论</span><textarea class="item_add_remark2" type="text" v-model="chosenItem.remark"></textarea></p>
        <button class="item_del_btn" @click="delItem">删除</button>
      </div>
    </div>
  </div>
</template>

<script>
  import OperationBG from "../../components/OperationBG"
  import { mapState } from "vuex"
  export default {
    components:{
      OperationBG: OperationBG
    },
    mounted(){
      this.tasks = JSON.parse(localStorage.getItem('tasks')||[])
    },
    watch: {
      tasks: {
        deep: true,
        handler() {
          console.log(123123)
          localStorage.setItem('tasks', JSON.stringify(this.tasks))
        }
      }
    },
    computed:{
      ...mapState(['tasks']),
      tasks:{
        get(){
          return this.$store.state.tasks
        },
        set(val){
          this.$store.state.tasks = val
        }
      }
    },
    data() {
      return {
        navContent:{
          icon: '&#xe732;',
          text: '我的任务清单'
        },
        rangeTime:'',
        multipleSelection:[],
        chosenItem:{},
        nowIndex:0,
        completeIndex:'',
      }
    },
    methods:{
      getRowClassName({row}){
        const arr = [
          {
            key: 'completed',
            value: row.compeleted
          },
          {
            key: 'itemChecked',
            value: row.checked
          }
        ]
        const classNames = arr.filter(({value})=>value).map(({key})=>key).join(' ')
        return classNames

      },
      closes(){
      },
      tagType(tag){
        if(tag === '重要紧急') {
          return 'danger'
        }else if(tag === '重要') {
          return 'primary'
        }else if(tag === '紧急') {
          return 'success'
        }else if(tag === '普通') {
          return 'default'
        }
      },
      filterTag(value, row) {
        return row.tag === value;
      },
      selectItem(selection, row){
        // 1.切换样式 2.更新属性
        row.compeleted=true;
        row.compeleted = selection.indexOf(row) > -1
      },
      clickRow(row, column, event){
        this.chosenItem = row
        this.tasks.forEach(task=>task.checked=false)
        row.checked = true
      },
      delItem(){
        this.$store.dispatch('delItemTask',this.nowIndex)
      },
      completed(){
        console.log('111')
      }
    },
    beforeDestroy() {
      // 关闭之前将不影响页面的值统一保存到本地，如state
      localStorage.setItem('tasks',JSON.stringify(this.tasks))
    }
  }
</script>

<style scoped>

  >>> .completed{
    color: rgba(177, 177, 177, 0.45);
  }
  >>> .itemChecked{
    background-color: #f5f7fa;
  }
  .task_list{
    position: relative;
    overflow: hidden;
    padding-left: 50px;
  }
  .task_table {
    float: left;
    width: 70%;
  }
  .task_info{
    background-color: white;
    border-radius:5px;
    border:1px solid #5e5e5e;
    box-sizing: border-box;
    float: left;
    width: 30%;
  }
  .task_info .close{
    font-size: 25px;
    margin-right: 10px;
    cursor: pointer;
  }
  .task_info>p{
    margin: 10px;
    padding: 10px;
  }
  .item_content1,.item_tip_time1,.item_add_remark1{
    margin: 5px 10px;
  }
  .item_content2,.item_tip_time2{
    color: gray;
  }
  .item_add_remark2{
    width: 70%;
    height: 60px;
    resize: none;
    border: 1px solid rgba(112, 112, 112, 0.73);
    border-radius:5px;
    outline: none;
    padding: 5px;
    vertical-align: top;
  }
  .item_del_btn{
    height: 32px;
    background-color: white;
    border-radius: 5px;
    overflow: hidden;
    margin: 10px 15px;
    color: #248dc7;
    border: 1px solid #248dc7;
    cursor: pointer;
    line-height: 30px;
    padding: 0px 25px;
    font-size: 14px;
  }
  .el-table__header-wrapper,.el-table__body-wrapper{
    /*display: inline-block;*/
    width: auto;
  }

</style>
