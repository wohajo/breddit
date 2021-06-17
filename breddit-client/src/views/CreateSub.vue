<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div class="submit">
            <h1>Create new subreddit</h1>
            <form @submit="onSubmit">
              <div class="form-floating mb-3">
                <input
                  v-model="name"
                  required
                  type="text"
                  class="form-control"
                  id="nameInput"
                  placeholder="name"
                />
                <label for="nameInput">Name</label>
              </div>
              <div class="mb-3">
                <textarea
                  v-model="description"
                  class="form-control"
                  id="descriptionInput"
                  placeholder="Description"
                  required
                  rows="3"
                ></textarea>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-outline-success">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { createSubreddit } from "../api/subredditApi";
import Navbar from "../components/Navbar.vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import { getFromLocalStorage } from "../utlis/storage-utils";
export default {
  components: { Navbar },
  name: "CreateSub",
  data() {
    return {
      name: "",
      description: "",
    };
  },
  mounted() {
    if (!checkIfLoggedIn()) this.$router.push("/");
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      if (checkIfLoggedIn())
        createSubreddit(
          this.name,
          this.description,
          getFromLocalStorage("token")
        )
          .then(() => this.$router.push(`/r/${this.name}`))
          .catch((err) => alert(err.data.message));
      else alert("You must log in in order to do this");
    },
  },
};
</script>

<style></style>
