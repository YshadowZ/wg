<template>
  <div class="room-list">
    <div class="logo-container">
      <img src="../../static/logoSmall.svg" alt="" class="logo">
    </div>
    <div class="info-container">
      <img src="../../static/avatar.svg" alt="" class="avatar">
      <div class="user-info">
        <span class="nickname">{{me.nickname}}</span>
        <span class="email">{{me.email}}</span>
      </div>
    </div>
    <div v-for="room in rooms" v-on:click="selectRoom(room)">
      <div class="room"
        v-bind:style="{'border-left': selectedRoom._id === room._id ? '8px solid #1696EA': ''}">
        <span class="room-name" v-bind:style="{'font-size': '16px', color: selectedRoom._id === room._id ? '#1696EA' : '#888888' }">{{room.name}}</span>
        <div>
          <div class="room-status" v-bind:style="{backgroundColor: room.used ? '#6EB805' : '#DADADA' }"></div>
          <span v-bind:style="{ color: room.used ? '#6EB805' : '#DADADA', 'font-size': '12px' }">{{ room.used ? '有人' : '空闲' }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {

      }
    },
    methods: {

    },
    created() {
      console.log(window.me)
    },
    props: ['rooms', 'selectRoom', 'me', 'selectedRoom']
  }
</script>

<style scoped>
  .avatar {
    width: 48px;
    margin-left: 40px;
  }
  .room {
    width: 100%;
    height: 48px;
    display: flex;
    align-items: center;
    padding-left: 40px;
    padding-right: 40px;
    justify-content: space-between;
    cursor: pointer;
    position: relative;
  }
  .user-info {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-left: 10px;
  }
  .user-info span {
    text-align: left;
    width: 100%;
  }
  .user-info .email {
    color: #888888;
    font-size: 16px;
  }
  .user-info .nickname {
    font-size: 18px;
    color: #3b3b3b;
  }
  .logo-container {
    height: 80px;
    width: 320px;
    display: flex;
    align-items: center;
    border-bottom: solid 1px #f3f3f3;
  }
  .logo {
    margin-left: 40px;
  }
  .info-container {
    height: 80px;
    width: 320px;
    display: flex;
  }
  .room-status {
    height: 10px;
    width: 10px;
    display: inline-block;
    border-radius: 10px;
  }
  .room-list{
    width: 320px;
    background-color: #FAFBFC;
    height: 100%;
    border-right: 1px solid #C5C5C5;
  }
  .search-container {
    height: 48px;
    width: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .room-name {
    font-size: 16px;
    color: #888888;
    font-weight: bold;
  }
  .room:hover {
    color: #1696EA;
    border-left: 8px solid #1696EA;
  }
  .room:hover .room-name{
    color: #1696EA !important;
  }
  .search-container input {
    width: 240px;
    height: 48px;
    font-size: 22px;
    border: none;
    outline: none;
    background-color: #f3f3f3;
    border-radius: 4px;
  }
</style>
