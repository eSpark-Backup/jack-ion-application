import { ERROR, FETCHED_PROPERTY, FETCHED_PROPERTY_LOADMORE, FETCHING, FETCHING_PROPERTY, FETCHING_PROPERTY_LOADMORE, FETCH_USER_SUCCESS, LOGOUT_REQUEST } from "../constants"

const initialState = {
    propList: [],
    offset: 0,
    limitExceed: false,
    isLoading: false,
    listLoader: false
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
        case FETCHING_PROPERTY_LOADMORE:
            return {
                ...state,
                listLoader: true
            }
        case FETCHED_PROPERTY_LOADMORE:
            return {
                ...state,
                ...action?.payload,
                listLoader: false
            }
        default:
            return state
    }
}

export default propertyReducer