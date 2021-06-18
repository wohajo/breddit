<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div v-if="Object.keys(post).length !== 0" class="post-view">
            <Post
              key="post.post_id"
              :post="post"
              :usersSubreddits="usersSubreddits"
              :moderatedSubreddits="moderatedSubreddits"
              @deleted="onPostDeleted"
              :socket="socket"
              @usersSubredditListChanged="onUsersSubredditListChanged"
            />
            <form v-if="checkIfLoggedIn()" @submit="handleSendComment">
              <div class="mb-3">
                <textarea
                  class="form-control"
                  id="contentInput"
                  placeholder="Comment here"
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
              :subreddit_id="post.subreddit_id"
              :moderatedSubreddits="moderatedSubreddits"
              @deleted="onCommentDeleted"
              :socket="socket"
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
const {
  getUsersSubreddits,
  getModeratedSubreddits,
} = require("../api/subredditApi");
import io from "socket.io-client";
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
      usersSubreddits: [],
      moderatedSubreddits: [],
      socket: {},
    };
  },
  created() {
    this.socket = io(`${process.env.VUE_APP_SERVER}`, {
      transports: ["websocket"],
    });
  },
  mounted() {
    getPost(this.$route.params.postId).then((res) => (this.post = res.data));
    getCommentsForPost(this.$route.params.postId).then(
      (res) => (this.comments = res.data)
    );
    if (checkIfLoggedIn()) {
      this.getUsersSubreddits();
      this.getModeratedSubreddits();
    }
    this.socket.emit("join", this.$route.params.postId);

    this.socket.on("postDeleted", () => {
      this.onPostDeleted();
    });
    this.socket.on("commentDeleted", (id) => this.deleteCommentFromArray(id));
    this.socket.on("commentAdded", (comment) => {
      if (!this.comments.some((c) => c.id === comment.id))
        this.comments.push(comment);
    });
  },
  unmounted() {
    this.socket.disconnect();
  },
  methods: {
    onPostDeleted() {
      alert("Post was deleted");
      this.$router.push("/");
    },
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
          this.socket.emit("addComment", this.post.post_id, res.data);
        })
        .catch((err) => console.log(err.response.data));
    },
    getModeratedSubreddits() {
      getModeratedSubreddits()
        .then((res) => (this.moderatedSubreddits = res.data))
        .catch((err) => console.log(err));
    },
    onCommentDeleted(id) {
      this.deleteCommentFromArray(id);
    },
    deleteCommentFromArray(id) {
      this.comments = this.comments.filter((comment) => comment.id !== id);
    },
  },
};
</script>

<style></style>
