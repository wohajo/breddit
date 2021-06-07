<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="home">
            <div v-if="checkIfLoggedIn" class="d-grid gap-2">
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
              :post="post"
              :usersSubreddits="usersSubreddits"
              @usersSubredditListChanged="onUsersSubredditListChanged"
            />
          </div>
          <Paginator :pageCount="100" @pageChanged="onPageChanged" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "@/components/Post";
import axios from "axios";
import { BIconPlusCircle } from "bootstrap-icons-vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import Navbar from "../components/Navbar.vue";
import { getUsersSubreddits } from "../api/subredditApi";
import Paginator from "../components/Paginator.vue";

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
    Paginator,
  },
  methods: {
    async getPosts(pageNumber) {
      await axios
        .get(`${process.env.VUE_APP_SERVER}/posts`, {
          params: {
            page: pageNumber,
          },
        })
        .then((res) => (this.posts = res.data));
    },
    checkIfLoggedIn() {
      return checkIfLoggedIn();
    },
    onUsersSubredditListChanged() {
      this.getUsersSubreddits();
    },
    getUsersSubreddits() {
      getUsersSubreddits()
        .then((res) => (this.usersSubreddits = res.data))
        .catch((err) => console.log(err));
    },
    onPageChanged(number) {
      this.getPosts(number);
    },
  },
  mounted() {
    this.getPosts(1);
    if (checkIfLoggedIn()) this.getUsersSubreddits();
  },
};
</script>

<style lang="scss">
.d-grid {
  margin-bottom: 1vh;
}
</style>
