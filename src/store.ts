import {
    Action,
    configureStore,
    ThunkAction
} from '@reduxjs/toolkit';
import modalReducer from '../src/store/modalSlice'
export const store = configureStore({
    reducer:{
        modal:modalReducer
    },
})
export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
ReturnType,
RootState,
unknown,
Action<string>
>