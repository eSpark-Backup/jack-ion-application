import firebase from '@react-native-firebase/auth';
import { COLLECTION } from '../constants/collections';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export default class FirebaseService {
  // auth = firebase.auth()

  // firestore = firebase.firestore()

  messageRef = firestore().collection('Messages');

  // messageRef = firestore()
  // .collection('Messages')
  // .add({
  //   name: 'Ada Lovelace',
  //   age: 30,
  // })
  // .then(() => {
  //   console.log('User added!');
  // });

  async signIn() {
    auth()
      .signInAnonymously()
      .then(() => {
        console.log('User signed in anonymously');
      })
      .catch(error => {
        if (error.code === 'auth/operation-not-allowed') {
          console.log('Enable anonymous in your firebase console.');
        }

        console.error(error);
      });
  }
  
  async fetchMessages() {
    const messages = await firestore().collection('Messages').get();

    return messages
  }

  async createMessage({ message, uid }) {
    await firestore()
    .collection('Messages')
    .add({
      message: message,
      sender: uid,
    })
    .then(() => {
      console.log('User added!');
    });
  }
}