<template>
  <div>
    <router-view />
  </div>
</template>

<script>
import "@popperjs/core";
import "bootstrap";
export default {
  name: "App",
  methods: {
    activateModal() {},
  },
};
</script>

<style lang="scss">
@use "@/styles/_variables.scss" as *;
@import "./node_modules/bootstrap/scss/bootstrap";
</style>
