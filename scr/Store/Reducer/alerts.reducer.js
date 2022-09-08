import { FETCHING_ALERTS, ADD_ALERT, DELETE_ALERT, EDIT_ALERT, FETCHED_ALERTS } from '../constants';

const initialState = {
    alertsList: [],
    isLoading: false,
    loader: true,
    isModalVisible: false,
    allAlerts: [],
    allAlertsChecked: false,
    testAlert: false,
    alertIndex: null,
    alertSelected: false,
    detailsSelected: false,
    equipmentsSelected: false,
    reportsSelected: false,
    supportSelected: false,
    alertDesc: '',
    alertSettName: '',
    settingModal: false,
    dismissQty: null,
    dismissNote: '',
    dismissModal: false,
    contactModal: false,
    alertIds: [],
    alertSettObj: {},
    alertSettObjInd: {},
    showAdvanceSett: false,
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    currentIndex: '',
    currentItemId: '',
    alert_type: [],
    currentPropertyId: '',
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

export const alertsReducer = (state = initialState, action) => {
    const { payload } = action
    switch (action.type) {
        case FETCHING_ALERTS:
            return {
                ...state,
                isLoading: true
            }
        case FETCHED_ALERTS:
            return {
                ...state,
                alertsList: action?.payload?.alertsList,
                isLoading: false
            }
        default:
            return state
    }
}

export default propertyReducer