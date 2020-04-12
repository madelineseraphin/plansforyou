// This file contains all necessary api calls for the app.
import axios from "axios";
const baseUrl = 'http://localhost:8000';

export default {
  plans() {
    return {
      // used
      getOne: (id) => axios.get(`${baseUrl}/plan/${id}`),
      // used
      getAll: () => axios.get(`${baseUrl}/plans`),
      getForFriend: (friendId) => axios.get(`${baseUrl}/plans/${friendId}`),
      create: (toCreate) => axios.post(`${baseUrl}/plan`, toCreate),
      update: (toUpdate, id) => axios.put(`${baseUrl}/plan/${id}`, toUpdate),
      delete: (id) => axios.delete(`${baseUrl}/plan/${id}`),
    };
  },
  friends() {
    return {
      getOne: (id) => axios.get(`${baseUrl}/friend/${id}`),
      getAll: () => axios.get(`${baseUrl}/friends`),
      create: (toCreate) => axios.post(`${baseUrl}/friend`, toCreate),
      update: (toUpdate, id) => axios.put(`${baseUrl}/friend/${id}`, toUpdate),
      delete: (id) => axios.delete(`${baseUrl}/friend/${id}`),
    };
  },
  rsvps() {
    return {
      // used
      upsert: (friendId, planId, toUpsert) =>
        axios.post(`${baseUrl}/rsvp/${friendId}/${planId}`, toUpsert),
    };
  },
  comments() {
    return {
      // used
      create: (toCreate) => axios.post(`${baseUrl}/comment`, toCreate),
      update: (commentId, toCreate) =>
        axios.put(`${baseUrl}/comment/${commentId}`, toCreate),
      delete: (id) => axios.delete(`${baseUrl}/comment/${id}`),
    };
  },
  availabilities() {
    return {
      getAll: () => axios.get(`${baseUrl}/availabilities`),
      getForFriend: (friendId) =>
        axios.get(`${baseUrl}/availabilities/${friendId}`),
      create: (toCreate) => axios.post(`${baseUrl}/availability`, toCreate),
      update: (id, toUpdate) =>
        axios.put(`${baseUrl}/availability/${id}`, toUpdate),
      delete: (id) => axios.delete(`${baseUrl}/availability/${id}`),
    };
  },
};
