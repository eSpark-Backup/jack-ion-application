import React from 'react';
import Context from './propContext';
import NetInfo from '@react-native-community/netinfo';
import {Alert} from 'react-native';
import API from '../../../api/SeviceApi';

class GlobalState extends React.Component {
  componentDidMount() {
    NetInfo.fetch().then((state) => {
      // console.log('Connection type', state.type);
      // console.log('Is connected?', state.isConnected);
      !state.isConnected
        ? this.setState({isLoading: false})
        : this.setState({isLoading: true});
    });
  }

  clearData = () => {
    this.setState({propList: []});
  };

  checkData = async () => {
    this.setState({biller: ''});
    this.setState({isLoading: true, filterDataName: '', filterWork: false});

    let data = {
      offset: 0,
    };
    const response = await API.post('/property/all', data);
    this.setState({
      offset: response?.data?.data?.offset,
    });
    if (response?.data?.bool) {
      this.setState({propList: response.data.data.properties});
      this.setState({limitExceed: false});
      this.setState({isLoading: false});
    } else {
      Alert.alert(response?.data?.message);
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
      location: this.state.filterLocation,
    };
    const response = await API.post('/property/all', data);
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
      Alert.alert(response?.data?.message);
      this.setState({listLoader: false});
    }
  };

  filterData = async (sort) => {
    this.setState({biller: sort.billing, filterWork: true, isLoading: true});
    const response = await API.post('/property/all', sort);
    // console.log('FIlter property===>', response);
    if (response?.data?.bool) {
      this.setState({
        propList: response.data.data.properties,
        filterDataName: sort.name,
        offset: response?.data?.data?.offset,
      });
      // console.log('FIltered property===>', response.data.data.properties);
      this.setState({limitExceed: false});
      this.setState({isLoading: false});
    } else {
      Alert.alert('Error', response.data.message);
      this.setState({isLoading: false});
    }
  };

  state = {
    filterDataName: '',
    filterPropName: '',
    filterLocation: '',
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
    loadData: true,
  };

  addProp = async (info) => {
    // console.log('PROPERTY INFORMATION--------->', info);
    this.setState({isLoading: true});
    const data = {
      name: info.propName,
      latitude: info.propLat,
      longitude: info.propLong,
      street: info.propStreet,
      city: info.propCity,
      st: info.propState,
      // meter_id: info.meter_id,
      // model_no_id: info.model_no_id,
      // manufacturer_id: info.manufacturer_id,
      device_id: info.device_id,
      utility_type_id: info.utility_type_id,
      zipcode: info.propZipCode,
      radial_dist: info.radial_dist,
      // not requrired data below
      custom_id: info.propCustomId,
      billing_company_id: info.propBillCompId,
      management_company_id: info.propManageCompId,
      owner_id: info.propContactName,
      contact_title: info.propContactTitle,
      contact_phone: info.propContactPhone,
      contact_email: info.propContactEmail,
    };
    // console.log('data--->', data);
    API.post('/property/add', data).then((res) => {
      // console.log(res.data);
      if (res?.data?.bool) {
        this.checkData();
      } else {
        Alert.alert('Error', res?.data?.message);
      }
    });
  };

  getBillingCompany = async () => {
    this.setState({isLoading: true});
    const response = await API.get('/property/billing-company/all');
    // console.log(
    //   'Check billing company response',
    //   response?.data?.data?.billingCompany,
    // );
    this.setState({
      itemList: response?.data?.data?.billingCompany,
    });
  };

  getManagementCompany = async () => {
    this.setState({isLoading: true});
    const response = await API.get('/property/management-company/all');
    // console.log(
    //   'Check management company response',
    //   response?.data?.data?.managementCompany,
    // );
    let list = response?.data?.data?.managementCompany;
    let filter = [];
    for (let i = 0; i < list.length; i++) {
      const data = {
        name: list[i].manager_name,
        id: list[i].id,
      };
      filter.push(data);
    }
    this.setState({
      manageCompList: filter,
      isLoading: false,
    });
  };

  searchProperties = async (e) => {
    this.setState({loadFor: e});
    let data = {
      offset: 0,
      search: e,
    };

    if (e) {
      this.setState({searchLoading: true});
      const response = await API.post('/property/all', data);
      // console.log('Search property===>', response);
      this.setState({searchOffset: response?.data?.data?.offset});
      if (response?.data?.bool) {
        this.setState({searchList: response?.data?.data?.properties});
        // console.log('Search property===>', response.data.data.properties);
        this.setState({searchLoading: false});
      } else {
        Alert.alert(response?.data?.message);
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
      const response = await API.post('/property/all', prop);
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
          // console.log('Check Searh Loader', this.state.searchLoading);
          if (this.state.searchLoading) {
            this.setState({searchLoading: false});
          }
        }, 3000);
      } else {
        Alert.alert(response?.data?.message);
        this.setState({searchLoading: false});
      }
    } else {
      this.setState({searchList: []});
    }
  };

  loadLoader = () => {
    this.setState({isLoading: true});
  };

  stopLoader = () => {
    this.setState({isLoading: false});
  };

  dontLoad = () => {
    this.setState({loadData: false});
  };

  doLoad = () => {
    // console.log('LOAD KO TRUE KARO');
    this.setState({loadData: true});
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

  updateFilterLocation = (e) => {
    this.setState({filterLocation: e});
  };

  render() {
    // console.log('LOADDATA GLOBALSTATE', this.state.loadData);

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
            filterLocation: this.state.filterLocation,
            filterWork: this.state.filterWork,
            addProp: this.addProp,
            checkData: this.checkData,
            getBillingCompany: this.getBillingCompany,
            getManagementCompany: this.getManagementCompany,
            clearData: this.clearData,
            filterData: this.filterData,
            searchProperties: this.searchProperties,
            clearSearchList: this.clearSearchList,
            loadMoreData: this.loadMoreData,
            loadData: this.state.loadData,
            loadSearchData: this.loadSearchData,
            loadLoader: this.loadLoader,
            stopLoader: this.stopLoader,
            dontLoad: this.dontLoad,
            doLoad: this.doLoad,
            updateBuilding: this.updateBuilding,
            updateBiller: this.updateBiller,
            updateFilterSerial: this.updateFilterSerial,
            updateFilterProperty: this.updateFilterProperty,
            updateFilterLocation: this.updateFilterLocation,
          }}>
          {this.props.children}
        </Context.Provider>
      </>
    );
  }
}

export {GlobalState};
