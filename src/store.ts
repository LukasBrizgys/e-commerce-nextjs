import {
    Action,
    configureStore,
    ThunkAction
} from '@reduxjs/toolkit';
import modalReducer from '../src/store/modalSlice';
import cartReducer from '../src/store/cartSlice';
import alertReducer from '../src/store/alertSlice';
export const store = configureStore({
    reducer:{
        modal:modalReducer,
        cart: cartReducer,
        alert: alertReducer
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