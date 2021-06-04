const axios = require("axios");
import { axiosConfig } from "../utlis/jwt-utils";

export const getPost = (postId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/${postId}`);

export const getCommentsForPost = (postId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/${postId}/comments`);

export const postCommentInPost = (postId, comment, token) =>
  axios.post(
    `${process.env.VUE_APP_SERVER}/posts/${postId}/comments`,
    { content: comment },
    axiosConfig(token)
  );
