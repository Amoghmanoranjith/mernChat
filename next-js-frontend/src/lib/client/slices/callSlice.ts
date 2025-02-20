import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type InitialState = {
    isInCall:boolean;
    callHistoryId:string | null;
    myGlobalStream:MediaStream | null | undefined;
};

const initialState: InitialState = {
    isInCall:false,
    callHistoryId:null,
    myGlobalStream:undefined
};

const callSlice = createSlice({
  name: "callSlice",
  initialState,
  reducers: {

    setIsInCall:(state,action:PayloadAction<boolean>)=>{
        state.isInCall = action.payload
    },
    setCallHistoryId:(state,action:PayloadAction<string | null>)=>{
        state.callHistoryId = action.payload
    },
    setMyGlobalStream:(state,action:PayloadAction<MediaStream | null | undefined>)=>{
        state.myGlobalStream = action.payload
    }
    
  },
});

export const selectIsInCall = (state: RootState) => state.callSlice.isInCall;
export const selectCallHistoryId = (state: RootState) => state.callSlice.callHistoryId;
export const selectMyGlobalStream = (state: RootState) => state.callSlice.myGlobalStream;

export const {
    setIsInCall,
    setCallHistoryId,
    setMyGlobalStream
} = callSlice.actions;

export default callSlice
