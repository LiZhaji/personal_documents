<template>
  <div class="main">
    <Siderbar ></Siderbar>
    <div class="main_right">
      <Headerbar></Headerbar>
      <div class="content" >
        <keep-alive>
          <router-view/>
        </keep-alive>
      </div>
    </div>
    <Popup></Popup>
  </div>
</template>

<script>
  import Siderbar from '../components/Sidebar'
  import Headerbar from '../components/Headerbar'
  import Popup from '../components/Popup'
  export default {
    name: 'staff',
    components:{
      Siderbar: Siderbar,
      Headerbar: Headerbar,
      Popup: Popup
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  .main_right {
    margin-left: 240px;
  }
  headerbar{
    z-index: 100;
  }
  Popup{
    position: relative;
  }

</style>
