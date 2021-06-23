<template>
  <div>
    <router-view :socket="socket" />
  </div>
</template>

<script>
import "@popperjs/core";
import "bootstrap";
import io from "socket.io-client";

export default {
  name: "App",
  methods: {
    activateModal() {},
  },
  data() {
    return {
      socket: {},
    };
  },
  created() {
    this.socket = io(`${process.env.VUE_APP_SERVER}`, {
      transports: ["websocket"],
    });
  },
};
</script>

<style lang="scss">
@use "@/styles/_variables.scss" as *;
@import "./node_modules/bootstrap/scss/bootstrap";
</style>
