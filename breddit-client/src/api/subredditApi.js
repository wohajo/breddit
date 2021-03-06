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

export const createSubreddit = (name, description, token) =>
  axios.post(
    `${process.env.VUE_APP_SERVER}/subreddits`,
    { name: name, description: description },
    axiosConfig(token)
  );

export const getModeratedSubreddits = () =>
  axios.get(
    `${process.env.VUE_APP_SERVER}/users/moderated`,
    axiosConfig(getFromLocalStorage("token"))
  );

export const getSubModerators = (subId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/subreddits/${subId}/moderators`);

export const removeMod = (subId, userId, token) =>
  axios.delete(
    `${process.env.VUE_APP_SERVER}/subreddits/${subId}/moderators/remove/${userId}`,
    axiosConfig(token)
  );

export const addMod = (subId, userId, token) =>
  axios.post(
    `${process.env.VUE_APP_SERVER}/subreddits/${subId}/moderators/add/${userId}`,
    {},
    axiosConfig(token)
  );

export const searchSubreddits = (query) =>
  axios.get(`${process.env.VUE_APP_SERVER}/subreddits/search/${query}`);
