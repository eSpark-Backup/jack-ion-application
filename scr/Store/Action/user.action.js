import { FETCH_USER_SUCCESS } from "../constants"



export const userLogin = (user) => {
    return async (dispatch) => {
        dispatch({type: FETCH_USER_SUCCESS, payload: user})
    }
}