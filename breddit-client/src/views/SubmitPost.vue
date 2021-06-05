<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="submit">
            <h1>Submit new post</h1>
            <form>
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="subredditInput"
                  placeholder="Subreddit"
                  required
                />
                <label for="subredditInput">Subreddit</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="titleInput"
                  placeholder="Title"
                  required
                />
                <label for="titleInput">Title</label>
              </div>
              <div class="mb-3">
                <textarea
                  class="form-control"
                  id="contentInput"
                  placeholder="Text (optional)"
                  rows="3"
                ></textarea>
              </div>
              <label>Images or videos (Optional)</label>
              <div class="mb-3">
                <input
                  class="form-control"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  id="formFile"
                />
              </div>
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="videoInput"
                  placeholder="Video URL"
                />
                <label for="videoInput">Video URL</label>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-outline-success">
                  Submit
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
import Navbar from "../components/Navbar.vue";
import { checkIfLoggedIn } from "../utlis/jwt-utils";
export default {
  name: "SubmitPost",
  components: {
    Navbar,
  },
  mounted() {
    if (!checkIfLoggedIn()) this.$router.push("/");
  },
};
</script>

<style scoped lang="scss">
form {
  button {
    float: right;
  }
}
</style>
