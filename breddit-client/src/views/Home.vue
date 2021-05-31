<template>
  <div class="home">
    <div class="d-grid gap-2">
      <button
        class="btn btn-outline-dark"
        type="button"
        @click="$router.push('/submit')"
      >
        <BIconPlusCircle />
        Add new post
      </button>
    </div>
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import Post from "@/components/Post";
import axios from "axios";
import { BIconPlusCircle } from "bootstrap-icons-vue";

export default {
  name: "Home",
  data() {
    return {
      posts: new Array(),
    };
  },
  components: {
    Post,
    BIconPlusCircle,
  },
  methods: {
    async getPosts() {
      await axios
        .get(`${process.env.VUE_APP_SERVER}/posts`)
        .then((res) => (this.posts = res.data));
    },
  },
  mounted() {
    this.getPosts();
  },
};
</script>

<style lang="scss">
.d-grid {
  margin-bottom: 1vh;
}
</style>
