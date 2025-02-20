import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type InitialState = {
    isInCall:boolean;
    callHistoryId:string | null;
};

const initialState: InitialState = {
    isInCall:false,
    callHistoryId:null
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
    }
    
  },
});

export const selectIsInCall = (state: RootState) => state.callSlice.isInCall;
export const selectCallHistoryId = (state: RootState) => state.callSlice.callHistoryId;

export const {
    setIsInCall,
    setCallHistoryId,
} = callSlice.actions;

export default callSlice
