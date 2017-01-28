import axios from 'axios';


export const connection = (user) => axios.create({
  baseURL: 'http://localhost:4567/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': user ||  null
  }
})