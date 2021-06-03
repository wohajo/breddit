const axios = require("axios");

export const getPost = (postId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/${postId}`);

export const getCommentsForPost = (postId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/${postId}/comments`);
