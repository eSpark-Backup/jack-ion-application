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
  // componentDidMount() {
  //   this.getToken();
  // }

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
      this.checkData();
    }
  };

  clearData = () => {
    this.setState({propList: []});
  };

  checkData = async () => {
    this.setState({isLoading: true});
    let data = {
      offset: 0,
    };
    const response = await this.api.post('/property/all', data);
    console.log('respone property===>', response);
    this.setState({success: response.data.bool});
    if (response?.data?.bool) {
      this.setState({propList: response.data.data.properties});
      this.setState({isLoading: false});
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({isLoading: false});
    }
  };

  loadMoreData = async () => {
    this.setState({listLoader: true});
    let data = {
      offset: this.state.propList.length,
    };
    const response = await this.api.post('/property/all', data);
    console.log('respone property===>', response.data.data);
    this.setState({success: response.data.bool});
    if (response?.data?.bool) {
      let data = [...this.state.propList];
      let data2 = response.data.data.properties;
      data.push(...data2);
      this.setState({propList: data});
      // console.log('new array', data);
      this.setState({listLoader: false});
    } else {
      Alert.alert('Error', 'Network Issues');
      this.setState({listLoader: false});
    }
  };

  filterData = async (sort) => {
    const response = await this.api.post('/property/all', sort);
    console.log('FIlter property===>', response);
    if (response?.data?.bool) {
      this.setState({propList: response.data.data.properties});
      console.log('FIltered property===>', response.data.data.properties);
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
    index: '',
    token: null,
    success: false,
    isLoading: false,
    searchLoading: false,
    listLoader: false,
    loadFor: '',
    propList1: ['Sugar Mamas', 'Sugar Mamas', 'Sugar Mamas', 'Sugar Mamas'],
    itemList: [],
    searchList: [],
    propList: [
      // {
      //   id: 1,
      //   name: 'Sugar Mamas',
      //   address: '11750 Shelbyville Road Lousisville, KY 40243',
      //   billComp: 'ION Energy Solutions',
      //   managementComp: 'Mark Bollinger',
      //   customId: '12344994',
      //   dataTop: [
      //     {
      //       id: 1,
      //       name: 'Main',
      //       list: [
      //         {
      //           id: 1,
      //           build: 'Main',
      //           name: '3171',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 2,
      //           build: 'Main',
      //           name: '3173',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 3,
      //           build: 'Main',
      //           name: '3175',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 4,
      //           build: 'Main',
      //           name: '3177',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 5,
      //           build: 'Main',
      //           name: '3179',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 6,
      //           build: 'Main',
      //           name: '3181',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 7,
      //           build: 'Main',
      //           name: '3183',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 8,
      //           build: 'Main',
      //           name: '3185',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 9,
      //           build: 'Main',
      //           name: '3187',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 10,
      //           build: 'Main',
      //           name: '3189',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 11,
      //           build: 'Main',
      //           name: '3191',
      //           code: '',
      //           type: '',
      //         },
      //         {
      //           id: 12,
      //           build: 'Main',
      //           name: '3193',
      //           code: '',
      //           type: '',
      //         },
      //       ],
      //     },
      //     {
      //       id: 2,
      //       name: 'Sugar Mamas',
      //       list: [
      //         {
      //           id: 1,
      //           build: 'Sugar Mamas',
      //           name: 'Alleycat Cafe',
      //           code: 'BA07A4A0',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 2,
      //           build: 'Sugar Mamas',
      //           name: 'Beck Realty Office',
      //           code: 'BA07A463',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 3,
      //           build: 'Sugar Mamas',
      //           name: 'Sugar Mama',
      //           code: 'BA07A47A',
      //           type: 'Gallons',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: 2,
      //   name: 'Parkway Plaza',
      //   address: '431 Rogers Rd Lexington, KY 40505',
      //   billComp: 'ION Energy Solutions',
      //   managementComp: 'RealPage, Inc.',
      //   customId: '12344994',
      //   dataTop: [
      //     {
      //       id: 1,
      //       name: 'A',
      //       // length: this.state.ListA.length,
      //       list: [
      //         {
      //           id: 1,
      //           build: 'A',
      //           name: 'A-01',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 2,
      //           build: 'A',
      //           name: 'A-02',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 3,
      //           build: 'A',
      //           name: 'A-03',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 4,
      //           build: 'A',
      //           name: 'A-04',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 5,
      //           build: 'A',
      //           name: 'A-05',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 6,
      //           build: 'A',
      //           name: 'A-06',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 7,
      //           build: 'A',
      //           name: 'A-07',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 8,
      //           build: 'A',
      //           name: 'A-08',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 9,
      //           build: 'A',
      //           name: 'A-09',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 10,
      //           build: 'A',
      //           name: 'A-10',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 11,
      //           build: 'A',
      //           name: 'A-11',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 12,
      //           build: 'A',
      //           name: 'A-12',
      //           code: 'AA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //       ],
      //     },
      //     {
      //       id: 2,
      //       name: 'B',
      //       // length: this.state.ListB.length,
      //       list: [
      //         {
      //           id: 1,
      //           build: 'B',
      //           name: 'B-01',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 2,
      //           build: 'B',
      //           name: 'B-02',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 3,
      //           build: 'B',
      //           name: 'B-03',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 4,
      //           build: 'B',
      //           name: 'B-04',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 5,
      //           build: 'B',
      //           name: 'B-05',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 6,
      //           build: 'B',
      //           name: 'B-06',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 7,
      //           build: 'B',
      //           name: 'B-07',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 8,
      //           build: 'B',
      //           name: 'B-08',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 9,
      //           build: 'B',
      //           name: 'B-09',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 10,
      //           build: 'B',
      //           name: 'B-10',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 11,
      //           build: 'B',
      //           name: 'B-11',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 12,
      //           build: 'B',
      //           name: 'B-12',
      //           code: 'BA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //       ],
      //     },
      //     {
      //       id: 3,
      //       name: 'C',
      //       // length: this.state.ListC.length,
      //       list: [
      //         {
      //           id: 1,
      //           build: 'C',
      //           name: 'C-01',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 2,
      //           build: 'C',
      //           name: 'C-02',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 3,
      //           build: 'C',
      //           name: 'C-03',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 4,
      //           build: 'C',
      //           name: 'C-04',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 5,
      //           build: 'C',
      //           name: 'C-05',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 6,
      //           build: 'C',
      //           name: 'C-06',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 7,
      //           build: 'C',
      //           name: 'C-07',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 8,
      //           build: 'C',
      //           name: 'C-08',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 9,
      //           build: 'C',
      //           name: 'C-09',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 10,
      //           build: 'C',
      //           name: 'C-10',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 11,
      //           build: 'C',
      //           name: 'C-11',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //         {
      //           id: 12,
      //           build: 'C',
      //           name: 'C-12',
      //           code: 'CA00EFE1',
      //           type: 'Cubic Feet',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: 3,
      //   name: 'Autumn Plaza',
      //   address: '2909 Old Fort Parkway Murfreesboro, TN 37128',
      //   billComp: 'ION Energy Solutions',
      //   managementComp: 'Autumn Plaza Partners',
      //   customId: '12344994',
      //   dataTop: [
      //     {
      //       id: 1,
      //       name: 'Autumn Plaza',
      //       list: [
      //         {
      //           id: 1,
      //           build: 'Autumn Plaza',
      //           name: 'Office 100',
      //           code: 'BA085C3A',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 2,
      //           build: 'Autumn Plaza',
      //           name: 'Retail 101',
      //           code: 'BA085CD4',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 3,
      //           build: 'Autumn Plaza',
      //           name: 'Retail 102',
      //           code: 'BA0849D4',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 4,
      //           build: 'Autumn Plaza',
      //           name: 'Retail 103',
      //           code: 'BA084B6B',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 5,
      //           build: 'Autumn Plaza',
      //           name: 'Retail 104',
      //           code: 'BA085C4D',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 6,
      //           build: 'Autumn Plaza',
      //           name: 'Retail 105',
      //           code: 'BA0849E4',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 7,
      //           build: 'Autumn Plaza',
      //           name: 'Retail 106',
      //           code: 'BA085C4A',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 8,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 201',
      //           code: 'BA085C28',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 9,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 202',
      //           code: 'BA085C23',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 10,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 203',
      //           code: 'BA085C36',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 11,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 204',
      //           code: 'BA085C32',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 12,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 205',
      //           code: 'BA085C3B',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 13,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 206',
      //           code: 'BA085C2A',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 14,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 207',
      //           code: 'BA085C2C',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 15,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 208',
      //           code: 'BA085C22',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 16,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 209',
      //           code: 'BA085C37',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 17,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 210',
      //           code: 'BA085C29',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 18,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 211',
      //           code: 'BA085C18',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 19,
      //           build: 'Autumn Plaza',
      //           name: 'Unit 212',
      //           code: 'BA0849DB',
      //           type: 'Gallons',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   id: 4,
      //   name: 'Candlewood',
      //   address: '2400 Harrison Avenue Cincinnati, OH 45211',
      //   billComp: 'ION Energy Solutions',
      //   managementComp: 'A1 Equities',
      //   customId: '12344994',
      //   dataTop: [
      //     {
      //       id: 1,
      //       name: 'Main',
      //       list: [
      //         {
      //           id: 1,
      //           build: 'Main',
      //           name: 'A',
      //           code: 'BA07A4F2',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 2,
      //           build: 'Main',
      //           name: 'B',
      //           code: 'BA07A470',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 3,
      //           build: 'Main',
      //           name: 'C',
      //           code: 'BA07A471',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 4,
      //           build: 'Main',
      //           name: 'D',
      //           code: 'BA07A4E8',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 5,
      //           build: 'Main',
      //           name: 'E',
      //           code: 'BA07A21E',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 6,
      //           build: 'Main',
      //           name: 'F',
      //           code: 'BA07A1F9',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 7,
      //           build: 'Main',
      //           name: 'G',
      //           code: 'BA07A1D8',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 8,
      //           build: 'Main',
      //           name: 'H',
      //           code: 'BA07A4FC',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 9,
      //           build: 'Main',
      //           name: 'I',
      //           code: 'BA07A468',
      //           type: 'Gallons',
      //         },
      //         {
      //           id: 10,
      //           build: 'Main',
      //           name: 'J',
      //           code: '',
      //           type: '',
      //         },
      //       ],
      //     },
      //   ],
      // },
    ],
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
    const response = await this.api.get(
      `/property/equipment/building/all-buildings/28303`,
    );
    console.log('Check response buildings--->', response);
    // console.log('Check response buildings--->', `/property/equipment/building/all-buildings/${data}`);

    // this.setState({ success: response.data.bool });
    // this.setState({ itemList: response?.data?.data?.billingCompany });
  };

  // showBuildings = (data) => {
  //   console.log('data--->', data);
  //   this.api.get(`/property/equipment/building/all-buildings/${data}`)
  //     .then((data) => {
  //       console.log(data);
  //       this.setState(data);
  //     }).catch((error) => {
  //       console.log("Api call error");
  //       alert(error.message);
  //     });
  //   console.log('Check response buildings--->', response?.data);

  //   // this.setState({ success: response.data.bool });
  //   // this.setState({ itemList: response?.data?.data?.billingCompany });
  // };
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
      offset: this.state.searchList.length,
      search: this.state.loadFor,
    };
    if (this.state.loadFor) {
      this.setState({searchLoading: true});
      const response = await this.api.post('/property/all', prop);
      console.log('Search more property===>', response);
      if (response?.data?.bool) {
        let data = [...this.state.searchList];
        let data2 = response.data.data.properties;
        data.push(...data2);
        this.setState({searchList: data});
        this.setState({searchLoading: false});
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

  render() {
    // console.log('pROP', this.props)
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
          }}>
          {this.props.children}
        </Context.Provider>
      </>
    );
  }
}

export {GlobalState};
