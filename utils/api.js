import axios from 'axios';


export const connection = (user) => axios.create({
  baseURL: 'http://localhost:4567/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': user ||  null
  }
})

export const errorMessage = (error) => {
	let err = error.response.data
	console.log(err);
	if (err.errors) {
		return Object.keys(err.errors).map(k => err.response.data.errors[k]).join(' ')
	} else if (err.message) {
		return err.message
	}
	return false

}