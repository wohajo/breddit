<template>
  <div class="about">
    <h1>Submit new post</h1>
    <form>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="subredditInput"
          placeholder="Subreddit"
          required
        />
        <label for="subredditInput">Subreddit</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="titleInput"
          placeholder="Title"
          required
        />
        <label for="titleInput">Title</label>
      </div>
      <div class="mb-3">
        <textarea
          class="form-control"
          id="contentInput"
          placeholder="Text (optional)"
          rows="3"
        ></textarea>
      </div>
      <label>Images or videos (Optional)</label>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="imageInput"
          placeholder="Image URL"
        />
        <label for="imageInput">Image URL</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="videoInput"
          placeholder="Video URL"
        />
        <label for="videoInput">Video URL</label>
      </div>
      <div class="mb-3">
        <button type="submit" class="btn btn-outline-success">Submit</button>
      </div>
    </form>
  </div>
</template>

<style scoped lang="scss">
form {
  button {
    float: right;
  }
}
</style>
