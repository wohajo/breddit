<template>
  <div class="card text-white bg-dark">
    <div class="card-header">{{ postHeader }}</div>
    <div class="card-body">
      <h5 class="card-title">{{ post.title }}</h5>
      <p class="card-text">
        {{ post.content }}
      </p>
      <p class="card-text">
        <small class="text-muted">{{ formattedDate }}</small>
      </p>
      <button type="button" class="btn btn-sm btn-outline-success">
        <BIconChevronUp />
      </button>
      {{ post.votes }}
      <button type="button" class="btn btn-sm btn-outline-danger">
        <BIconChevronDown />
      </button>
      <button
        type="button"
        class="btn btn-comments btn-sm btn-outline-secondary"
      >
        <BIconChatText />
      </button>
    </div>
    <img v-if="post.image_path !== null" v-bind:src="post.image_path" />
    <!-- <iframe
      v-if="post.video_url !== null"
      id="ytplayer"
      type="text/html"
      height="360"
      v-bind:src="this.post.video_url.replace('watch?v=', 'embed/')"
      frameborder="0"
    ></iframe> -->
  </div>
</template>

<script>
import {
  BIconChevronDown,
  BIconChevronUp,
  BIconChatText,
} from "bootstrap-icons-vue";

export default {
  name: "Post",
  props: {
    post: {
      post_id: Number,
      title: String,
      content: String,
      image_path: String,
      video_url: String,
      creation_date: Date,
      user_id: Number,
      user_nickname: String,
      subreddit_id: Number,
      subreddit_name: String,
      votes: Number,
    },
  },
  components: {
    BIconChevronUp,
    BIconChevronDown,
    BIconChatText,
  },
  data() {
    return {
      videoUrl: "",
    };
  },
  computed: {
    postHeader() {
      return `Posted by u/${this.post.user_nickname} in b/${this.post.subreddit_name}`;
    },
    formattedDate() {
      return new Date(this.post.creation_date).toLocaleString();
    },
  },
};
</script>

<style lang="scss">
.card {
  margin-bottom: 1vh;
}

.card-body {
  button {
    margin-left: 5px;
    margin-right: 5px;
  }
  .btn-comments {
    float: right;
  }
}
</style>
