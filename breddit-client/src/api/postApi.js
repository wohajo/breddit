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

export const getPosts = (pageNumber) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts`, {
    params: {
      page: pageNumber,
    },
  });

export const getPostsFromSubreddit = (subName, pageNumber) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/subreddit/${subName}`, {
    params: {
      page: pageNumber,
    },
  });

export const getPageCountForSubreddit = (subId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/subreddit/${subId}/pageCount`);

export const getPageCountForAll = () =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/pageCount`);
