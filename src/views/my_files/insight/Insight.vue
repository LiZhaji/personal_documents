<template>
  <div class="insight">
    <div class="bg"></div>
    <div class="left_content">
      <div class="time_order">
        <div class="title"><span>时光簿</span></div>
        <div class="content">
          <div v-for="(item, index) in allTimeFiles" :key="index" @click="showInsightInfo(item, ' ', ' ', 1)">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
            <p>{{item}}</p>
          </div>
        </div>
      </div>
      <div class="intelligent_orders">
        <div class="title"><span>智能归档</span></div>
        <div class="content">
          <div v-for="(item, index) in allIntelFiles" :key="index" @click="showInsightInfo(item, item.id, item.name, 0)">
            <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
            <p>{{item.name}}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="owned_folders">
      <div class="title"><span>自定义归档</span></div>
      <div class="content">
        <div v-for="(item, index) in allDefinedFiles" :key="index" @click="showInsightInfo(item, item.id, item.name, 0)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { fetchList } from "../../../publics/public"
  export default {
    data() {
      return {
        nowChecked:[],
        allTimeFiles:[],
        allIntelFiles:[],
        allDefinedFiles:[]
      }
    },
    mounted(){
      this.fetchTimeList()
      this.fetchIntelList()
      this.fetchDfnList()
    },
    methods:{
      fetchTimeList(){
        fetchList('/gettimeline ').then(data=>{
          this.allTimeFiles = data
        })
      },
      fetchIntelList(){
        fetchList('/getinsight').then(data=>{
          this.allIntelFiles = data
        })
      },
      fetchDfnList(){
        fetchList('/getdefined').then(data=>{
          this.allDefinedFiles = data
        })
      },
      showInsightInfo(time, id, name, isTime){
        this.$router.push({
          name: 'InsightInfo',
          params:{
            fromInsight: true,
            isTime: isTime,
            id: id,
            name: name,
            time: time
          }
        })
        this.$store.commit('setIntelFileTime', Date.now())
      }
    }
  }
</script>

<style scoped>
  .insight{
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
/* intelligent_orders and owned_folders*/
  .left_content{
    width: 800px;
    float: left;
  }
  .time_order,
  .intelligent_orders,
  .owned_folders{
    overflow: auto;
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 10px 0px;
  }
  .intelligent_orders{
  }
  .owned_folders{
    width: 400px;
    margin-left: 10px;
    float: left;
  }
  .time_order>.title,
  .intelligent_orders>.title,
  .owned_folders>.title{
    margin: 20px;
    font-size: 14px;
    height: 20px;
    color: cornflowerblue;
  }
  .time_order>.content>div,
  .intelligent_orders>.content>div,
  .owned_folders>.content>div{
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }
  .time_order>.content>div>svg,
  .intelligent_orders>.content>div>svg,
  .owned_folders>.content>div>svg{
    font-size: 60px;
  }

</style>
