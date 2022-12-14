import { unionWith } from 'lodash'

export function messagesReducer(state, action) {

    switch (action.type) {
        case 'add':
            return unionWith(state, action.payload, function (a, b) {
                return a.id === b.id
            }).sort(function (a, b) {
                const aData = a.data()
                const bData = b.data()

                return bData.created_at.seconds - aData.created_at.seconds
            })
        case 'delete':
            return action.payload;
        default:
            throw new Error('Action type is not implemented!')
    }
}
// export function msgNotificationReducer(state, action) {

//     switch (action.type) {
//         case 'newMessageNotification':
//             const messages = action.payload.messages;
//             const filteredMessages = action.payload.filteredMessages;
//             const newMessages = [];
//             for(let i = 0; i < messages.length; i++) {
//                 if(filteredMessages[i] !== messages[i]) {
//                     newMessages?.push(filteredMessages[i]);
//                     console.log('new messages', newMessages);
//                 }
                
//             }
//             console.log('new messages', newMessages);
//             return newMessages;
//         default:
//             throw new Error('Action type is not implemented!')
//     }
// }