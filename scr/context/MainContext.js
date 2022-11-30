import React, { createContext, useState, useEffect } from 'react';
// import { Delete, Get, Post, Update } from '../services/ApiCalls';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const MainContext = React.createContext();
export const UserContext = createContext(null);

export default props => {
    const [bookData, setBookData] = useState([]);

    const get_properties = () => {
        console.log('MainContext Working')
    }
    const get_user = () => {
        console.log('UserContext Working')
    }


    return (
        <MainContext.Provider
            value={{
                get_properties,
                get_user
            }}>
            {props.children}
        </MainContext.Provider>
    );
};
