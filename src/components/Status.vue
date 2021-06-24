<template>
    <Card class="status">
    <h2>Statut</h2>
    <p class="dispo">
        Disponibilité: <OnlineBadge :online="online" />
    </p>
    <p class="players">
        Joueurs: <span class="value">{{ onlinePlayers }}/{{ maxPlayers }}</span>
    </p>
    <div class="progressbar">
      <div :style="{ width: barWidth }"></div>
    </div>
  </Card>
</template>

<script>
import Card from './Card.vue'
import OnlineBadge from './OnlineBadge.vue'

export default {
  name: 'Status',
  components: {
    Card,
    OnlineBadge
  },
  props: {
    online: {
      type: Boolean,
      required: true
    },
    onlinePlayers: {
      required: true
    },
    maxPlayers: {
      required: true
    }

  },
  computed: {
    barWidth () {
      return ((this.onlinePlayers / this.maxPlayers) * 100) + '%'
    }
  }
}
</script>

<style scoped lang="scss">
@import '../scss/globals.scss';

p {
    font-weight: bold;
}
.value {
    font-weight: lighter;
}
.progressbar {
  position: relative;
  width: 100%;
  border-radius: 8px;
  height: 8px;
  background-color: $gray;
  overflow: hidden;
  div {
    position: absolute;
    border-radius: 8px;
    background-color: $theme;
    width: 0;
    height: 100%;
    transition: all .3s;
  }
}
</style>
