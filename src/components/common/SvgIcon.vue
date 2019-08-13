<template>
  <svg
    :class="svgClass"
    aria-hidden="true"
  >
    <use
      :xlink:href="iconName"
      rel="external nofollow"
    ></use>
  </svg>
</template>
<script>
export default {
  name: 'svg-icon',
  props: {
    iconClass: {
      type: String,
      required: true
    },
    className: {
      type: String
    }
  },
  computed: {
    iconName() {
      let icon = this.iconClass.replace('iconfont', '').replace(/\s+/g,"");
      return `#${icon}` // 注意：因为此处绑定的svgClass名已经包含#icon，所以复制symbol名字事不需要名字的前缀了
    },
    svgClass() {
      if (this.className) {
        return 'svg-icon ' + this.className
      } else {
        return 'svg-icon'
      }
    }
  }
}
</script>
<style scoped>
.svg-icon {
  width: 32px;
  height: 32px;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
