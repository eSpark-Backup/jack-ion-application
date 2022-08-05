import {Alert} from 'react-native';
import API from '../../api/SeviceApi';
import {FETCHED_PROPERTY} from '../constants';

export const fetchPropetry = (data) => {
  return async (dispatch) => {
    dispatch({type: FETCHED_PROPERTY});

    const response = await API.post(
      '/property/all',
      data
        ? data
        : {
            offset: 0,
          },
    );
    console.log('respone property===>', response.data.data.properties, data);

    if (response?.data?.bool) {
      const payload = {
        propList: response.data.data.properties,
        offset: response?.data?.data?.offset,
        limitExceed: false,
      };
      dispatch({type: FETCHED_PROPERTY, payload});
    } else {
      Alert.alert(response?.data?.message);
      // this.setState({ isLoading: false });
    }
  };
};

export const loadMoreData = (data) => {
  return async (dispatch, getState) => {
    dispatch({type: FETCHED_PROPERTY});

    const response = await API.post(
      '/property/all',
      data
        ? data
        : {
            offset: 0,
          },
    );
    console.log('LOAD MORE respone property===>', response.data.data.properties, data);

    if (response?.data?.bool) {
      if (
        data?.offset != response?.data?.data?.offset &&
        response?.data?.data?.offset > 0
      ) {
        const payload = {
          propList: [...getState().propertyReducer.propList , ...response?.data?.data?.properties],
          offset: response?.data?.data?.offset,
          limitExceed: false,
        };
        dispatch({type: FETCHED_PROPERTY, payload});
      }else {
        const payload = {
            limitExceed: true,
          };
          dispatch({type: FETCHED_PROPERTY, payload});
      }

    } else {
      Alert.alert(response?.data?.message);
      // this.setState({ isLoading: false });
    }
  };
};
