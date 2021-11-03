import React from 'react';
import Context from './propContext';
import {create} from 'apisauce';
import Base_URL from '../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import clc from 'cli-color';
import {Alert} from 'react-native';

// const baseURL = 'http://51.178.36.223/api';

// const ContextProp = React.createContext('default Value')

class GlobalState extends React.Component {
  componentDidMount() {
    this.getToken();
  }
  getToken = async () => {
    console.log('Get Token');
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      // console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
      // this.checkData();
    }
  };

  clearData = () => {
    this.setState({propList: []});
  };

  checkData = async () => {
    this.setState({biller: ''});
    this.setState({isLoading: true, filterDataName: '',filterWork:false});
    let data = {
      offset: 0,
    };
    const response = await this.api.post('/property/all', data);
    // console.log('respone property===>', response.data.data.properties);
    this.setState({
      success: response.data.bool,
      offset: response.data.data.offset,
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
    };
    const response = await this.api.post('/property/all', data);
    // console.log('respone property===>', response.data.data);
    this.setState({
      success: response.data.bool,
    });
    if (response?.data?.bool) {
      console.log('this.state.offset===>', this.state.offset);
      console.log('response.data.data.offset===>', response.data.data.offset);
      if (
        this.state.offset != response.data.data.offset &&
        response.data.data.offset > 0
      ) {
        let data = [...this.state.propList];
        let data2 = response.data.data.properties;
        data.push(...data2);
        this.setState({propList: data});
        // console.log('new array', data);
        this.setState({listLoader: false, offset: response.data.data.offset});
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

  changeOffset = () => {
    this.setState({offset: 0});
  };

  filterData = async (sort) => {
    this.setState({biller: sort.billing,filterWork:true});
    const response = await this.api.post('/property/all', sort);
    console.log('FIlter property===>', response);
    if (response?.data?.bool) {
      this.setState({
        propList: response.data.data.properties,
        filterDataName: sort.billing,
        offset: response.data.data.offset,
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
    editName: '',
    editAddress: '',
    editBillComp: '',
    editManageComp: '',
    editCustomId: '',
    filterDataName: '',
    filterPropName: '',
    index: '',
    token: null,
    success: false,
    isLoading: true,
    searchLoading: false,
    listLoader: false,
    limitExceed: false,
    biller: '',
    loadFor: '',
    searchPropName: '',
    propList1: ['Sugar Mamas', 'Sugar Mamas', 'Sugar Mamas', 'Sugar Mamas'],
    itemList: [],
    offset: 0,
    searchOffset: 0,
    filterSerial: '',
    searchList: [],
    propList: [],
    filterWork:false
  };

  addProp = async (info) => {
    // console.log('PROPERTY INFORMATION--------->', info);
    const data = {
      name: info.propName,
      street: info.propStreet,
      city: info.propCity,
      st: info.propState,
      zipcode: info.propZipCode,
      property_id: info.propCustomId,
      billing_company_id: info.propBillCompId,
      management_company: info.propManageComp,
      contact_name: info.propContactName,
      contact_title: info.propContactTitle,
      contact_phone: info.propContactPhone,
      contact_email: info.propContactEmail,
    };
    // console.log('data--->', data);
    this.api.post('/property/add', data).then((res) => {
      console.log(res.data);
      if (res?.data?.bool) {
        this.checkData();
      } else {
        Alert.alert('Error', 'Network Issues');
      }
    });

    // const response = await this.api.post('/property/all');
    // this.setState({propList: response.data.data.properties});
  };

  addUnits = (info) => {
    // console.log('On Add Unit', this.state.propList[info.indexUnits].dataTop[info.indexBuild].list)
    this.state.propList[info.indexUnits].dataTop[info.indexBuild].list.push({
      id:
        this.state.propList[info.indexUnits].dataTop[info.indexBuild].list
          .length + 1,
      build: info.unitBuild,
      name: info.unitName,
      code: info.unitSerial,
      type: info.unitMeter,
    });
  };

  addBuilding = (building) => {
    // console.log(building)
    // console.log(this.state.propList[building.indexUnits].dataTop)
    // this.state.propList[building.indexUnits].dataTop.push({
    //   id: this.state.propList[building.indexUnits].dataTop.length + 1,
    //   name: building.newBuildName,
    //   list: building.newBuildUnits,
    // });
    const unitResponse = this.api.post(
      `/property/equipment/building/add-building`,
      building,
    );
    console.log('Check unitResponse buildings--->', unitResponse);
  };

  profileWeGet = (profile) => {
    // this.setState({ index: profile })
    // console.log('We Get', this.state.propList)
  };

  editProperty = async (editData) => {
    // console.log('editproperty===>', editData);
  };

  editUnit = (editData) => {
    // console.log('On Add Unit', this.state.propList[editData.indexUnits].dataTop[editData.unitBuild].list)
    // console.log('On Edit Unit Index', editData)

    const some_array = [
      ...this.state.propList[editData.indexUnits].dataTop[editData.indexBuild]
        .list,
    ];
    some_array[editData.atIndex] = {
      id: editData.id,
      build: editData.editBuild,
      name: editData.editUnit,
      code: editData.editSerial,
      type: editData.editMeter,
    };
    // console.log('What we are getin', some_array)
    // this.setState(Object.assign(this.state.propList[0](this.state.propList.dataTop[0],{list: some_array})))
    this.setState(
      Object.assign(
        this.state.propList[editData.indexUnits].dataTop[editData.indexBuild],
        {list: some_array},
      ),
    );
    // console.log('Kiya Edit Howa', this.state.propList[editData.indexUnits].dataTop[editData.unitBuild].list)
  };
  jumpToDetail = () => {
    this.props.navigation.navigate('Detail');
    // this.selectedProp()
  };
  getBillingCompany = async () => {
    const response = await this.api.get('/property/billing-company/all');
    console.log('Check response', response?.data?.data?.billingCompany);
    // this.setState({ success: response.data.bool });
    this.setState({itemList: response?.data?.data?.billingCompany});
  };

  showBuildings = async (data) => {
    const response = await this.api.post(
      `/property/equipment/building/all-buildings/28303`,
    );
    console.log('Check response buildings--->', response);
    // console.log('Check response buildings--->', `/property/equipment/building/all-buildings/${data}`);

    // this.setState({ success: response.data.bool });
    // this.setState({ itemList: response?.data?.data?.billingCompany });
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
      this.setState({searchOffset: response.data.data.offset});
      if (response?.data?.bool) {
        this.setState({searchList: response.data.data.properties});
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
          this.state.searchOffset != response.data.data.offset &&
          response.data.data.offset > 0
        ) {
          let data = [...this.state.searchList];
          let data2 = response.data.data.properties;
          data.push(...data2);
          this.setState({searchList: data});
          this.setState({
            searchLoading: false,
            searchOffset: response.data.data.offset,
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

  updateBuilding = async (edit, id, params) => {
    console.log('updateBuilding');
    if (edit) {
      const response = await this.api.patch(
        `/property/equipment/building/update-building/${id}`,
        params,
      );
      console.log('Check Update', response?.data);
      alert(response?.data?.message);
    } else {
      const response = await this.api.delete(
        `/property/equipment/building/${id}`,
      );
      console.log('Check response', response?.data);
      alert(response?.data?.message);
    }
  };
  render() {
    return (
      <>
        <Context.Provider
          value={{
            propList: this.state.propList,
            success: this.state.success,
            propPerty: this.state.propPerty,
            profileIndex: this.state.profileIndex,
            propitemList: this.state.itemList,
            addProp: this.addProp,
            addUnits: this.addUnits,
            addBuilding: this.addBuilding,
            editUnit: this.editUnit,
            editProperty: this.editProperty,
            profileWeGet: this.profileWeGet,
            jumpToDetail: this.jumpToDetail,
            checkData: this.checkData,
            getToken: this.getToken,
            getBillingCompany: this.getBillingCompany,
            clearData: this.clearData,
            showBuildings: this.showBuildings,
            isLoading: this.state.isLoading,
            filterData: this.filterData,
            searchProperties: this.searchProperties,
            searchList: this.state.searchList,
            searchLoading: this.state.searchLoading,
            clearSearchList: this.clearSearchList,
            loadMoreData: this.loadMoreData,
            listLoader: this.state.listLoader,
            loadSearchData: this.loadSearchData,
            deleteBuilding: this.deleteBuilding,
            updateBuilding: this.updateBuilding,
            biller: this.state.biller,
            updateBiller: this.updateBiller,
            filterSerial: this.state.filterSerial,
            updateFilterSerial: this.updateFilterSerial,
            filterPropName: this.state.filterPropName,
            updateFilterProperty: this.updateFilterProperty,
            filterWork:this.state.filterWork
          }}>
          {this.props.children}
        </Context.Provider>
      </>
    );
  }
}

export {GlobalState};
