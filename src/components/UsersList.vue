<template>
  <div class="users-list">
    <UserItem v-for="user in usersList" :key="user.id" :username="user.name" :avatar="'https://crafatar.com/avatars/' + user.id" />
    <p v-if="!usersList.length">Aucun joueur connecté</p>
  </div>
</template>

<script>
import UserItem from './UserItem.vue'

export default {
  name: 'UsersList',
  components: {
    UserItem
  },
  props: {
    usersList: {
      type: Array,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
//@import '../scss/globals.scss';

</style>
