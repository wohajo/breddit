<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="register">
            <h1>Register an account</h1>
            <form>
              <div class="form-floating mb-3">
                <input
                  type="text"
                  class="form-control"
                  id="nickameInput"
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
import Navbar from "../components/Navbar.vue";
import { checkIfTokenExpired, logOut } from "../utlis/jwt-utils";

export default {
  name: "Register",
  components: { Navbar },
  mounted() {
    if (!checkIfTokenExpired()) this.$router.push("/");
    else logOut();
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
