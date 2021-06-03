<template>
  <nav class="navbar navbar-expand-sm sticky-top navbar-dark bg-dark">
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
        </ul>
        <form class="d-flex">
          <input
            class="form-control me-2"
            type="search"
            placeholder="Search"
            aria-label="Search"
          />
          <button class="btn btn-outline-primary" type="submit">Search</button>
        </form>
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
              {{ this.getUsername() }}
            </a>
            <ul class="dropdown-menu" aria-labelledby="accountMenu">
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
  },
};
</script>

<style lang="scss">
nav {
  margin-bottom: 5vh;
}
</style>
