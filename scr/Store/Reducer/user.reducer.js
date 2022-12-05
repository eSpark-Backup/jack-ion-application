import { ERROR, FETCHING, FETCH_USER_SUCCESS, LOGOUT_REQUEST, FETCH_USER_UID_FOR_MESSAGING } from "../constants"

const initialState = {
  user: null,
  isLoading: false,
  resetPassToken: '',
  userId: null,
  authToken: null,
  userDataForMessaging: null,
}

export const userReducer = (state = initialState, action) => {
  const { payload } = action
  switch (action.type) {
    case FETCHING:
      return {
        ...state,
        isLoading: true
      }

    case FETCH_USER_SUCCESS:
      return {
        ...state,
        user: payload,
        isLoading: false
      }

    case FETCH_USER_UID_FOR_MESSAGING:
      console.log('uid dispatched', payload);
      return {
        ...state,
        userDataForMessaging: payload,
      }

    case ERROR:
      return {
        ...state,
        isLoading: false
      }

    case LOGOUT_REQUEST:
      return {
        state: initialState
      }
    default:
      return state
  }
}

export default userReducer
