import {create} from 'apisauce';
import Base_Url from './WebServices';

const API = create({
  baseURL: Base_Url,
  headers: {
    secretcode: 'mIVTFjfD58DGLhAg5BnPY7VG9QFsL6qX0wTI5N27',
  },
});

export default API;
