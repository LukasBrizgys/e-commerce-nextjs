import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import { HYDRATE } from "next-redux-wrapper";
import { ModalType } from "../enums/modal.enums";
import { RootState } from "../store";
export type ModalState = {
    type: ModalType | null,
    open: boolean
}
const initialState : ModalState = {
    type: null,
    open: false
}
export const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers:{
        openModal : (state, action: PayloadAction<ModalType>) => {
            state.type = action.payload
            state.open = true
        },
        closeModal: (state) => state = initialState,
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload
            };
        },
    }
})
export const {
    openModal,
    closeModal,
} = modalSlice.actions

export const selectModal = (state : RootState) => state.modal;

export default modalSlice.reducer;