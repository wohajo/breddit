<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-9">
          <div class="register">
            <h1>Register an account</h1>
            <form @submit="onSubmit">
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="nickameInput"
                  v-model="username"
                  placeholder="Nickname"
                  required
                />
                <label for="nickameInput">Nickname</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  id="passwordInput"
                  v-model="password"
                  placeholder="Password"
                  required
                />
                <label for="passwordInput">Password</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  id="passwordConfirmInput"
                  v-model="repeatPassword"
                  placeholder="Confirm password"
                  required
                />
                <label for="passwordConfirmInput">Confirm password</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control"
                  id="emailInput"
                  v-model="email"
                  placeholder="Email"
                  required
                />
                <label for="emailInput">Email</label>
              </div>
              <div class="form-floating mb-3">
                <input
                  type="email"
                  class="form-control"
                  id="emailConfirmInput"
                  v-model="repeatEmail"
                  placeholder="Confirm email"
                  required
                />
                <label for="emailConfirmInput">Confirm email</label>
              </div>
              <div class="mb-3">
                <button type="submit" class="btn btn-outline-success">
                  Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Navbar from "../components/Navbar.vue";
import { checkIfTokenExpired, logOut } from "../utlis/jwt-utils";

export default {
  name: "Register",
  components: { Navbar },
  data() {
    return {
      username: "",
      password: "",
      repeatPassword: "",
      email: "",
      repeatEmail: "",
    };
  },
  mounted() {
    if (!checkIfTokenExpired()) this.$router.push("/");
    else logOut();
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      if (
        this.email === this.repeatEmail &&
        this.password === this.repeatPassword
      )
        axios
          .post(`${process.env.VUE_APP_SERVER}/auth/register`, {
            username: this.username,
            password: this.password,
            email: this.email,
          })
          .then(() => {
            alert("Registered sucessfully!");
            this.$router.push("/login");
          })
          .catch((err) => alert(err.response.data));
      else alert("Passwords or emails do not match!");
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
