<template>
    <div class="modify_documents">
      <h1 inline="text">Hello.v.2</h1>
      <div style="width:1000px;height:700px;" id="modify_outer"></div>
    </div>
</template>

<script>

  export default {
    name: "ModifyDocuments",
    mounted(){
      var body = this.$router.query.body
      var modifyOuter = document.getElementById("modify_outer")
      modifyOuter.innerHTML = body
    },
    methods:{
      Save() {
        document.getElementById("PageOfficeCtrl1").WebSave();
      },
      AddSeal() {
        try{
          document.getElementById("PageOfficeCtrl1").ZoomSeal.AddSeal();
        }catch (e){ };
      }
    }
  }
</script>

<style scoped>

</style>
