<template>
  <div class="videos">
    <FileOperation></FileOperation>
  </div>
</template>

<script>
  import FileOperation from "../../../components/FileOperation"
  import { toggleCollection,toggleLike,clickItem } from "../../../publics/public"
  export default {
    data() {
      return {}
    },
    components:{
      FileOperation: FileOperation
    },
    methods:{

    }
  }
</script>

<style scoped>
  .videos{
    overflow: hidden;
    position: relative;
    padding-left: 50px;
  }
</style>
