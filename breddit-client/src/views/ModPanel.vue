<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div class="ModPanel">
            <h1>Moderation panel</h1>
            <select
              class="form-select"
              id="subSelect"
              v-model="selected"
              @change="getSubredditMods"
            >
              <option selected value="-1">Subbreddit</option>
              <option
                v-for="subreddit in subredditList"
                :key="subreddit.subreddit_id"
                v-bind:value="subreddit.subreddit_id"
              >
                b/{{ subreddit.name }} ({{ subreddit.members_count }} members)
              </option>
            </select>
            <div>
              <h5 class="small-title">remove</h5>
              <div class="cards-wrapper">
                <div v-for="mod in modsList" :key="mod.id" class="card">
                  <div class="card-body">
                    {{ mod.nickname }}
                    <button
                      class="btn btn-danger btn-sm"
                      @click="removeMod(mod.id)"
                    >
                      <BIconXCircle /> Remove
                    </button>
                  </div>
                </div>
              </div>
              <h5 class="small-title">add</h5>
              <form @submit="getUsers">
                <div class="form-floating mb-3">
                  <input
                    type="text"
                    class="form-control"
                    id="nickameInput"
                    placeholder="Nickname"
                    v-model="nicknameInput"
                    required
                  />
                  <label for="nickameInput">Nickname</label>
                </div>
                <button type="submit" class="btn btn-outline-success">
                  Search
                </button>
              </form>
              <div class="cards-wrapper">
                <div
                  v-for="user in usersListFiltered"
                  :key="user.id"
                  class="card"
                >
                  <div class="card-body">
                    {{ user.nickname }}
                    <button
                      class="btn btn-success btn-sm"
                      @click="addMod(user.id, user.nickname)"
                    >
                      <BIconPlusCircle /> Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  addMod,
  getModeratedSubreddits,
  getSubModerators,
  removeMod,
} from "../api/subredditApi";
import Navbar from "../components/Navbar.vue";
import { BIconPlusCircle, BIconXCircle } from "bootstrap-icons-vue";
import axios from "axios";
import {
  getFromLocalStorage,
  getObjectFromLocalStorage,
} from "../utlis/storage-utils";

export default {
  name: "ModPanel",
  components: {
    Navbar,
    BIconPlusCircle,
    BIconXCircle,
  },
  data() {
    return {
      subredditList: [],
      modsList: [],
      usersList: [],
      nicknameInput: "",
      selected: -1,
    };
  },
  methods: {
    getModeratedSubreddits() {
      getModeratedSubreddits().then((res) => (this.subredditList = res.data));
    },
    getSubredditMods() {
      if (this.selected === -1) this.modsList = [];
      else
        getSubModerators(this.selected).then(
          (res) => (this.modsList = res.data)
        );
    },
    getUsers(event) {
      event.preventDefault();
      if (this.nicknameInput !== "")
        axios
          .get(
            `${process.env.VUE_APP_SERVER}/users/search/${this.nicknameInput}`
          )
          .then((res) => (this.usersList = res.data));
    },
    removeMod(id) {
      removeMod(this.selected, id, getFromLocalStorage("token"))
        .then(() => {
          if (id === getObjectFromLocalStorage("user").id) {
            this.subredditList = this.subredditList.filter(
              (sub) => sub.subreddit_id !== this.selected
            );
            this.selected = -1;
            this.modsList = [];
          } else this.modsList = this.modsList.filter((mod) => mod.id !== id);
        })
        .catch((err) => console.log(err.response));
    },
    addMod(id, nickname) {
      if (this.selected !== -1)
        addMod(this.selected, id, getFromLocalStorage("token"))
          .then(this.modsList.push({ id: id, nickname: nickname }))
          .catch((err) => console.log(err.response));
    },
  },
  mounted() {
    this.getModeratedSubreddits();
  },
  computed: {
    usersListFiltered() {
      return this.usersList.filter(
        ({ id: id1 }) => !this.modsList.some(({ id: id2 }) => id2 === id1)
      );
    },
  },
};
</script>

<style lang="scss">
.cards-wrapper {
  margin-top: 10px;
  margin-bottom: 10px;

  button {
    float: right;
  }
}

.small-title {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
