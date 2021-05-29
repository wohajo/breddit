<template>
  <div class="login">
    <h1>Log in</h1>
    <form>
      <div class="form-floating mb-3">
        <input
          type="text"
          class="form-control"
          id="nickameInput"
          placeholder="Nickname"
          required
        />
        <label for="nickameInput">Nickname</label>
      </div>
      <div class="form-floating mb-3">
        <input
          type="password"
          class="form-control"
          id="passwordInput"
          placeholder="Password"
          required
        />
        <label for="passwordInput">Password</label>
      </div>
      <button type="submit" class="btn btn-outline-success">Log in</button>
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
