<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
import "@popperjs/core";
import "bootstrap";
export default {
  name: "App",
  components: {
    Navbar,
  },
  methods: {
    activateModal() {},
  },
};
</script>

<style lang="scss">
@use "@/styles/_variables.scss" as *;
@import "./node_modules/bootstrap/scss/bootstrap";
</style>
