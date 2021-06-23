<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div class="search-posts">
            <h3>Post results for "{{ resText }}"</h3>
            <form class="d-flex" @submit="searchPosts">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Find subreddits"
                v-model="query"
              />
              <button class="btn btn-outline-primary" type="submit">
                Search
              </button>
              <button
                v-if="titleSearch"
                class="btn btn-primary"
                @click="switchTitleSearch"
              >
                title
              </button>
              <button v-else class="btn btn-warning" @click="switchTitleSearch">
                contents
              </button>
            </form>
            <Post
              v-for="post in posts"
              :post="post"
              :key="post.post_id"
              :usersSubreddits="usersSubreddits"
              :moderatedSubreddits="moderatedSubreddits"
              :socket="socket"
              @usersSubredditListChanged="onUsersSubredditListChanged"
              @deleted="onPostDeleted"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "@/components/Post";
import Navbar from "@/components/Navbar";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import {
  getModeratedSubreddits,
  getUsersSubreddits,
} from "../api/subredditApi";
import { searchPostsByContents, searchPostsByTitle } from "../api/postApi";

export default {
  name: "SearchPosts",
  data() {
    return {
      query: this.$route.params.query,
      resText: this.$route.params.query,
      posts: [],
      moderatedSubreddits: [],
      usersSubreddits: [],
      titleSearch: true,
    };
  },
  components: {
    Post,
    Navbar,
  },
  props: {
    socket: Object,
  },
  mounted() {
    this.searchPosts();
    if (checkIfLoggedIn()) {
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
    }
    this.socket.on("postDeleted", (id) => {
      this.removePostFromArray(id);
    });
  },
  unmounted() {
    this.socket.close();
  },
  methods: {
    switchTitleSearch() {
      this.titleSearch = !this.titleSearch;
    },
    removePostFromArray(id) {
      this.posts = this.posts.filter((post) => post.post_id !== id);
    },
    searchPosts() {
      if (this.query !== "" && this.query !== " ") {
        if (this.titleSearch) {
          searchPostsByTitle(this.query)
            .then((res) => {
              this.resText = this.query;
              this.posts = res.data;
            })
            .catch((err) => alert(err.response.data));
        } else {
          searchPostsByContents(this.query)
            .then((res) => {
              this.resText = this.query;
              this.posts = res.data;
            })
            .catch((err) => alert(err.response.data));
        }
      }
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
    onUsersSubredditListChanged() {
      this.getUsersSubreddits();
    },
    onPostDeleted(id) {
      this.removePostFromArray(id);
    },
  },
};
</script>

<style lang="scss">
.search-posts {
  form {
    margin-bottom: 10px;
    .btn-outline-primary {
      margin-right: 5px;
    }
  }
}
</style>
