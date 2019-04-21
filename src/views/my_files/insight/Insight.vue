<template>
  <div class="insight">
    <div class="bg"></div>
    <div class="intelligent_orders">
      <div class="title"><span>智能归档</span></div>
      <div class="content">
        <div v-for="(item, index) in allIntelFiles" :key="index" @click="showInsightInfo(item.id, item.name)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
    <div class="owned_folders">
      <div class="title"><span>自定义归档</span></div>
      <div class="content">
        <div v-for="(item, index) in allDefinedFiles" :key="index" @click="showInsightInfo(item.id, item.name)">
          <svg class="icon" aria-hidden="true"><use xlink:href="#icon-aFile"></use></svg>
          <p>{{item.name}}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from "vuex"
  import {toggleCollection, toggleAttention, clickItem, fetchList, getNowDay} from "../../../publics/public"
  export default {
    data() {
      return {
        nowChecked:[],
        allIntelFiles:[{name:'xxx'},{name:'ded'}],
        allDefinedFiles:[]
      }
    },
    mounted(){
      this.fetchIntelList()
      this.fetchDfnList()
    },
    methods:{
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
      showInsightInfo(id, name){
        this.$router.push({
          name: 'InsightInfo',
          params:{
            type: 0,
            id: id,
            name: name
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
  .intelligent_orders,
  .owned_folders{
    display: inline-block;
    height: 500px;
    overflow: auto;
    border: 1px solid lightgray;
    box-shadow: 0px 0px 4px 0px #b2b0b0;
    background-color: white;
    border-radius: 5px;
    margin: 10px 0px;
  }
  .intelligent_orders{
    width: 800px;
  }
  .owned_folders{
    width: 400px;
    margin-left: 10px;
  }
  .intelligent_orders>.title,
  .owned_folders>.title{
    margin: 20px;
    font-size: 14px;
    height: 20px;
    color: cornflowerblue;
  }
  .intelligent_orders>.content>div,
  .owned_folders>.content>div{
    display: inline-block;
    margin: 10px;
    width: 100px;
    height: 100px;
    text-align: center;
    cursor: pointer;
  }
  .intelligent_orders>.content>div>svg,
  .owned_folders>.content>div>svg{
    font-size: 60px;
  }

</style>
