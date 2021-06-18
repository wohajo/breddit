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
import io from "socket.io-client";
import {
  getPageCountForAll,
  getPosts,
  getBestPosts,
  getHotPosts,
} from "../api/postApi";

export default {
  name: "Home",
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
      await getPosts(pageNumber).then((res) => (this.posts = res.data));
    },
    async getBestPosts(pageNumber) {
      await getBestPosts(pageNumber).then((res) => (this.posts = res.data));
    },
    async getHotPosts(pageNumber) {
      await getHotPosts(pageNumber).then((res) => (this.posts = res.data));
    },
    onPostDeleted(id) {
      this.removePostFromArray(id);
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
    getModeratedSubreddits() {
      getModeratedSubreddits()
        .then((res) => (this.moderatedSubreddits = res.data))
        .catch((err) => console.log(err));
    },
    onPageChanged(number) {
      this.currentPage = this.currentPage + number;

      if (this.newActive)
        this.getPosts(this.currentPage).then(
          (res) => (this.pageCount = res.data.page_count)
        );

      if (this.bestActive)
        this.getBestPosts(this.currentPage).then(
          (res) => (this.pageCount = res.data.page_count)
        );

      if (this.hotActive)
        this.getHotPosts(this.currentPage).then(
          (res) => (this.pageCount = res.data.page_count)
        );

      getPageCountForAll();
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
    this.getPosts(1);
    getPageCountForAll().then(
      (res) => (this.pageCount = Number(res.data.page_count))
    );
    if (checkIfLoggedIn()) {
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
    }
    this.socket.on("postDeleted", (id) => {
      this.removePostFromArray(id);
    });
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
