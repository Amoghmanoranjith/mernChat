import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { ChatIntitalState, ChatMember, ChatWithUnreadMessages } from "../../../interfaces/chat.interface";
import { RootState } from "../store/store";

const initialState:ChatIntitalState =  {
    selectedChatId:null,
    selectedChatDetails:null,
    filteredChats:[]
}
const chatSlice = createSlice({
    name:"chatSlice",
    initialState,
    reducers:{
        updateSelectedChatId:(state,action:PayloadAction<ChatIntitalState['selectedChatId']>)=>{
            state.selectedChatId=action.payload
        },
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
        updateFilteredChats:(state,action:PayloadAction<ChatWithUnreadMessages[]>)=>{
            state.filteredChats = action.payload;
        }

    },
})

// exporting selector
export const selectSelectedChatId = (state:RootState)=>state.chatSlice.selectedChatId
export const selectSelectedChatDetails = (state:RootState)=>state.chatSlice.selectedChatDetails
export const selectFilteredChats = (state:RootState)=>state.chatSlice.filteredChats

// exporting actions
export const {
    updateSelectedChatId,
    updateSelectedChatDetails,
    updateUserTyping,
    removeUserTyping,
    updateSelectedChatMembers,
    removeSelectedChatMembers,
    updateChatNameOrAvatar,
    updateFilteredChats,
} = chatSlice.actions

export default chatSlice