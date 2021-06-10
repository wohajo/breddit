<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <!-- TODO AND if in sub -->
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
          <Post
            v-for="post in posts"
            :key="post.post_id"
            :post="post"
            :usersSubreddits="usersSubreddits"
            @usersSubredditListChanged="onUsersSubredditListChanged"
          />
          <Paginator :pageCount="10" @pageChanged="onPageChanged" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getSubreddit, getUsersSubreddits } from "../api/subredditApi";
import { getPostsFromSubreddit } from "../api/postApi";
import Navbar from "../components/Navbar.vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import Post from "../components/Post.vue";
import Paginator from "../components/Paginator.vue";
import { BIconPlusCircle } from "bootstrap-icons-vue";

export default {
  components: { Navbar, Post, Paginator, BIconPlusCircle },
  name: "SubView",
  data() {
    return {
      subId: -1,
      posts: [],
      subDesc: "",
      usersSubreddits: [],
      isFound: true,
    };
  },
  mounted() {
    getSubreddit(this.$route.params.subredditName)
      .then((res) => {
        this.subId = res.data.id;
        this.getPostsFromSubreddit(res.data.id, 1);
      })
      .catch((err) => console.log(err));
    this.getUsersSubreddits();
  },
  methods: {
    async getPostsFromSubreddit(subId, page) {
      await getPostsFromSubreddit(subId, page).then(
        (res) => (this.posts = res.data)
      );
    },
    getUsersSubreddits() {
      getUsersSubreddits()
        .then((res) => (this.usersSubreddits = res.data))
        .catch((err) => console.log(err));
    },
    checkIfLoggedIn() {
      return checkIfLoggedIn();
    },
    onUsersSubredditListChanged() {
      this.getUsersSubreddits();
    },
    onPageChanged(number) {
      this.getPostsFromSubreddit(this.subId, number);
    },
  },
};
</script>

<style></style>
