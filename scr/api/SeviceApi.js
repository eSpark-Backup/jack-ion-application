import {create} from 'apisauce';
import Base_Url from './WebServices';

const API = create({
  baseURL: Base_Url,
  headers: {
    device_type: 'mobile',
  },
});

export default API;
