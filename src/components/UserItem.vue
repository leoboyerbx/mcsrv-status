<template>
  <div class="user-item">
    <div class="avatar"><img :src="avatarUrl" alt="avatar" /></div>
    <div class="username">{{ username }}</div>
  </div>
</template>

<script>
export default {
  name: 'UserItem',
  props: {
    username: {
      type: String,
      required: true
    },
    avatar: {
      type: String,
      required: false
    }
  },
  computed: {
    avatarUrl () {
      return this.avatar || `https://minotar.net/helm/${this.username}.png`
    }
  }
}
</script>

<style scoped lang="scss">
@import '../scss/globals.scss';

.user-item {
  margin: 10px 0;
  padding: 10px;
  display: flex;
  align-items: center;
  background-color: $gray;
  border-radius: 8px;

  .avatar {
    position: relative;
    width: 50px;
    height: 50px;
    border-radius: 8px;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .username {
    font-weight: lighter;
    font-size: 1.2em;
    margin-left: 20px;
  }
}
</style>
