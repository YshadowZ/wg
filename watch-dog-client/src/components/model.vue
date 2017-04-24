<template>
  <div class="model" v-on:click="close()" v-if="show">
    <div class="container" v-on:click.stop="">
      <header class="model-header">
        <slot name="header"></slot>
      </header>
      <main class="model-body">
        <slot></slot>
      </main>
      <footer class="model-footer">
        <slot name="footer"></slot>
      </footer>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['close', 'show']
  }
</script>
<style scoped>
  .model {
    position: absolute;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.4);
    top: 0px;
    left: 0px;
  }
  .container {
    width: 400px;
    position: relative;
    left: 50%;
    margin-left: -200px;
    background: white;
    padding: 20px;
    border-radius: 5px;
    margin-top: 100px;
  }
  .model-header {
    font-size: 16px;
    font-weight: bold;
    padding: 5px;
    text-align: left;
  }
  .model-body {
    padding: 5px;
  }
  .model-footer {
    padding: 5px;
    text-align: left;
  }
</style>
