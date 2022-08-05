import { ERROR, FETCHED_PROPERTY, FETCHING, FETCHING_PROPERTY, FETCH_USER_SUCCESS, LOGOUT_REQUEST } from "../constants"

const initialState = {
    propList: [],
    offset: 0,
    limitExceed: false,
    isLoading: false
}

export const propertyReducer = (state = initialState, action) => {
    const { payload } = action
    switch (action.type) {
        case FETCHING_PROPERTY:
            return {
                ...state,
                isLoading: true
            }
        case FETCHED_PROPERTY:
            return {
                ...state,
                ...action?.payload,
                isLoading: false
            }
        default:
            return state
    }
}

export default propertyReducer