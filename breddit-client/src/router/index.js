import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import SubmitPost from "../views/SubmitPost.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/submit",
    name: "Submit",
    component: SubmitPost,
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
];

// TODO https://router.vuejs.org/guide/essentials/history-mode.html#example-server-configurations

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
