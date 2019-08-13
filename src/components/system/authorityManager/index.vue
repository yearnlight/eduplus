<template>
  <vue-friendly-iframe
    v-loading="loading"
    element-loading-text="客官请稍等"
    @load="onLoad"
    src="http://localhost/eduplus_xys/#/authorityManager"
  ></vue-friendly-iframe>
</template>

<script>
import { setTimeout } from "timers";
export default {
  data() {
    return {
      loading: true
    };
  },
  methods: {
    onLoad() {
      setTimeout(() => {
        this.loading = false;
      }, 1000);
    }
  }
};
</script>
