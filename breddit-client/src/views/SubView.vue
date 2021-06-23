<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <SubInfo
            :subInfo="subInfo"
            :usersSubreddits="usersSubreddits"
            :moderatedSubreddits="moderatedSubreddits"
            @usersSubredditListChanged="onUsersSubredditListChanged"
            @descEdited="onDescEdited"
          />
          <div v-if="checkIfLoggedIn() && hasUserJoined()" class="d-grid gap-2">
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
            :key="post.post_id"
            :post="post"
            :usersSubreddits="usersSubreddits"
            :moderatedSubreddits="moderatedSubreddits"
            @deleted="onPostDeleted"
            @usersSubredditListChanged="onUsersSubredditListChanged"
            :socket="socket"
          />
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
import {
  getModeratedSubreddits,
  getSubreddit,
  getUsersSubreddits,
} from "../api/subredditApi";
import {
  getPostsFromSubreddit,
  getPageCountForSubreddit,
} from "../api/postApi";
import Navbar from "../components/Navbar.vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import Post from "../components/Post.vue";
import Paginator from "../components/Paginator.vue";
import SubInfo from "../components/SubInfo.vue";
import { BIconPlusCircle } from "bootstrap-icons-vue";

export default {
  components: { Navbar, Post, Paginator, BIconPlusCircle, SubInfo },
  name: "SubView",
  data() {
    return {
      subInfo: {},
      posts: [],
      subDesc: "",
      usersSubreddits: [],
      moderatedSubreddits: [],
      isFound: true,
      pageCount: 0,
      currentPage: 1,
    };
  },
  props: {
    socket: Object,
  },
  mounted() {
    this.getSubreddit(this.$route.params.subredditName);
    if (checkIfLoggedIn()) {
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
    }
    this.socket.on("postDeleted", (id) => {
      this.removePostFromArray(id);
    });
  },
  methods: {
    removePostFromArray(id) {
      this.posts = this.posts.filter((post) => post.post_id !== id);
    },
    getSubreddit(subName) {
      getSubreddit(subName)
        .then((res) => {
          this.subInfo = res.data;
          this.getPostsFromSubreddit(res.data.id, 1);
          getPageCountForSubreddit(res.data.id).then(
            (res) => (this.pageCount = Number(res.data.page_count))
          );
        })
        .catch((err) => alert(err.response.data));
    },
    getPostsFromSubreddit(subId, page) {
      getPostsFromSubreddit(subId, page)
        .then((res) => (this.posts = res.data))
        .catch((err) => alert(err.response.data));
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
    checkIfLoggedIn() {
      return checkIfLoggedIn();
    },
    onUsersSubredditListChanged() {
      this.getUsersSubreddits();
      this.getSubreddit(this.$route.params.subredditName);
    },
    hasUserJoined() {
      return (
        this.usersSubreddits.find(({ id }) => id === this.subInfo.id) !==
        undefined
      );
    },
    onPostDeleted(id) {
      this.removePostFromArray(id);
    },
    onPageChanged(number) {
      this.currentPage = this.currentPage + number;
      this.getPostsFromSubreddit(this.subInfo.id, this.currentPage);
      getPageCountForSubreddit(this.subInfo.id)
        .then((res) => (this.pageCount = Number(res.data.page_count)))
        .catch((err) => alert(err.response.data));
    },
    onDescEdited() {
      this.getSubreddit(this.$route.params.subredditName);
    },
  },
};
</script>

<style lang="scss">
.sub-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1vh;
}

.info-wrapper {
  margin-bottom: 7vh;
}
</style>
