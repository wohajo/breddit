<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="submit">
            <h1>Submit new post</h1>
            <form @submit="onSubmit">
              <select
                class="form-select"
                id="subSelect"
                v-model="selected"
                required
              >
                <option selected value="-1">Subbreddit</option>
                <option
                  v-for="subreddit in subredditList"
                  :key="subreddit.id"
                  v-bind:value="subreddit.id"
                >
                  b/{{ subreddit.name }} ({{ subreddit.members_count }} members)
                </option>
              </select>
              <div class="form-floating mb-3">
                <input
                  v-model="title"
                  required
                  type="text"
                  class="form-control"
                  id="titleInput"
                  placeholder="Title"
                />
                <label for="titleInput">Title</label>
              </div>
              <div class="mb-3">
                <textarea
                  v-model="content"
                  class="form-control"
                  id="contentInput"
                  placeholder="Text (optional)"
                  rows="3"
                ></textarea>
              </div>
              <label>Images or videos (Optional)</label>
              <div class="mb-3">
                <input
                  @change="onFileChange"
                  class="form-control"
                  type="file"
                  accept=".jpg, .jpeg, .png"
                  id="formFile"
                />
              </div>
              <div class="form-floating mb-3">
                <input
                  v-model="videoUrl"
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
import axios from "axios";
import { axiosConfig, checkIfLoggedIn } from "../utlis/jwt-utils";
import { getUsersSubreddits } from "../api/subredditApi";
import { getFromLocalStorage } from "../utlis/storage-utils";

export default {
  name: "SubmitPost",
  components: {
    Navbar,
  },
  data() {
    return {
      subredditList: new Array(),
      selected: -1,
      title: new String(),
      content: new String(),
      videoUrl: new String(),
      file: "",
      error: new String(),
    };
  },
  mounted() {
    if (!checkIfLoggedIn()) this.$router.push("/");
    else this.getUsersSubreddits();
  },
  methods: {
    getUsersSubreddits() {
      getUsersSubreddits()
        .then((res) => (this.subredditList = res.data))
        .catch((err) => console.log(err));
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.selected === -1) this.error = "You must select a subreddit!";
      else {
        let form = new FormData();
        let config = axiosConfig(getFromLocalStorage("token"));
        config.headers["Content-Type"] = "multipart/form-data";

        form.append("subreddit_id", this.selected);
        form.append("title", this.title);

        if (this.content.length > 0) form.append("content", this.content);
        if (this.file !== "") form.append("image", this.file);
        if (this.videoUrl.length > 0) form.append("video_url", this.videoUrl);

        // TODO error handling
        axios
          .post(`${process.env.VUE_APP_SERVER}/posts`, form, config)
          .then((res) => this.$router.push(`/post/${res.data.id}`));
      }
    },
    onFileChange(event) {
      this.file = event.target.files[0];
      console.log(this.file);
    },
  },
};
</script>

<style scoped lang="scss">
form {
  button {
    float: right;
  }
}

.form-select {
  margin-bottom: 10px;
}

.members-count {
  font-size: smaller;
  color: grey;
}
</style>
