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
          <div class="card-title">members: {{ subInfo.members_count }}</div>
          <textarea
            v-if="isEditButtonClicked"
            id="editInput"
            v-model="editDesc"
            class="form-control"
            @blur="saveEdited"
            v-on:keyup.enter="saveEdited"
          />
          <p v-else class="card-text">{{ subInfo.description }}</p>
        </div>
      </div>
      <button
        v-if="hasUserJoined && isModeratorOfThisSub"
        type="button"
        class="btn btn-primary btn-sm"
        @click="edit"
      >
        <BIconPencilSquare /> Edit
      </button>
    </div>
  </div>
</template>

<script>
import {
  BIconPlusCircle,
  BIconCheck,
  BIconPencilSquare,
} from "bootstrap-icons-vue";
import { joinSubreddit, leaveSubreddit } from "../api/subredditApi";
import { getFromLocalStorage } from "../utlis/storage-utils";
import { axiosConfig } from "../utlis/jwt-utils";
import axios from "axios";

export default {
  name: "SubInfo",
  components: {
    BIconCheck,
    BIconPlusCircle,
    BIconPencilSquare,
  },
  props: {
    subInfo: {
      id: Number,
      name: String,
      description: String,
      members_count: Number,
    },
    usersSubreddits: Array,
    moderatedSubreddits: Array,
  },
  data() {
    return {
      editDesc: "",
      isEditButtonClicked: false,
    };
  },
  computed: {
    hasUserJoined() {
      return (
        this.usersSubreddits.find(({ id }) => id === this.subInfo.id) !==
        undefined
      );
    },
    isModeratorOfThisSub() {
      return this.moderatedSubreddits.some(
        (sub) => sub.subreddit_id === this.subInfo.id
      );
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
    edit() {
      this.isEditButtonClicked = !this.isEditButtonClicked;
      this.editDesc = this.subInfo.description;
      setTimeout(() => {
        document.getElementById("editInput").focus();
      }, 1);
    },
    saveEdited() {
      if (this.editDesc !== this.subInfo.description)
        axios
          .put(
            `${process.env.VUE_APP_SERVER}/subreddits/${this.subInfo.id}`,
            { description: this.editDesc },
            axiosConfig(getFromLocalStorage("token"))
          )
          .then(() => this.$emit("descEdited"))
          .catch((err) => console.log(err));
      this.isEditButtonClicked = !this.isEditButtonClicked;
    },
  },
};
</script>

<style lang="scss">
.card-body {
  button {
    float: right;
  }
}
</style>
