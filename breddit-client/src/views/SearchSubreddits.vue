<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div class="search-subreddits">
            <h3>Subreddit results for "{{ resText }}"</h3>
            <form class="d-flex" @submit="searchSubreddits">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Find subreddits"
                v-model="query"
              />
              <button class="btn btn-outline-primary" type="submit">
                Search
              </button>
            </form>
            <SubInfo
              v-for="sub in subreddits"
              :subInfo="sub"
              :key="sub.id"
              :moderatedSubreddits="moderatedSubreddits"
              :usersSubreddits="usersSubreddits"
              @usersSubredditListChanged="onUsersSubredditListChanged"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getModeratedSubreddits,
  getUsersSubreddits,
  searchSubreddits,
} from "../api/subredditApi";
import SubInfo from "../components/SubInfo.vue";
import Navbar from "../components/Navbar.vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";

export default {
  components: { SubInfo, Navbar },
  name: "SearchSubreddits",
  data() {
    return {
      query: this.$route.params.query,
      resText: this.$route.params.query,
      subreddits: [],
      moderatedSubreddits: [],
      usersSubreddits: [],
    };
  },
  mounted() {
    this.searchSubreddits();
    if (checkIfLoggedIn()) {
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
    }
  },
  methods: {
    onUsersSubredditListChanged() {
      this.getUsersSubreddits();
      this.searchSubreddits(this.query);
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
    searchSubreddits() {
      if (this.query !== "" && this.query !== " ")
        searchSubreddits(this.query)
          .then((res) => {
            this.resText = this.query;
            this.subreddits = res.data;
          })
          .catch((err) => alert(err.response.data));
    },
    onDescEdited() {
      this.searchSubreddits();
    },
  },
};
</script>

<style lang="scss">
.search-subreddits {
  .card {
    margin-bottom: 10px;
  }

  form {
    margin-bottom: 10px;
  }
}
</style>
