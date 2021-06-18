<template>
  <div class="card text-white bg-dark">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">{{ comment.nickname }}</h6>
      <p class="card-text">
        {{ comment.content }}
      </p>
      <button
        v-if="isModeratorOfThisSub"
        type="button"
        class="btn btn-delete btn-danger btn-sm"
        @click="deleteComment"
      >
        <BIconXCircle /> delete
      </button>
    </div>
  </div>
</template>

<script>
import { BIconXCircle } from "bootstrap-icons-vue";
import { getFromLocalStorage } from "../utlis/storage-utils";
import axios from "axios";

export default {
  name: "Comment",
  components: {
    BIconXCircle,
  },
  props: {
    comment: {
      id: Number,
      content: String,
      parent_comment_id: Number,
      post_id: Number,
      user_id: Number,
      nickname: String,
    },
    subreddit_id: Number,
    moderatedSubreddits: Array,
    socket: Object,
  },
  computed: {
    isModeratorOfThisSub() {
      return this.moderatedSubreddits.some(
        (sub) => sub.subreddit_id === this.subreddit_id
      );
    },
  },
  methods: {
    deleteComment() {
      axios
        .delete(
          `${process.env.VUE_APP_SERVER}/posts/${this.comment.post_id}/comments/${this.comment.id}`,
          {
            headers: {
              Authorization: `Bearer ${getFromLocalStorage("token")}`,
            },
            params: { subId: this.subreddit_id },
          }
        )
        .then(() => {
          this.socket.emit(
            "deleteComment",
            this.comment.post_id,
            this.comment.id
          );
          alert("removed sucessfully");
        })
        .catch((err) => console.log(err.response.data));
      this.$emit("deleted", this.comment.id);
    },
  },
};
</script>

<style></style>
