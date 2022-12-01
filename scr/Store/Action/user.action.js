import { FETCH_USER_SUCCESS, FETCH_USER_UID_FOR_MESSAGING } from "../constants"



export const userLogin = (user) => {
    return async (dispatch) => {
        dispatch({type: FETCH_USER_SUCCESS, payload: user})
    }
}

export const fetchUserForMessaging = (user) => {
    return async (dispatch) => {
        dispatch({type: FETCH_USER_UID_FOR_MESSAGING, payload: user})
    }
}