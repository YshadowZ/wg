<template>
  <div class="login-window">
    <img src="../../static/logoMain.svg" alt="" class="logo">
    <div style="margin-top: 40px;" class="input-container">
      <img v-if="!email" class="email-icon" src="../../static/iconEnvelope.svg" alt="">
      <img v-if="email" class="email-icon" src="../../static/iconEnvelopeActive.svg" alt="">
      <input type="text" placeholder="请输入邮箱" v-model="email">
    </div>
    <div style="margin-top: 20px;" class="input-container">
      <img v-if="!nickname" class="name-icon" src="../../static/iconUser.svg" alt="">
      <img v-if="nickname" class="name-icon" src="../../static/iconUserActive.svg" alt="">
      <input type="text" placeholder="请输入姓名" v-model="nickname">
    </div>
    <div style="margin-top: 20px;" v-on:click="login" v-bind:class="{submit: true, disabled: !email || !nickname}" >提交</div>
  </div>
</template>
<script>
  import actions from '../actions'
  // import logo from '../../logoMain.svg'
  export default {
    name: 'login',
    data() {
      return {
        email: '',
        nickname: ''
      }
    },
    created() {
      console.log('in login')
    },
    methods: {
      login() {
        if (!this.email || !this.nickname) return;
        actions.login(this.email, this.nickname).then(res => {
          window.me = res.body;
          this.$router.push('/hello')
        }, err => {
          alert('请输入正确的邮箱');
          console.log('error---->', err)
        })
      }
    }
  }
</script>
<style scoped>
  .logo {
    width: 110px;
  }
  .login-window {
    width: 320px;
    height: 400px;
    position: relative;
    left: 50%;
    margin-left: -160px;
    margin-top: -200px;
    top: 50%;
  }
  .header {
    color: #bebebe;
    font-size: 18px;
  }
  .input-container {
    background-color: #f3f3f3;
    height: 48px;
    width: 100%;
    border-radius: 4px;
  }
  input {
    height: 48px;
    outline: none;
    border: none;
    font-size: 22px;
    outline-offset: 0px;
    background-color: transparent;
    padding: 0px;
  }
  .email-icon, .name-icon {
    position: relative;
    left: -18px;
    top: 3px;
  }
  ::-webkit-input-placeholder { /* WebKit, Blink, Edge */
    color: #bebebe;
    font-size: 18px;
  }
  .submit {
    width: 100%;
    height: 48px;
    line-height: 48px;
    border-radius: 4px;
    color: white;
    font-size: 16px;
    background-color: #1696EA;
  }
  .submit.disabled {
    background-color: #A1D5F6;
  }
</style>
