<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div class="home">
            <div v-if="checkIfLoggedIn()" class="d-grid gap-2">
              <button
                class="btn btn-outline-dark"
                type="button"
                @click="$router.push('/submit')"
              >
                <BIconPlusCircle />
                Add new post
              </button>
            </div>
            <div class="btn-group" role="group">
              <button
                @click="handleBestClick"
                v-if="!bestActive"
                type="button"
                class="btn btn-dark"
              >
                Best
              </button>
              <button v-else type="button" class="btn btn-secondary">
                Best
              </button>
              <button
                @click="handleHotClick"
                v-if="!hotActive"
                type="button"
                class="btn btn-dark"
              >
                Hot
              </button>
              <button v-else type="button" class="btn btn-secondary">
                Hot
              </button>
              <button
                @click="handleNewClick"
                v-if="!newActive"
                type="button"
                class="btn btn-dark"
              >
                New
              </button>
              <button v-else type="button" class="btn btn-secondary">
                New
              </button>
            </div>
            <Post
              v-for="post in posts"
              :post="post"
              :key="post.post_id"
              :usersSubreddits="usersSubreddits"
              :moderatedSubreddits="moderatedSubreddits"
              @deleted="onPostDeleted"
              :socket="socket"
              @usersSubredditListChanged="onUsersSubredditListChanged"
            />
          </div>
          <Paginator
            :pageCount="pageCount"
            :currentPage="currentPage"
            @pageChanged="onPageChanged"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "@/components/Post";
import { BIconPlusCircle } from "bootstrap-icons-vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import Navbar from "../components/Navbar.vue";
import {
  getModeratedSubreddits,
  getUsersSubreddits,
} from "../api/subredditApi";
import Paginator from "../components/Paginator.vue";
import {
  getPageCountForUserCommunities,
  getHotPostsForUserCommunities,
  getPostsForUserCommunities,
  getBestPostsForUserCommunities,
} from "../api/postApi";
import { getFromLocalStorage } from "../utlis/storage-utils";
import io from "socket.io-client";

export default {
  name: "MyCommunities",
  data() {
    return {
      posts: [],
      usersSubreddits: [],
      moderatedSubreddits: [],
      pageCount: 0,
      newActive: true,
      hotActive: false,
      bestActive: false,
      currentPage: 1,
      socket: {},
    };
  },
  components: {
    Post,
    BIconPlusCircle,
    Navbar,
    Paginator,
  },
  created() {
    this.socket = io(`${process.env.VUE_APP_SERVER}`, {
      transports: ["websocket"],
    });
  },
  methods: {
    removePostFromArray(id) {
      this.posts = this.posts.filter((post) => post.post_id !== id);
    },
    async getPosts(pageNumber) {
      await getPostsForUserCommunities(pageNumber, getFromLocalStorage("token"))
        .then((res) => (this.posts = res.data))
        .catch((err) => alert(err.response.data));
    },
    async getBestPosts(pageNumber) {
      await getBestPostsForUserCommunities(
        pageNumber,
        getFromLocalStorage("token")
      )
        .then((res) => (this.posts = res.data))
        .catch((err) => alert(err.response.data));
    },
    async getHotPosts(pageNumber) {
      await getHotPostsForUserCommunities(
        pageNumber,
        getFromLocalStorage("token")
      )
        .then((res) => (this.posts = res.data))
        .catch((err) => alert(err.response.data));
    },
    onPostDeleted(id) {
      this.removePostFromArray(id);
    },
    checkIfLoggedIn() {
      return checkIfLoggedIn();
    },
    onUsersSubredditListChanged() {
      this.getPosts(1);
      getPageCountForUserCommunities(getFromLocalStorage("token"))
        .then((res) => (this.pageCount = Number(res.data.page_count)))
        .catch((err) => alert(err.response.data));
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
    },
    getUsersSubreddits() {
      getUsersSubreddits()
        .then((res) => (this.usersSubreddits = res.data))
        .catch((err) => alert(err.response.data));
    },
    getModeratedSubreddits() {
      getModeratedSubreddits()
        .then((res) => (this.moderatedSubreddits = res.data))
        .catch((err) => alert(err.response.data));
    },
    onPageChanged(number) {
      this.currentPage = this.currentPage + number;

      if (this.newActive)
        this.getPosts(this.currentPage)
          .then((res) => (this.pageCount = Number(res.data.page_count)))
          .catch((err) => alert(err.response.data));
      if (this.bestActive)
        this.getBestPosts(this.currentPage)
          .then((res) => (this.pageCount = Number(res.data.page_count)))
          .catch((err) => alert(err.response.data));
      if (this.hotActive)
        this.getHotPosts(this.currentPage)
          .then((res) => (this.pageCount = Number(res.data.page_count)))
          .catch((err) => alert(err.response.data));
      getPageCountForUserCommunities(getFromLocalStorage("token"));
    },
    handleNewClick() {
      this.bestActive = false;
      this.hotActive = false;
      this.newActive = true;
      this.currentPage = 1;
      this.getPosts(this.currentPage);
    },
    handleBestClick() {
      this.bestActive = true;
      this.hotActive = false;
      this.newActive = false;
      this.currentPage = 1;
      this.getBestPosts(this.currentPage);
    },
    handleHotClick() {
      this.bestActive = false;
      this.hotActive = true;
      this.newActive = false;
      this.currentPage = 1;
      this.getHotPosts(this.currentPage);
    },
  },
  mounted() {
    if (checkIfLoggedIn()) {
      this.getPosts(1);
      getPageCountForUserCommunities(getFromLocalStorage("token"))
        .then((res) => (this.pageCount = Number(res.data.page_count)))
        .catch((err) => alert(err.response.data));
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
      this.socket.on("postDeleted", (id) => {
        this.removePostFromArray(id);
      });
    } else this.$router.push("/");
  },
};
</script>

<style lang="scss">
.d-grid {
  margin-bottom: 1vh;
}

.btn-group {
  display: flex;
  justify-content: space-between;
  margin-bottom: 2vh;
}
</style>
