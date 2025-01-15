import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatIntitalState, ChatMember, ChatWithUnreadMessages } from "../../../interfaces/chat.interface";
import { RootState } from "../store/store";

const initialState:ChatIntitalState =  {
    selectedChatDetails:null,
}
const chatSlice = createSlice({
    name:"chatSlice",
    initialState,
    reducers:{
        updateSelectedChatDetails:(state,action:PayloadAction<ChatWithUnreadMessages | null>)=>{
            state.selectedChatDetails=action.payload
        },
        updateUserTyping:(state,action:PayloadAction<ChatMember>)=>{
            state.selectedChatDetails?.userTyping.push(action.payload)
        },
        removeUserTyping:(state,action:PayloadAction<ChatMember>)=>{
            if(state.selectedChatDetails?.userTyping)
                state.selectedChatDetails.userTyping = state.selectedChatDetails?.userTyping.filter(user=>user._id!==action.payload._id)
        },
        updateSelectedChatMembers:(state,action:PayloadAction<Array<ChatMember>>)=>{
            if(state.selectedChatDetails && state.selectedChatDetails.members.length)
                state.selectedChatDetails.members.push(...action.payload)
        },
        removeSelectedChatMembers:(state,action:PayloadAction<Array<string>>)=>{        
            if(state.selectedChatDetails && state.selectedChatDetails.members.length)
                state.selectedChatDetails.members = state.selectedChatDetails.members.filter(member=>!action.payload.includes(member._id)) 
        },
        updateChatNameOrAvatar:(state,action:PayloadAction<{name?:string,avatar?:string}>)=>{
            if(state.selectedChatDetails){
                const {name,avatar} = action.payload
                if(name) state.selectedChatDetails.name = name
                if(avatar) state.selectedChatDetails.avatar = avatar
            }
        },
    },
})

// exporting selector
export const selectSelectedChatDetails = (state:RootState)=>state.chatSlice.selectedChatDetails

// exporting actions
export const {
    updateSelectedChatDetails,
    updateUserTyping,
    removeUserTyping,
    updateSelectedChatMembers,
    removeSelectedChatMembers,
    updateChatNameOrAvatar,
} = chatSlice.actions

export default chatSlice