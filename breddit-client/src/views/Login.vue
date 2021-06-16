<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
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
              <button type="submit" class="btn btn-outline-success">
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  setObjectInLocalStorage,
  setInLocalStorage,
} from "../utlis/storage-utils";
import { checkIfTokenExpired, logOut } from "../utlis/jwt-utils";
import Navbar from "../components/Navbar.vue";

export default {
  components: { Navbar },
  name: "Login",
  data() {
    return {
      nicknameInput: new String(),
      passwordInput: new String(),
    };
  },
  mounted() {
    if (!checkIfTokenExpired()) this.$router.push("/");
    else logOut();
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
        .catch((err) => {
          if (err.response.status === 401) alert("Wrong credentials");
          else alert("Something went wrong");
        });
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
