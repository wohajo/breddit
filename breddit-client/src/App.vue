<template>
  <div>
    <Navbar />
    <div class="container">
      <div class="row justify-content-md-center">
        <div class="col-md-auto">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from "@/components/Navbar";
export default {
  name: "App",
  components: {
    Navbar,
  },
};
</script>

<style lang="scss"></style>
