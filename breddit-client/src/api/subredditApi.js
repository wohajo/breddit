const axios = require("axios");
import { axiosConfig } from "../utlis/jwt-utils";

export const joinSubreddit = (subredditId, token) =>
  axios.post(
    `${process.env.VUE_APP_SERVER}/subreddits/${subredditId}/join`,
    {},
    axiosConfig(token)
  );

export const leaveSubreddit = (subredditId, token) =>
  axios.post(
    `${process.env.VUE_APP_SERVER}/subreddits/${subredditId}/leave`,
    {},
    axiosConfig(token)
  );
