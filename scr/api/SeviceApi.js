import {create} from 'apisauce';
import Base_Url from './WebServices';
import EncryptedStorage from 'react-native-encrypted-storage';

// let Token = null;

// getToken();
// async function getToken() {
//   let gotToken = await EncryptedStorage.getItem('user_token');
//   if (gotToken != null) {
//     Token = gotToken;
//   }
// }

const API = create({
  baseURL: Base_Url,
  headers: {
    device_type: 'mobile',
  },
});

// setTimeout(() => {
//   console.log('TimeOut getToken', Token);
//   API.setHeader('Authorization', 'Bearer ' + Token);
// }, 1);

export default API;
