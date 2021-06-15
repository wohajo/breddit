<template>
  <div>
    <navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div class="profile">
            <h1>Your profile</h1>
            <form class="edit-form" @submit="changePasswordSubmit">
              <h4>Change password</h4>
              <span class="error"> {{ error }} </span>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Old password"
                  id="oldPassword"
                  v-model="oldPassword"
                />
                <label for="changePassword" class="form-label"
                  >Old password</label
                >
              </div>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  placeholder="New password"
                  id="newPassword"
                  v-model="newPassword"
                />
                <label for="changePassword" class="form-label"
                  >New password</label
                >
              </div>
              <div class="form-floating mb-3">
                <input
                  type="password"
                  class="form-control"
                  placeholder="Repeat new password"
                  id="repeatNewPassword"
                  v-model="repeatNewPassword"
                />
                <label for="changePassword" class="form-label"
                  >Repeat new password</label
                >
              </div>
              <button type="submit" class="btn btn-outline-success">
                Change
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
import Navbar from "../components/Navbar.vue";
import { getObjectFromLocalStorage } from "../utlis/storage-utils";
import { logOut } from "../utlis/jwt-utils";
export default {
  name: "Profile",
  components: {
    Navbar,
  },
  data() {
    return {
      oldPassword: "",
      newPassword: "",
      repeatNewPassword: "",
      error: "",
    };
  },
  methods: {
    changePasswordSubmit(event) {
      event.preventDefault();
      this.error = "";
      const nickname = getObjectFromLocalStorage("user").nickname;
      const userId = getObjectFromLocalStorage("user").id;
      if (this.newPassword === this.repeatNewPassword)
        axios
          .post(`${process.env.VUE_APP_SERVER}/users/changePassword`, {
            nickname: nickname,
            password: this.oldPassword,
            newPassword: this.newPassword,
            userId: userId,
          })
          .then(() => {
            alert(
              "Password changed! You will now be logged out for security purpouses."
            );
            logOut();
            this.$router.push("/");
          })
          .catch((err) => {
            if (err.response.status === 401) this.error = "Wrong old password";
            else this.error = "Something else went wrong";
          });
      else this.error = "Passwords do not match";
    },
  },
};
</script>

<style>
.edit-form {
  margin-top: 20px;
}
.error {
  margin-top: 10px;
  color: red;
  font-weight: bold;
}
</style>
