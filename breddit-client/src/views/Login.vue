<template>
  <div class="login">
    <h1>Log in</h1>
    <form @submit="login">
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
      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          id="passwordInput"
          placeholder="Password"
          v-model="passwordInput"
          required
        />
        <label for="passwordInput">Password</label>
      </div>
      <button type="submit" class="btn btn-outline-success">Log in</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
import {
  setObjectInLocalStorage,
  setInLocalStorage,
} from "../utlis/storage-utils";
import { checkIfTokenExpired } from "../utlis/jwt-utils";

export default {
  name: "Login",
  data() {
    return {
      nicknameInput: new String(),
      passwordInput: new String(),
    };
  },
  mounted() {
    if (!checkIfTokenExpired()) this.$router.push("/");
  },
  methods: {
    login(event) {
      event.preventDefault();
      axios
        .post(`${process.env.VUE_APP_SERVER}/auth/login`, {
          nickname: this.nicknameInput,
          password: this.passwordInput,
        })
        .then((res) => {
          setObjectInLocalStorage("user", res.data.user);
          setInLocalStorage("token", res.data.token);
          this.$router.push("/");
        })
        .catch((err) => console.log(err));
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
</style>
