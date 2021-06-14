<template>
  <div class="info-wrapper card text-white bg-dark">
    <div class="card-body">
      <div class="sub-info">
        <h3>{{ subInfo.name }}</h3>
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
      <div class="card text-white bg-dark">
        <div class="card-body">
          <div class="card-title">members: {{ memberCount }}</div>
          <p class="card-text">{{ subInfo.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { BIconPlusCircle, BIconCheck } from "bootstrap-icons-vue";
import { joinSubreddit, leaveSubreddit } from "../api/subredditApi";
import { getFromLocalStorage } from "../utlis/storage-utils";

export default {
  name: "SubInfo",
  components: {
    BIconCheck,
    BIconPlusCircle,
  },
  props: {
    subInfo: {
      id: Number,
      name: String,
      description: String,
      members_count: Number,
    },
    usersSubreddits: Array,
  },
  computed: {
    hasUserJoined() {
      return (
        this.usersSubreddits.find(({ id }) => id === this.subInfo.id) !==
        undefined
      );
    },
    memberCount() {
      return this.hasUserJoined
        ? Number(this.subInfo.members_count)
        : Number(this.subInfo.members_count) - 1;
    },
  },
  methods: {
    join() {
      joinSubreddit(this.subInfo.id, getFromLocalStorage("token"))
        .then(() => {
          this.$emit("usersSubredditListChanged");
        })
        .catch((err) => {
          console.log(err);
        });
    },
    leave() {
      leaveSubreddit(this.subInfo.id, getFromLocalStorage("token"))
        .then(() => {
          this.$emit("usersSubredditListChanged");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
