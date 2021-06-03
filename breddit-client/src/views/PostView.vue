<template>
  <div>
    <Navbar />
    <div class="container-sm">
      <div class="row justify-content-md-center">
        <div class="col-md-6">
          <div v-if="Object.keys(post).length !== 0" class="post-view">
            <Post key="post.id" :post="post" />
            <Comment
              v-for="comment in comments"
              :key="comment.id"
              :comment="comment"
            />
          </div>
          <h1 v-else style="text-align: center">Ooops! No post found!</h1>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Post from "../components/Post.vue";
import Comment from "../components/Comment.vue";
import Navbar from "../components/Navbar.vue";
import { getPost, getCommentsForPost } from "../api/postApi";

export default {
  name: "PostView",
  components: {
    Post,
    Comment,
    Navbar,
  },
  data() {
    return {
      post: new Object(),
      comments: new Array(),
    };
  },
  async mounted() {
    await getPost(this.$route.params.postId).then(
      (res) => (this.post = res.data)
    );
    await getCommentsForPost(this.$route.params.postId).then(
      (res) => (this.comments = res.data)
    );
  },
};
</script>

<style></style>
