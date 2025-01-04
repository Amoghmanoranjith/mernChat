import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Auth } from "../../../interfaces/auth.interface";
import type { User } from "../../../interfaces/auth.interface";
import { RootState } from "../store/store";

const initialState:Auth = {
    loggedInUser:null
}
const authSlice = createSlice({
    name:"authSlice",
    initialState,
    reducers:({
        updateLoggedInUser:(state,action:PayloadAction<User>)=>{
            state.loggedInUser=action.payload
        },
        updateLoggedInUserPublicKey:(state,action:PayloadAction<Pick<User,'publicKey'>>)=>{
            if(state.loggedInUser)
                state.loggedInUser.publicKey = action.payload.publicKey
        },
        updateLoggedInUserNotificationStatus:(state,action:PayloadAction<boolean>)=>{
            if(state.loggedInUser)
                state.loggedInUser.notificationsEnabled = action.payload
        },
        updateLoggedInUserFcmTokenStatus:(state,action:PayloadAction<boolean>)=>{
            if(state.loggedInUser)
                state.loggedInUser.fcmTokenExists = action.payload
        },
        logout:(state)=>{
            state.loggedInUser=null
        }
    })
})


export const selectLoggedInUser = ((state:RootState)=>state.authSlice.loggedInUser)


export const {
    updateLoggedInUser,
    updateLoggedInUserPublicKey,
    updateLoggedInUserNotificationStatus,
    updateLoggedInUserFcmTokenStatus,
    logout

} = authSlice.actions

export default authSlice
