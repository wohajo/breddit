<template>
  <div class="card text-white bg-dark">
    <div class="card-header">
      Posted by u/{{ this.post.user_nickname }} in
      <span @click="this.$router.push(`/b/${this.post.subreddit_name}`)"
        >b/{{ this.post.subreddit_name }}</span
      >
      <button
        v-if="!hasUserJoined"
        @click="join"
        type="button"
        class="btn btn-secondary btn-sm"
      >
        <BIconPlusCircle /> Join
      </button>
      <button v-else type="button" class="btn btn-dark btn-sm" @click="leave">
        <BIconCheck /> Joined
      </button>
    </div>
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
        @click="this.$router.push(`/post/${post.post_id}`)"
      >
        <BIconChatText />
      </button>
    </div>
    <img v-if="post.image_path !== null" v-bind:src="post.image_path" />
    <iframe
      v-if="post.video_url !== null"
      id="ytplayer"
      type="text/html"
      width="100%"
      height="360"
      v-bind:src="this.post.video_url.replace('watch?v=', 'embed/')"
      frameborder="0"
    ></iframe>
  </div>
</template>

<script>
import {
  BIconChevronDown,
  BIconChevronUp,
  BIconChatText,
  BIconPlusCircle,
  BIconCheck,
} from "bootstrap-icons-vue";
import { joinSubreddit, leaveSubreddit } from "../api/subredditApi";
import { getFromLocalStorage } from "../utlis/storage-utils";

export default {
  name: "Post",
  props: {
    post: {
      // TODO change post_id to id and user_nickname to nickname
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
    usersSubreddits: Array,
  },
  components: {
    BIconChevronUp,
    BIconChevronDown,
    BIconChatText,
    BIconPlusCircle,
    BIconCheck,
  },
  data() {
    return {
      videoUrl: "",
    };
  },
  computed: {
    formattedDate() {
      return new Date(this.post.creation_date).toLocaleString();
    },
    hasUserJoined() {
      return (
        this.usersSubreddits.find(({ id }) => id === this.post.subreddit_id) !==
        undefined
      );
    },
  },
  methods: {
    join() {
      joinSubreddit(this.post.subreddit_id, getFromLocalStorage("token"))
        .then((res) => {
          this.$emit("usersSubredditListChanged");
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    leave() {
      leaveSubreddit(this.post.subreddit_id, getFromLocalStorage("token"))
        .then((res) => {
          this.$emit("usersSubredditListChanged");
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
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

.card-header {
  button {
    float: right;
    border-radius: 16px;
  }
  span:hover {
    cursor: pointer;
  }
}
</style>
