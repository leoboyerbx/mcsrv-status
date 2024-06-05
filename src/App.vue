<template>
  <div id="app" class="container" v-if='serverData.players'>
    <div class="main-title">
      <h1>Ingenium status</h1>
      <p>{{ serverData.motd }}</p>
    </div>
    <div class="row">
      <div class="col-md">
        <Status
          :online="true"
          :onlinePlayers="serverData.online_players"
          :maxPlayers="serverData.max_players" />
      </div>
      <div class="col-md">
        <Card class="players">
          <h2>Joueurs en ligne</h2>
          <UsersList :usersList="serverData.players" />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import Status from './components/Status.vue'
import Card from './components/Card.vue'
import UsersList from './components/UsersList.vue'
import { computed, ref } from 'vue'
import query from './api/query'
const serverData = ref({})
const isUpdating = ref(false)

const updateServerData = async () => {
  isUpdating.value = true
  serverData.value = await query()
  isUpdating.value = false
  console.log(serverData)
}
updateServerData()

setInterval(() => {
  updateServerData()
}, 1000)
</script>

<style lang="scss">
@import 'bootstrap/scss/bootstrap-grid';
@import "scss/breakpoints.scss";
@import url("https://use.typekit.net/qxr4owc.css");
@import 'scss/globals.scss';

body {
  margin: 0;
  padding: 0;
  height: 100%;
  display: flex;
  justify-content: center;
}
#app {
  position: fixed;
  width: 100%;
  max-width: 860px;
  color: $theme;
}
.main-title {
  font-family: 'Europa Light', sans-serif;
  text-align: center;
  margin-bottom: 30px;
}
.col {
  padding: 0 10px;
}
.players, .status {
  margin-top: 20px;
}
h2 {
  margin-bottom: 20px !important;
}
</style>
