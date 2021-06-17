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

export const getBestPosts = (pageNumber) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/best`, {
    params: {
      page: pageNumber,
    },
  });

export const getHotPosts = (pageNumber) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/hot`, {
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

export const getHotPostsFromSubreddit = (subName, pageNumber) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/subreddit/${subName}/best`, {
    params: {
      page: pageNumber,
    },
  });

export const getBestPostsFromSubreddit = (subName, pageNumber) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/subreddit/${subName}/hot`, {
    params: {
      page: pageNumber,
    },
  });

export const getPageCountForSubreddit = (subId) =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/subreddit/${subId}/pageCount`);

export const getPageCountForAll = () =>
  axios.get(`${process.env.VUE_APP_SERVER}/posts/pageCount`);

export const getPageCountForUserCommunities = (token) =>
  axios.get(
    `${process.env.VUE_APP_SERVER}/users/mycommunites/pageCount`,
    axiosConfig(token)
  );

export const getPostsForUserCommunities = (pageNumber, token) =>
  axios.get(`${process.env.VUE_APP_SERVER}/users/mycommunites/new`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: pageNumber,
    },
  });

export const getBestPostsForUserCommunities = (pageNumber, token) =>
  axios.get(`${process.env.VUE_APP_SERVER}/users/mycommunites/best`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: pageNumber,
    },
  });

export const getHotPostsForUserCommunities = (pageNumber, token) =>
  axios.get(`${process.env.VUE_APP_SERVER}/users/mycommunites/hot`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page: pageNumber,
    },
  });
