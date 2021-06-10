const axios = require("axios");
import { axiosConfig } from "../utlis/jwt-utils";
import {
  getFromLocalStorage,
  getObjectFromLocalStorage,
} from "../utlis/storage-utils";

export const joinSubreddit = (subredditId, token) =>
  axios.post(
    `${process.env.VUE_APP_SERVER}/subreddits/${subredditId}/join`,
    {},
    axiosConfig(token)
  );

export const leaveSubreddit = (subredditId, token) =>
  axios.delete(
    `${process.env.VUE_APP_SERVER}/subreddits/${subredditId}/leave`,
    axiosConfig(token)
  );

export const getUsersSubreddits = () =>
  axios.get(
    `${process.env.VUE_APP_SERVER}/subreddits/user/${
      getObjectFromLocalStorage("user").id
    }`,
    axiosConfig(getFromLocalStorage("token"))
  );

export const getSubreddit = (subName) =>
  axios.get(`${process.env.VUE_APP_SERVER}/subreddits/${subName}`);
