<template>
  <div class="card">
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style lang="scss">
@import "../scss/globals.scss";

.card{
    // width: 100%;
    font-family: 'Montserrat', sans-serif;
    padding: 20px 30px;
    box-shadow: 0px 0px 15px #00000049;
    border-radius: 10px;
    h2 {
        text-align: center;
        font-size: 1.4em;
        margin: 0;
        font-weight: bold;
    }
}
</style>
