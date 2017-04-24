import Vue from 'vue';
import apis from '../api';

const login = (email, nickname) => Vue.http.post(apis.POST_SIGNUP, { email, nickname });
const getMe = () => Vue.http.get(apis.GET_ME);
const getRooms = () => Vue.http.get(apis.GET_ROOMS);
const createRoom = body => Vue.post(apis.POST_CREATE_ROOM, body);
const createOrder = body => Vue.http.post(apis.POST_CREATE_ROOM_ORDER, body);
const getRoomOrders = roomId => {
  return Vue.http.get(apis.GET_ROOM_ORDERS.replace(':roomId', roomId))
};

const deleteRoomStatus = startTime => Vue.http.delete(apis.DELETE_ROOM_STATUS.replace(':startTime', startTime))

export default ({
  login,
  getMe,
  getRooms,
  createRoom,
  createOrder,
  getRoomOrders,
  deleteRoomStatus,
});

