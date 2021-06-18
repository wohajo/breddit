<template>
  <div class="card text-white bg-dark">
    <div class="card-header">
      Posted by u/{{ this.post.user_nickname }} in
      <span @click="this.$router.push(`/r/${this.post.subreddit_name}`)"
        >r/{{ this.post.subreddit_name }}</span
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
        <BIconCheck /> Leave
      </button>
    </div>
    <div class="card-body">
      <h5
        class="card-title"
        @click="this.$router.push(`/post/${this.post.post_id}`)"
      >
        {{ post.title }}
      </h5>
      <p class="card-text">
        {{ post.content }}
      </p>
      <p class="card-text">
        <small class="text-muted">{{ formattedDate }}</small>
      </p>
      <button
        v-if="hasUserVotedUp"
        type="button"
        class="btn btn-sm btn-success"
        @click="deleteVote"
      >
        <BIconChevronUp />
      </button>
      <button
        v-else
        type="button"
        @click="voteUp"
        class="btn btn-sm btn-outline-success"
      >
        <BIconChevronUp />
      </button>
      {{ votesCount }}
      <button
        v-if="hasUserVotedDown"
        type="button"
        class="btn btn-sm btn-danger"
        @click="deleteVote"
      >
        <BIconChevronDown />
      </button>
      <button
        v-else
        type="button"
        @click="voteDown"
        class="btn btn-sm btn-outline-danger"
      >
        <BIconChevronDown />
      </button>
      <button
        type="button"
        class="btn btn-comments btn-sm btn-outline-secondary"
        @click="this.$router.push(`/post/${post.post_id}`)"
      >
        <BIconChatText /> {{ post.comment_count }}
      </button>
      <button
        v-if="isModeratorOfThisSub && hasUserJoined"
        type="button"
        class="btn btn-delete btn-danger btn-sm"
        @click="deletePost"
      >
        <BIconXCircle /> delete
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
// TODO restric not logged user from vote/joining
import {
  BIconChevronDown,
  BIconChevronUp,
  BIconChatText,
  BIconPlusCircle,
  BIconCheck,
  BIconXCircle,
} from "bootstrap-icons-vue";
import { joinSubreddit, leaveSubreddit } from "../api/subredditApi";
import {
  getFromLocalStorage,
  getObjectFromLocalStorage,
  isInLocalStorage,
} from "../utlis/storage-utils";
import axios from "axios";
import { axiosConfig } from "../utlis/jwt-utils";

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
      comment_count: Number,
    },
    usersSubreddits: Array,
    moderatedSubreddits: Array,
    socket: Object,
  },
  components: {
    BIconChevronUp,
    BIconChevronDown,
    BIconChatText,
    BIconPlusCircle,
    BIconCheck,
    BIconXCircle,
  },
  data() {
    return {
      votesDownloaded: [],
      votesCount: 0,
    };
  },
  mounted() {
    this.getVotes();
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
    isModeratorOfThisSub() {
      return this.moderatedSubreddits.some(
        (sub) => sub.subreddit_id === this.post.subreddit_id
      );
    },
    hasUserVotedUp() {
      if (!isInLocalStorage("user")) return false;
      return this.votesDownloaded.some(
        (vote) =>
          vote.user_id === getObjectFromLocalStorage("user").id &&
          vote.vote === 1
      );
    },
    hasUserVotedDown() {
      if (!isInLocalStorage("user")) return false;
      return this.votesDownloaded.some(
        (vote) =>
          vote.user_id === getObjectFromLocalStorage("user").id &&
          vote.vote === -1
      );
    },
  },
  methods: {
    getVotes() {
      axios
        .get(`${process.env.VUE_APP_SERVER}/posts/${this.post.post_id}/votes`)
        .then((res) => {
          this.votesDownloaded = res.data;
          this.votesCount = this.votesDownloaded.reduce(
            (acc, curr) => (acc = acc + curr.vote),
            0
          );
        })
        .catch((err) => alert(err.response.data));
    },
    voteUp() {
      axios
        .post(
          `${process.env.VUE_APP_SERVER}/posts/${this.post.post_id}/votes/up`,
          {},
          axiosConfig(getFromLocalStorage("token"))
        )
        .then(() => {
          this.getVotes();
        })
        .catch((err) => alert(err.response.data));
    },
    voteDown() {
      axios
        .post(
          `${process.env.VUE_APP_SERVER}/posts/${this.post.post_id}/votes/down`,
          {},
          axiosConfig(getFromLocalStorage("token"))
        )
        .then(() => {
          this.getVotes();
        })
        .catch((err) => alert(err.response.data));
    },
    deleteVote() {
      axios
        .delete(
          `${process.env.VUE_APP_SERVER}/posts/${this.post.post_id}/votes`,
          axiosConfig(getFromLocalStorage("token"))
        )
        .then(() => {
          this.getVotes();
        })
        .catch((err) => alert(err.response.data));
    },
    join() {
      joinSubreddit(this.post.subreddit_id, getFromLocalStorage("token"))
        .then(() => {
          this.$emit("usersSubredditListChanged");
        })
        .catch((err) => {
          alert(err.response.data);
        });
    },
    leave() {
      leaveSubreddit(this.post.subreddit_id, getFromLocalStorage("token"))
        .then(() => {
          this.$emit("usersSubredditListChanged");
        })
        .catch((err) => {
          alert(err.response.data);
        });
    },
    deletePost() {
      axios
        .delete(`${process.env.VUE_APP_SERVER}/posts/${this.post.post_id}`, {
          headers: {
            Authorization: `Bearer ${getFromLocalStorage("token")}`,
          },
          params: { subId: this.post.subreddit_id },
        })
        .then(() => {
          alert("removed sucessfully");
          this.$emit("deleted", this.post.post_id);
          this.socket.emit("deletePost", this.post.post_id);
        })
        .catch((err) => alert(err.response.data));
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
  .card-title {
    cursor: pointer;
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

.btn-delete {
  float: right;
}
</style>
