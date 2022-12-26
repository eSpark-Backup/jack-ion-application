import { FETCH_USER_SUCCESS, FETCH_FIREBASE_MESSAGES } from "../constants"



export const userLogin = (user) => {
    return async (dispatch) => {
        dispatch({type: FETCH_USER_SUCCESS, payload: user})
    }
}

export const fetchUserDataForMessaging = (filteredMessages) => {
    return (dispatch) => {
         dispatch({type: FETCH_FIREBASE_MESSAGES, payload: filteredMessages})
        
    }
}