export const calculateSkip = (page, limit) => {
    return Math.ceil((page - 1) * limit);
};
export const getRandomIndex = (length) => {
    return Math.floor(Math.random() * length);
};
// export const sendPushNotification = ({fcmToken,body}:{fcmToken:string,body:string})=>{
//     try {
//         messaging.send({
//             data:{
//                 click_action:"OPEN_APP",
//             },
//             token:fcmToken,
//             notification:{
//                 // imageUrl:socket.user?.avatar?.secureUrl,
//                 title:`${notificationTitles[getRandomIndex(notificationTitles.length)]}`,
//                 body,
//             },
//         })
//     } catch (error) {
//         console.log("error")
//     }
// }
