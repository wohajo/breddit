<template>
  <div class="card">
    <div class="card-body">
      <h6 class="card-subtitle mb-2 text-muted">{{ comment.nickname }}</h6>
      <p class="card-text">
        {{ comment.content }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Comment",
  props: {
    comment: {
      id: Number,
      content: String,
      parent_comment_id: Number,
      post_id: Number,
      user_id: Number,
      nickname: String,
    },
  },
};
</script>

<style></style>
