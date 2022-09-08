import { Alert } from 'react-native';
import API from '../../api/SeviceApi';

import { FETCHING_CONTACTS, ADD_CONTACT, DELETE_CONTACT, EDIT_CONTACT, FETCHED_CONTACTS } from '../constants';

export const fetchAlerts = () => {
    return async (dispatch) => {
        dispatch({ type: FETCHING_CONTACTS });
        const propertyData = this.props.navigation.state.params.item.item;
        const allAlertsRes = await API.get(`/alert/all/${propertyData?.id}`);
        if (allAlertsRes.data.bool) {
            let allAlerts = allAlertsRes.data.data;
            let alerts = [...allAlerts];
            alerts.map((item, index) => {
                alerts[index].check = false;
            });
            this.setState({ allAlerts: alerts });
            dispatch({ type: FETCHED_CONTACTS, alerts });
        } else {
            Alert.alert(response?.data?.message);
            this.setState({ loader: false });
            alert(allAlertsRes.data.message);
        }
    };
};