<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="home">
            <div v-if="this.checkIfLoggedIn()" class="d-grid gap-2">
              <button
                class="btn btn-outline-dark"
                type="button"
                @click="$router.push('/submit')"
              >
                <BIconPlusCircle />
                Add new post
              </button>
            </div>
            <Post
              v-for="post in posts"
              :key="post.id"
              :hasUserJoined="this.hasUserJoinedSubreddit(post.subreddit_id)"
              :post="post"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "@/components/Post";
import axios from "axios";
import { BIconPlusCircle } from "bootstrap-icons-vue";
import { axiosConfig, checkIfLoggedIn } from "../utlis/jwt-utils";
import Navbar from "../components/Navbar.vue";
import {
  getFromLocalStorage,
  getObjectFromLocalStorage,
} from "../utlis/storage-utils";

export default {
  name: "Home",
  data() {
    return {
      posts: new Array(),
      usersSubreddits: new Array(),
    };
  },
  components: {
    Post,
    BIconPlusCircle,
    Navbar,
  },
  methods: {
    async getPosts() {
      await axios
        .get(`${process.env.VUE_APP_SERVER}/posts`)
        .then((res) => (this.posts = res.data));
    },
    async getUsersSubreddits() {
      await axios
        .get(
          `${process.env.VUE_APP_SERVER}/subreddits/user/${
            getObjectFromLocalStorage("user").id
          }`,
          axiosConfig(getFromLocalStorage("token"))
        )
        .then((res) => (this.usersSubreddits = res.data));
    },
    checkIfLoggedIn() {
      return checkIfLoggedIn();
    },
    hasUserJoinedSubreddit(subreddit_id) {
      let hasJoined = false;
      this.usersSubreddits.forEach((sub) => {
        if (sub.id === subreddit_id) hasJoined = true;
      });
      return hasJoined;
    },
  },
  mounted() {
    this.getPosts();
    this.getUsersSubreddits();
  },
};
</script>

<style lang="scss">
.d-grid {
  margin-bottom: 1vh;
}
</style>
