import { createRouter, createWebHashHistory } from "vue-router";
import Home from "../views/Home.vue";
import SubmitPost from "../views/SubmitPost.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import PostView from "../views/PostView.vue";
import SubView from "../views/SubView.vue";
import CreateSub from "../views/CreateSub.vue";
import Profile from "../views/Profile.vue";
import ModPanel from "../views/ModPanel.vue";
import MyCommunities from "../views/MyCommunities.vue";
import SearchPosts from "../views/SearchPosts";
import SearchSubreddits from "../views/SearchSubreddits";

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/mycommunities",
    name: "MyCommunities",
    component: MyCommunities,
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
  {
    path: "/post/:postId",
    name: "Post",
    component: PostView,
  },
  {
    path: "/r/:subredditName",
    name: "Subreddit",
    component: SubView,
  },
  {
    path: "/createSubreddit",
    name: "createSubreddit",
    component: CreateSub,
  },
  {
    path: "/profile",
    name: "Profile",
    component: Profile,
  },
  {
    path: "/modPanel",
    name: "modPanel",
    component: ModPanel,
  },
  {
    path: "/posts/search/:query",
    name: "SearchPosts",
    component: SearchPosts,
  },
  {
    path: "/subreddits/search/:query",
    name: "SearchSubreddits",
    component: SearchSubreddits,
  },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

export default router;
