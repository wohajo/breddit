<template>
  <div class="home">
    <Post v-for="post in posts" :key="post.id" :post="post" />
  </div>
</template>

<script>
import Post from "@/components/Post";
import axios from "axios";

export default {
  name: "Home",
  data() {
    return {
      posts: new Array(),
    };
  },
  components: {
    Post,
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
