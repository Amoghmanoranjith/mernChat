import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store/store";

type InitialState = {
    isInCall:boolean;
};

const initialState: InitialState = {
    isInCall:false
};

const callSlice = createSlice({
  name: "callSlice",
  initialState,
  reducers: {

    setIsInCall:(state,action:PayloadAction<boolean>)=>{
        state.isInCall = action.payload
    }
    
  },
});

export const selectIsInCall = (state: RootState) => state.callSlice.isInCall;

export const {
    setIsInCall
} = callSlice.actions;

export default callSlice
