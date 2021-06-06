<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div v-if="Object.keys(post).length !== 0" class="post-view">
            <Post
              key="post.id"
              :post="post"
              :usersSubreddits="usersSubreddits"
              @usersSubredditListChanged="onUsersSubredditListChanged"
            />
            <form
              v-if="this.checkIfLoggedIn()"
              @submit="this.handleSendComment"
            >
              <div class="mb-3">
                <textarea
                  class="form-control"
                  id="contentInput"
                  placeholder="Text (optional)"
                  rows="3"
                  v-model="commentInput"
                ></textarea>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-outline-success">
                  Submit
                </button>
              </div>
            </form>
            <Comment
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
            />
          </div>
          <h1 v-else style="text-align: center">Ooops! No post found!</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "../components/Post.vue";
import Comment from "../components/Comment.vue";
import Navbar from "../components/Navbar.vue";
import { getPost, getCommentsForPost, postCommentInPost } from "../api/postApi";
const { getUsersSubreddits } = require("../api/subredditApi");
import { checkIfLoggedIn } from "../utlis/jwt-utils";
import { getFromLocalStorage } from "../utlis/storage-utils";

export default {
  name: "PostView",
  components: {
    Post,
    Comment,
    Navbar,
  },
  data() {
    return {
      post: new Object(),
      comments: new Array(),
      commentInput: new String(),
      usersSubreddits: new Array(),
    };
  },
  async mounted() {
    await getPost(this.$route.params.postId).then(
      (res) => (this.post = res.data)
    );
    await getCommentsForPost(this.$route.params.postId).then(
      (res) => (this.comments = res.data)
    );
    if (checkIfLoggedIn()) this.getUsersSubreddits();
  },
  methods: {
    checkIfLoggedIn() {
      return checkIfLoggedIn();
    },
    getUsersSubreddits() {
      getUsersSubreddits()
        .then((res) => (this.usersSubreddits = res.data))
        .catch((err) => console.log(err));
    },
    onUsersSubredditListChanged() {
      this.getUsersSubreddits();
    },
    handleSendComment(event) {
      event.preventDefault();
      postCommentInPost(
        this.post.post_id,
        this.commentInput,
        getFromLocalStorage("token")
      )
        .then((res) => {
          this.comments.push(res.data);
          this.commentInput = "";
        })
        .catch((err) => console.log(err));
    },
  },
};
</script>

<style></style>
