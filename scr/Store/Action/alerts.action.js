import {Alert} from 'react-native';
import API from '../../api/SeviceApi';

import { FETCHING_CONTACTS, ADD_CONTACT, DELETE_CONTACT, EDIT_CONTACT, FETCHED_CONTACTS } from '../constants';

const initialState = {
    alertsList: [],
    isLoading: false,
    shimmers: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }],
    notifications: [{ title: 'Alert Contacts', icon: 'bell' }],
    alertsType: [
      {
        title: 'Equipment Health Alerts',
        icon: 'heart',
        data: [],
      },
      {
        title: 'Smart Security Alerts',
        icon: 'shield',
        data: [],
      },
    ],
    alertContacts: [
      {
        title: 'Alerts Contacts',
        icon: 'bell',
        data: [],
      },
    ],
    activeTab: 'alert',
}

export const fetchAlerts = () => {
    return async (dispatch) => {
      dispatch({type: FETCHING_CONTACTS});
  
      const response = await API.get(
        `/alert/property/contact/all`
      );
  
      if (response?.data?.bool) {
        const payload = {
            alertsList: response.data.data.alerts,
        };
        dispatch({type: FETCHED_CONTACTS, payload});
      } else {
        Alert.alert(response?.data?.message);
      }
    };
  };

export const addContact = () => {
    return async (dispatch) => {
        
    }
}