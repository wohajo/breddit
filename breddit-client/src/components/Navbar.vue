<template>
  <nav class="navbar navbar-expand-lg sticky-top navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/">Breddit</router-link>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav me-auto">
          <li class="nav-item">
            <router-link class="nav-link active" aria-current="page" to="/"
              >Home</router-link
            >
          </li>
          <li v-if="!this.checkIfTokenExpired()" class="nav-item">
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/mycommunities"
              >My communities</router-link
            >
          </li>
          <li v-if="!this.checkIfTokenExpired()" class="nav-item">
            <router-link
              class="nav-link active"
              aria-current="page"
              to="/createSubreddit"
              >New subreddit</router-link
            >
          </li>
        </ul>
        <div class="d-flex">
          <button
            v-if="!searchInPosts"
            type="button"
            class="btn switch-btn btn-secondary btn-sm me-2"
            @click="switchSearch"
          >
            Subreddits
          </button>
          <button
            v-else
            type="button"
            class="btn switch-btn btn-secondary btn-sm me-2"
            @click="switchSearch"
          >
            Posts
          </button>
          <form v-if="searchInPosts" class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Find subreddits"
            />
            <button class="btn btn-outline-primary" type="submit">
              Search
            </button>
          </form>
          <form v-else class="d-flex">
            <input
              class="form-control me-2"
              type="search"
              placeholder="Find posts"
            />
            <button class="btn btn-outline-primary" type="submit">
              Search
            </button>
          </form>
        </div>
        <ul class="navbar-nav">
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              id="accountMenu"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {{ getUsername() }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="accountMenu">
              <li>
                <router-link
                  v-if="!this.checkIfTokenExpired()"
                  class="dropdown-item"
                  to="/modPanel"
                >
                  Moderation panel
                </router-link>
              </li>
              <li>
                <router-link
                  v-if="!this.checkIfTokenExpired()"
                  class="dropdown-item"
                  to="/profile"
                >
                  My profile
                </router-link>
              </li>
              <li>
                <button
                  v-if="!this.checkIfTokenExpired()"
                  class="dropdown-item"
                  @click="this.logOut()"
                >
                  Log out
                </button>
              </li>
              <li>
                <router-link
                  v-if="this.checkIfTokenExpired()"
                  class="dropdown-item"
                  to="/login"
                  >Log in</router-link
                >
              </li>
              <li>
                <router-link
                  v-if="this.checkIfTokenExpired()"
                  class="dropdown-item"
                  to="/register"
                  >Register</router-link
                >
              </li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import { checkIfTokenExpired, logOut } from "../utlis/jwt-utils";
import {
  getObjectFromLocalStorage,
  isInLocalStorage,
} from "../utlis/storage-utils";

export default {
  name: "Navbar",
  data() {
    return {
      searchInPosts: true,
    };
  },
  methods: {
    checkIfTokenExpired() {
      return checkIfTokenExpired();
    },
    getUsername() {
      if (!isInLocalStorage("user")) return "Account";
      else return getObjectFromLocalStorage("user").nickname;
    },
    logOut() {
      logOut();
      this.$forceUpdate();
      this.$router.push("/");
    },
    switchSearch() {
      this.searchInPosts = !this.searchInPosts;
    },
  },
};
</script>

<style lang="scss">
nav {
  margin-bottom: 5vh;
}
.switch-btn {
  border-radius: 16px;
  margin-right: 10px;
}

li.dropdown:last-child .dropdown-menu {
  right: 0;
  left: auto;
}
</style>
