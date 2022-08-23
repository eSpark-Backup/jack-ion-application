import {Alert} from 'react-native';
import API from '../../api/SeviceApi';
import { getUniqueListBy } from '../../utils/helperFunction';
import {FETCHED_PROPERTY, FETCHED_PROPERTY_LOADMORE, FETCHING_PROPERTY, FETCHING_PROPERTY_LOADMORE} from '../constants';

export const fetchPropetry = (data) => {
  return async (dispatch) => {
    dispatch({type: FETCHING_PROPERTY});

    const response = await API.post(
      '/property/all',
      data
        ? data
        : {
            offset: 0,
          },
    );

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
    dispatch({type: FETCHING_PROPERTY_LOADMORE});

    const response = await API.post(
      '/property/all',
      data
        ? data
        : {
            offset: 0,
          },
    );

    if (response?.data?.bool) {
      if (
        data?.offset != response?.data?.data?.offset &&
        response?.data?.data?.offset > 0
      ) {
        const payload = {
          propList: getUniqueListBy([...getState().propertyReducer.propList , ...response?.data?.data?.properties], 'id'),
          offset: response?.data?.data?.offset,
          limitExceed: false,
        };
        dispatch({type: FETCHED_PROPERTY_LOADMORE, payload});
      }else {
        const payload = {
            limitExceed: true,
          };
          dispatch({type: FETCHED_PROPERTY_LOADMORE, payload});
      }

    } else {
      Alert.alert(response?.data?.message);
      // this.setState({ isLoading: false });
    }
  };
};
