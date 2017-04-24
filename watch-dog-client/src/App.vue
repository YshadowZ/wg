<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import actions from './actions'

export default {
  name: 'app',
  data() {
    return {
      me: {}
    }
  },
  created() {
    actions.getMe().then((res) => {
      this.me = res.data;
      window.me = res.data;
      this.$router.push('/hello')
    }).catch(e => {
      console.log('error--->', e)
      this.$router.push('/login')
    })
  }
};
</script>

<style>
* {
  margin: 0px;
  padding: 0px;
  box-sizing: border-box;
}
html, body {
  height: 100%;
}
.inline-block {
  display: inline-block;
}
.m-l-l{
  margin-left: 20px;
}
#app {
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.center {
  text-align: center;
}
</style>
