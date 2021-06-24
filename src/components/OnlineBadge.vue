<template>
  <span class="online-badge" :class="{ online: online, offline: !online }">
    <div>
      <span class="dot"></span>
      <span v-if="online" class="text">En ligne</span>
      <span v-else class="text">Hors ligne</span>
    </div>
  </span>
</template>

<script>
export default {
  name: 'OnlineBadge',
  props: {
    online: {
      type: Boolean,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
@import '../scss/globals.scss';

.online-badge {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
  background-color: $gray;
  border-radius: 40px;
  padding: 10px;

  div {
    display: flex;
    align-items: center;
  }

  .dot {
    display: inline-block;
    width: 16px;
    height: 16px;
    border-radius: 15px;
    margin-right: 10px;
    transition: all .3s;
  }

  .text {
    display: inline-block;
    font-size: 16px;
    margin-right: 5px;
  }
  &.online {
    color: $success;
    .dot {background-color: $success;}
  }
  &.offline {
    color: $danger;
    .dot {background-color: $danger;}
  }
}
</style>
