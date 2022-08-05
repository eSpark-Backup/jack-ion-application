import { Alert } from "react-native";
import API from "../../api/SeviceApi";
import { FETCHED_PROPERTY } from "../constants"


export const fetchPropetry = () => {
    return async (dispatch) => {
        dispatch({ type: FETCHED_PROPERTY })

        let data = {
            offset: 0,
        };

        const response = await API.post('/property/all', data);
        // console.log('respone property===>', response.data.data.properties);

        if (response?.data?.bool) {
            const payload = {
                propList: response.data.data.properties,
                offset: response?.data?.data?.offset,
                limitExceed: false
            }
            dispatch({ type: FETCHED_PROPERTY, payload })
        } else {
            Alert.alert(response?.data?.message);
            // this.setState({ isLoading: false });
        }
    }
}