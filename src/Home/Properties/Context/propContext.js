import React from 'react';



export default React.createContext({
    propPerty: 'Sugar Mama',
    // profileIndex: '',
    propList: [
        {
            id: 1,
            name: 'Sugar Mamas',
        },
        {
            id: 2,
            name: 'Parkway Plaza',
        },
        {
            id: 3,
            name: 'Autumn Plaza',
        },
        {
            id: 4,
            name: 'Candlewood',
        },
    ],
    propList1: [
        'Sugar Mamas',
        'Sugar Mamas',
        'Sugar Mamas',
        'Sugar Mamas',
    ],

    addProp: (propName) => { },
    addUnits: () => { },
    editProperty: (propName) => { },
    jumpToDetail: () => { },
});