<template>
  <div class="noservice">
    <img :src="url" /> 无权限访问当前页面
  </div>
</template>
<script>
export default {
  data(){
    return{
      url:require("../../assets/nochild.png")
    }
  }
}
</script>

<style lang="scss">
.noservice {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 26px;
  color:#999;
}
</style>
