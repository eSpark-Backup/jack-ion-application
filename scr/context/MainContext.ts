import React, { createContext, useState, useEffect } from 'react';
// import { Delete, Get, Post, Update } from '../services/ApiCalls';
// import AsyncStorage from '@react-native-async-storage/async-storage';

export const MainContext = React.createContext();

export default props => {
    const [bookData, setBookData] = useState([]);

    const get_properties = () => {
        console.log('MainContext Working')
    }


    return (
        <MainContext.Provider
            value={{
                get_properties
            }}>
            {props.children}
        </MainContext.Provider>
    );
};
