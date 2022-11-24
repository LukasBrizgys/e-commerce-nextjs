import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AlertType } from "../enums/alert.enums";
import { RootState } from "../store";

export type AlertState = {
    show : boolean,
    type? : AlertType,
    message? : string
}
export interface IOpenAlert {
    type : AlertType,
    message : string
}
const initialState : AlertState = {
    show:false,
    type:undefined,
    message:undefined
}
export const alertSlice = createSlice({
    name:'alert',
    initialState: initialState,
    reducers:{
        showAlert: (state, action : PayloadAction<IOpenAlert>) => {
            state.show = true;
            state.message = action.payload.message
            state.type = action.payload.type;
        },
        closeAlert: (state) => {
            state.show = false;
            state.message = undefined;
            state.type = undefined;
        }
    }
})
export const {
    showAlert, closeAlert
} = alertSlice.actions;
export const selectAlert = (state : RootState) => state.alert;
export default alertSlice.reducer;