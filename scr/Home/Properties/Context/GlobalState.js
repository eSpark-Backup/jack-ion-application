import React from 'react';
import Context from './propContext';
import {create} from 'apisauce';
import Base_URL from '../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';

class GlobalState extends React.Component {
  componentDidMount() {
    this.getToken();
    NetInfo.fetch().then((state) => {
      console.log('Connection type', state.type);
      console.log('Is connected?', state.isConnected);
      !state.isConnected
        ? this.setState({isLoading: false})
        : this.setState({isLoading: true});
    });
  }
  getToken = async () => {
    console.log('Get Token');
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      this.setState({token: token});
      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
    }
  };

  clearData = () => {
    this.setState({propList: []});
  };

  checkData = async () => {
    this.setState({biller: ''});
    this.setState({isLoading: true, filterDataName: '', filterWork: false});

    let data = {
      offset: 0,
    };
    const response = await this.api.post('/property/all', data);
    // console.log('respone property===>', response.data.data.properties);
    this.setState({
      offset: response?.data?.data?.offset,
    });
    if (response?.data?.bool) {
      this.setState({propList: response.data.data.properties});
      this.setState({limitExceed: false});
      this.setState({isLoading: false});
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({isLoading: false});
    }
  };

  loadMoreData = async () => {
    if (!this.state.limitExceed) {
      this.setState({listLoader: true});
    }
    let data = {
      offset: this.state.offset,
      billing: this.state.filterDataName,
      search: this.state.filterPropName,
    };
    const response = await this.api.post('/property/all', data);
    // console.log('respone property===>', response.data.data);
    if (response?.data?.bool) {
      console.log('this.state.offset===>', this.state.offset);
      console.log(
        'response.data.data.offset===>',
        response?.data?.data?.offset,
      );
      if (
        this.state.offset != response?.data?.data?.offset &&
        response?.data?.data?.offset > 0
      ) {
        let data = [...this.state.propList];
        let data2 = response.data.data.properties;
        data.push(...data2);
        this.setState({propList: data});
        this.setState({
          listLoader: false,
          offset: response?.data?.data?.offset,
        });
        this.setState({limitExceed: false});
      } else {
        this.setState({limitExceed: true});
        this.setState({listLoader: false});
      }
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({listLoader: false});
    }
  };

  filterData = async (sort) => {
    this.setState({biller: sort.billing, filterWork: true});
    const response = await this.api.post('/property/all', sort);
    console.log('FIlter property===>', response);
    if (response?.data?.bool) {
      this.setState({
        propList: response.data.data.properties,
        filterDataName: sort.billing,
        offset: response?.data?.data?.offset,
      });
      console.log('FIltered property===>', response.data.data.properties);
      this.setState({limitExceed: false});
      this.setState({isLoading: false});
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({isLoading: false});
    }
  };

  state = {
    filterDataName: '',
    filterPropName: '',
    token: null,
    isLoading: true,
    searchLoading: false,
    listLoader: false,
    limitExceed: false,
    biller: '',
    loadFor: '',
    searchPropName: '',
    itemList: [],
    manageCompList: [],
    offset: 0,
    searchOffset: 0,
    filterSerial: '',
    searchList: [],
    propList: [],
    filterWork: false,
  };

  addProp = async (info) => {
    // console.log('PROPERTY INFORMATION--------->', info);
    this.setState({isLoading: true});
    const data = {
      name: info.propName,
      street: info.propStreet,
      city: info.propCity,
      st: info.propState,
      zipcode: info.propZipCode,
      property_id: info.propCustomId,
      billing_company_id: info.propBillCompId,
      management_company_id: info.propManageComp,
      contact_name: info.propContactName,
      contact_title: info.propContactTitle,
      contact_phone: info.propContactPhone,
      contact_email: info.propContactEmail,
      meter_id: info.meter_id,
      device_id: info.device_id,
      latitude: info.propLat,
      longitude: info.propLong,
    };
    console.log('data--->', data);
    this.api.post('/property/add', data).then((res) => {
      console.log(res.data);
      if (res?.data?.bool) {
        this.checkData();
      } else {
        Alert.alert('Error', res?.data?.message);
      }
    });
  };
  getBillingCompany = async () => {
    const response = await this.api.get('/property/billing-company/all');
    console.log(
      'Check billing company response',
      response?.data?.data?.billingCompany,
    );
    this.setState({itemList: response?.data?.data?.billingCompany});
  };

  getManagementCompany = async () => {
    const response = await this.api.get('/property/management-company/all');
    console.log(
      'Check management company response',
      response?.data?.data?.managementCompany,
    );
    this.setState({manageCompList: response?.data?.data?.managementCompany});
  };

  searchProperties = async (e) => {
    this.setState({loadFor: e});
    let data = {
      offset: 0,
      search: e,
    };

    if (e) {
      this.setState({searchLoading: true});
      const response = await this.api.post('/property/all', data);
      // console.log('Search property===>', response);
      this.setState({searchOffset: response?.data?.data?.offset});
      if (response?.data?.bool) {
        this.setState({searchList: response?.data?.data?.properties});
        // console.log('Search property===>', response.data.data.properties);
        this.setState({searchLoading: false});
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({searchLoading: false});
      }
    } else {
      this.setState({searchList: []});
    }
  };

  loadSearchData = async () => {
    this.setState({searchLoading: true});
    let prop = {
      offset: this.state.searchOffset,
      search: this.state.loadFor,
    };
    if (this.state.loadFor) {
      this.setState({searchLoading: true});
      const response = await this.api.post('/property/all', prop);
      console.log('Search more property===>', response);
      if (response?.data?.bool) {
        if (
          this.state.searchOffset != response?.data?.data?.offset &&
          response?.data?.data?.offset > 0
        ) {
          let data = [...this.state.searchList];
          let data2 = response.data.data.properties;
          data.push(...data2);
          this.setState({searchList: data});
          this.setState({
            searchLoading: false,
            searchOffset: response?.data?.data?.offset,
          });
        }
        setTimeout(() => {
          console.log('Check Searh Loader', this.state.searchLoading);
          if (this.state.searchLoading) {
            this.setState({searchLoading: false});
          }
        }, 3000);
      } else {
        Alert.alert('Error', 'Network Issues');
        this.setState({searchLoading: false});
      }
    } else {
      this.setState({searchList: []});
    }
  };

  clearSearchList = () => {
    this.setState({searchList: []});
  };

  updateBiller = (val) => {
    this.setState({biller: val});
  };

  updateFilterSerial = (e) => {
    this.setState({filterSerial: e});
  };
  updateFilterProperty = (e) => {
    this.setState({filterPropName: e});
  };

  render() {
    return (
      <>
        <Context.Provider
          value={{
            propList: this.state.propList,
            propitemList: this.state.itemList,
            manageCompList: this.state.manageCompList,
            isLoading: this.state.isLoading,
            searchList: this.state.searchList,
            searchLoading: this.state.searchLoading,
            listLoader: this.state.listLoader,
            biller: this.state.biller,
            filterSerial: this.state.filterSerial,
            filterPropName: this.state.filterPropName,
            filterWork: this.state.filterWork,
            addProp: this.addProp,
            checkData: this.checkData,
            getToken: this.getToken,
            getBillingCompany: this.getBillingCompany,
            getManagementCompany: this.getManagementCompany,
            clearData: this.clearData,
            filterData: this.filterData,
            searchProperties: this.searchProperties,
            clearSearchList: this.clearSearchList,
            loadMoreData: this.loadMoreData,
            loadSearchData: this.loadSearchData,
            updateBuilding: this.updateBuilding,
            updateBiller: this.updateBiller,
            updateFilterSerial: this.updateFilterSerial,
            updateFilterProperty: this.updateFilterProperty,
          }}>
          {this.props.children}
        </Context.Provider>
      </>
    );
  }
}

export {GlobalState};
