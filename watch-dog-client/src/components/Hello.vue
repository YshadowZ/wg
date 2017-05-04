<template>
  <div class="hello">
    <RoomList v-bind:rooms="rooms" v-bind:selectRoom="getAllRoomStatus" v-bind:me="me" v-bind:selectedRoom="selectedRoom"></RoomList>
    <div class="detail">
      <div class="header">
        <div class="room-name">{{this.selectedRoom.name}}</div>
        <div class="info inline-block">
          <img src="../../static/iconUser.svg" alt="">
          <span>容纳人数: {{selectedRoom.capacity}}人</span>
        </div>
        <div class="info inline-block m-l-l">
          <img src="../../static/iconLocation.svg" alt="">
          <span>位置: {{selectedRoom.position}}</span>
        </div>
        <div class="info">
          <img src="../../static/iconComputer.svg" alt="">
          <span>设备:
            <span class="device" v-for="device in selectedRoom.devices">
              {{device}}
              <img src="../../static/iconCheck.svg" alt="">
            </span>
          </span>
        </div>
      </div>
      <div class="calender">
        <div class="header">
          <div class="date">2017年4月</div>
          <div class="scroll">
            <div style="margin-right: 0px;">< 上一周</div>
            <div>下一周 ></div>
          </div>
        </div>
        <div class="content">
          <div class="time-block">
            <div style="border-bottom: 3px solid #f3f3f3; height: 26px;"></div>
            <div class="clock" v-for="time in times">{{time}}</div>
          </div>
          <div class="weekday" v-for="(week, outerIndex) in roomStatus">
            <div class="weekday-header">{{week.date}}</div>
            <div class="time-single-block" v-for="(block, innerIndex) in week.blocks" v-bind:style="{'background-color': block.used ? '#60BDF1' : 'white'}">
              <div class="create"
                v-on:mouseover="checkCreate(block, $event)"
                v-on:mouseleave="cancelCreate(block, $event)"
                v-on:click="showCreateRoom(block, week, innerIndex, outerIndex)"
              >
                <div v-if="(!block.used) && (hoverdBlock.startTime === block.startTime)" style="color: #a2a2a2; display: flex;"><img src="../../static/iconAddGrey.svg" alt="" />预定</div>
                <div v-if="block.used">
                  <div style="color: #1696EA">{{block.user}}</div>
                  <div style="color: #1696EA" v-if="block.user">{{changeTime(block.startTime)}}</div>
                  <div style="color: #1696EA" v-if="block.user">{{block.desc}}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <model v-bind:show="showCreateModal" v-bind:close="cancelCreateModal">
      <div slot="header">预定会议室</div>
      <div>
        <div>
          <input type="text" placeholder="会议室用途" v-model="selectedRoomBlock.type">
        </div>
        <div>
          开始时间
          <select v-model="startTime">
            <option v-bind:value="block.startTime" v-for="block in avalibleTimeBlocks">{{changeTime(block.startTime)}}</option>
          </select>
          结束时间
          <select v-model="endTime">
            <option v-bind:value="block.startTime" v-for="block in avalibleTimeBlocks">{{changeTime(block.startTime)}}</option>
          </select>
        </div>
        <div>
          <input type="text" placeholder="使用人姓名" v-model="selectedRoomBlock.user">
        </div>
        <div>
          <input type="text" placeholder="备注" v-model="selectedRoomBlock.desc">
        </div>
      </div>
      <div slot="footer">
        <button v-on:click="createRoom">提交</button>
      </div>
    </model>
  </div>
</template>

<script>
import actions from '../actions'
import RoomList from './RoomList'
import times from '../../config/timeConfig'
import Model from './model'
import moment from 'moment'
import 'moment/locale/zh-cn'

export default {
  components: {
    RoomList,
    Model
  },
  name: 'hello',
  data() {
    return {
      rooms: [],
      times: times,
      roomStatus: [],
      selectedRoom: {
        position: '东北角',
        capacity: 10,
        devices: ['电视', '黑板']
      },
      showCreateModal: false,
      selectedRoomBlock: { user: '' },
      avalibleTimeBlocks: [],
      startTime: 0,
      endTime: 0,
      me: {},
      baseline: 0,
      hoverdBlock: {}
    };
  },
  methods: {
    getAllRoomStatus(room) {
      this.selectedRoom = room;
      const roomId = room._id;
      actions.getRoomOrders(roomId).then(res => {
        res.data = res.data.splice(0, 7)
        res.data = res.data.map((week) => {
          return {
            date: moment(week[0].startTime).format('dddd'),
            blocks: week
          }
        })
        this.roomStatus = res.data

      }).catch(e => {
        console.log(e)
      })
    },
    selectRoom(room) {
      this.selectedRoom = room;
    },
    checkCreate(week, e) {
      this.hoverdBlock = week;
      // if (!week.used) {
      //   e.target.style.opacity = 1
      // }
    },
    changeTime: function(time) {
      return moment(time).format('LT');
    },
    cancelCreate(week, e) {
      this.hoverdBlock = {}
      // if (!week.used) {
      //   e.target.style.opacity = 0;
      // }
    },
    cancelCreateModal() {
      this.showCreateModal = false;
    },
    showCreateRoom(block, week, innerIndex, outerIndex) {
      if (block.used) {
        console.log(block)
        if (block.user && block.desc && confirm('确定删除此条记录吗')) {
          actions.deleteRoomStatus(block.startTime).then(res => {
            this.getAllRoomStatus(this.selectedRoom)
          }, e => {
            console.log(e)
          })
        }
        return;
      }
      this.baseline = week.blocks[0].startTime;
      this.selectedRoomBlock = block;
      this.showCreateModal = true;
      this.selectedRoomBlock.user = this.me.nickname
      this.avalibleTimeBlocks = this.findAvilibleTime(block, week, innerIndex, outerIndex)
      console.log(this.avalibleTimeBlocks);
    },
    createRoom() {
      if (this.endTime <= this.startTime) {
        alert('结束时间不能小于开始时间')
        return;
      }
      const during = (this.endTime - this.startTime);
      const body = {
        user: this.selectedRoomBlock.user,
        room: this.selectedRoom._id,
        desc: this.selectedRoomBlock.desc,
        during: during,
        startTime: this.startTime,
        order: localStorage.getItem('userid'),
        baseline: this.baseline
      }
      console.log(this.startTime, this.endTime)
      actions.createOrder(body).then(res => {
        this.startTime = 0;
        this.endTime = 0;
        this.avalibleTimeBlocks = [];
        this.showCreateModal = false;
        this.getAllRoomStatus(this.selectedRoom)
      }, err => {
        console.log(err)
      })
    },
    findAvilibleTime(block, week, low, outerIndex) {
      let high = low;
      for (; week.blocks[low]; --low) {
        if (!week.blocks[low] || week.blocks[low].used) {
          break
        }
      }
      for (; week.blocks[high]; ++high) {
        if (!week.blocks[high] || week.blocks[high].used) {
          break
        }
      }
      return week.blocks.slice(low + 1, high + 1)
    }
  },
  created() {
    actions.getMe().then((res) => {
      this.me = res.data;
    });
    actions.getRooms().then(res => {
      res.body = res.body.map(room => {
        room.used = false;
        return room;
      })
      this.rooms = res.body
      this.selectedRoom = this.rooms[0];
      this.getAllRoomStatus(this.selectedRoom)
      socket.on('hello', (data) => {
        this.rooms[0].used = true;
        const room = this.rooms.find(room => room._id === data.roomId);
        if (room) {
          room.used = data.state
          this.$forceUpdate()
        }
      });
    }).catch(e => {
      console.error(e)
    });

  },
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 140px;
  text-align: left;
}
.info {
  // display: flex;
}
.info .device {
  bottom: 0px;
  margin-right: 14px;
}
.info span {
  color: #A2A2A2;
  font-size: 16px;
  position: relative;
  bottom: 4px;
  font-weight: bold;
}
.info span img {
  bottom: -4px;
  position: relative;
}
.room-name {
  font-size: 32px;
  font-weight: bold;
  color: #3b3b3b;
  margin-bottom: 10px;
}
.hello {
  display: flex;
  width: 100%;
  height: 100%;
}
.detail {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #F5F6F7;
  padding-top: 60px;
  padding-left: 30px;
  padding-right: 30px;
  padding-bottom: 30px;

}
.calender {
  width: 100%;
  background-color: white;
  border-radius: 4px;
  flex: 1;
  overflow: auto;
}
.calender .header {
  display: flex;
  height: 55px;
  justify-content: space-between
}

.header .date {
  color: #6a6a6a;
  font-size: 18px;
  margin-top: 15px;
  margin-left: 20px;
  font-weight: bold;
}

.header .scroll {
  display: flex;
  justify-content: space-between;
}

.scroll div {
  background-color: #f3f3f3;
  color: #888888;
  font-weight: bold;
  font-size: 14px;
  width: 96px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px 15px;
  border-radius: 4px;
  cursor: pointer;
}
.calender .content {
  display: flex;
}
.weekday, .time-block {
  flex: 1;
  flex-direction: row-reverse
}
.time-single-block {
  display: flex;
  border-right: 1px solid #f3f3f3;
  height: 50px;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer
}
.time-single-block .create {
  // background-color: #f3f3f3;
  // color: #a2a2a2;
  font-size: 12px;
  font-weight: bold;
  width: 100%;
  height: 100%;
  // opacity: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.time-single-block:nth-child(2n-1) {
  border-bottom: 1px solid #f3f3f3;
}
.weekday-header {
  border-bottom: 3px solid #f3f3f3;
}
.clock {
  display: flex;
  height: 100px;
  justify-content: center;
  color: #bebebe;
  font-size: 14px;
  border-bottom: 1px solid #f3f3f3;
  border-right: 1px solid #f3f3f3;
  padding-top: 10px;
}
.modal {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
}

</style>
