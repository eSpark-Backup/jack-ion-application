import React from 'react';
import Context from './propContext';
import {create} from 'apisauce';
import Base_URL from '../../../api/WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';
import axios from 'axios';
import clc from 'cli-color';

// const baseURL = 'http://51.178.36.223/api';

// const ContextProp = React.createContext('default Value')

class GlobalState extends React.Component {
  componentDidMount() {
    this.getToken();
  }

  getToken = async () => {
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
      this.checkData();
    }
  };

  loadMoreData = async () => {
    console.log('load More Data');
    const token = await EncryptedStorage.getItem('user_token');
    if (token != null) {
      console.log('token aya', token);
      this.setState({token: token});
      this.api = create({
        baseURL: Base_URL,
        headers: {Authorization: 'Bearer ' + token},
      });
      let data = {
        offset: 10,
      }
      const response = await this.api.post('/property/all', data);
      this.setState({
        propList: [...this.state.propList, response.data.data.properties],
      });
    }
  };

  clearData = () => {
    this.setState({propList: []});
  };

  checkData = async () => {
    this.setState({isLoading: true});
    let data = {
      offset: 0,
    }
    const response = await this.api.post('/property/all', data);
    this.setState({success: response.data.bool});
    this.setState({propList: response.data.data.properties});
    this.setState({isLoading: false});
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
    propList1: ['Sugar Mamas', 'Sugar Mamas', 'Sugar Mamas', 'Sugar Mamas'],
    itemList:[],
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
    console.log('PROPERTY INFORMATION--------->', info);
    // this.state.propList.push({
    //   id: this.state.propList.length + 1,
    //   name: info.propName,
    //   address: info.propAddress,
    //   billComp: info.propBillComp,
    //   managementComp: info.propManageComp,
    //   customId: info.propCustomId,
    // });
    // const list = [...this.state.propList.name, propName]
    // this.setState({propList: this.state.propList});
    // console.log('Prop list', this.state.propList);
    // var requestOptions = {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': 'Bearer ' + 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIxMSIsImp0aSI6IjU1NTAxZjE0MjQ5MWVkYjQ4NGFkYWY2Y2FlMGFlOTY4NjM2OTFkMzhkM2QyY2JhODQ4NjFiODAwM2YzYjY0MzQ4MTUyNGMzMWRmZjkxZjFjIiwiaWF0IjoxNjMzNzk3NzQ5LCJuYmYiOjE2MzM3OTc3NDksImV4cCI6MTY2NTMzMzc0OSwic3ViIjoiMTkiLCJzY29wZXMiOltdfQ.nphSUM-ORtJTpdpl-lGY5dQsuS5r7SggPCTjOXu7B3rtqGyjqCn9FULyE_-oOahmgLXb7JMoh8awNKpGrp6Y_jegWeWe1iOJaoke2FRTEscFzsxTKDbFiFOnIn6rbfHP9UP5O2HHHuh-27Ej0-Vlkx5Z6fAB1x49G_eSr3gcwoNeFVybBElD_aiBZkSziOa7vdjGWfcOejhJgcLIYsC8vO2YJxjisubaeyCHkmRarfIXXHDWXoKDIpx6tERCKiqAHA1P6HFaF7UULUI8YYnxCjBlb29ZGtORn3scwglLeAYgUqQMMORGb9fmcGfp_npWcvLO61SZs-39TepSmNQNcq3TegIJ3J-7lYl1_FoYsI3XlzQe9H9naV5ivjL_7jZsYkr1t9HiEh-Z4qpTDZAl2B5rcbpEMJ_JBkK37QwYf0NIQQSrELj0CWq5QaBoqsxQG7Ys06Oi6N5sk8oQ1skJOGRzd4E7PGGPUHUSA6dQEVx9v7-xBvnOjqd0Z9yqwQsJx40hmXMne01JyIzWwOt6pm3vQEG_0YYBKW2sCnDw-CsVHQUIkIhiVuhcX-pXpaYds7eQmlRU5CE-mdRAhmmHxerFAvST1BzQS-rHBhoAL5Td_mz2TtXa70Gpg5rL98yNzX_0pIWCFMexPlmicZec2narA6OV35pDbRjnv4e0eMw'
    //   },
    //   body: JSON.stringify({
    //     property: info.propName,
    //     street: info.propAddress,
    //     developer: info.propBillComp,
    //     managerName: info.propManageComp,
    //     contact: info.propContact,
    //     contactEmail: info.propContactEmail,
    //   }),
    //   redirect: 'follow',
    // };
    const data = {
      name: info.propName,
      street: info.propAddress,
      property_id: info.propCustomId,
      billing_company_id:info.propBillCompId,
    }
    // api.patch(`/property/add`,data).then(res => {
      console.log('data--->',data);
    // })
    this.api.post('/property/add', data).then(res => {
      console.log(res.data);
    });
    // fetch('http://51.178.36.223/api/property/add', requestOptions)
    //   .then((response) => console.log(response.data))
    //   .then((result) => console.log(result))
    //   .catch((error) => console.log('error', error));

    const response = await this.api.post('/property/all');
    this.setState({ propList: response.data.data.properties });
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
    this.state.propList[building.indexUnits].dataTop.push({
      id: this.state.propList[building.indexUnits].dataTop.length + 1,
      name: building.newBuildName,
      list: building.newBuildUnits,
    });
  };

  profileWeGet = (profile) => {
    // this.setState({ index: profile })
    // console.log('We Get', this.state.propList)
  };

  editProperty = async (editData) => {
    console.log('editproperty===>', editData);

    // const some_array = [...this.state.propList];
    // some_array[editData.atIndex] = {
    //   id: editData.id,
    //   name: editData.editName,
    //   address: editData.editAddress,
    //   billComp: editData.editBillComp,
    //   managementComp: editData.editManageComp,
    //   customId: editData.editCustomId,
    // };
    // // console.log('hello', some_array)
    // this.setState({propList: some_array});
    // console.log('Global List', this.state.propList)
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
    const response = await this.api.get('/property/billing-companies');
    console.log('Check response', response?.data?.data?.billingCompany);
    // this.setState({ success: response.data.bool });
    this.setState({ itemList: response?.data?.data?.billingCompany });
  }

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
            loadMoreData: this.loadMoreData,
            getBillingCompany: this.getBillingCompany,
            clearData: this.clearData,
            isLoading: this.state.isLoading,
          }}>
          {this.props.children}
        </Context.Provider>
      </>
    );
  }
}

export {GlobalState};
