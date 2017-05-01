import axios from 'axios';


export const apiRequest = (user) => axios.create({
  baseURL: 'http://localhost:4567/',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': user ||  null
  }
})

export const errorMessage = (error) => {
	let err = error.response ? error.response.data : error;
	try {
		err = JSON.parse(err)
	} catch (e) {}

	if (err.errors) {
		err = Object.keys(err.errors).map(k => err.errors[k]).join(' ')
	} else if (err.message) {
		err = err.message
	}
	return translateErrorCode(err)
}

const errorCodeMessages = {
	// List create: <title> + <_user> must be unique
	'E11000': {
		msg: 'List already exists with that name'
	}
}

function translateErrorCode(msg) {
	let strings = msg.toString().split(' ')

	for (let i = 0; i < strings.length; i++) {
		if (Object.keys(errorCodeMessages).indexOf(strings[i]) > -1 ) {
			return errorCodeMessages[strings[i]].msg
		}
	}
	return msg
}