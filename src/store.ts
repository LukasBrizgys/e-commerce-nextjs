import {
    Action,
    configureStore,
    ThunkAction
} from '@reduxjs/toolkit';
import modalReducer from '../src/store/modalSlice';
import cartReducer from '../src/store/cartSlice';
export const store = configureStore({
    reducer:{
        modal:modalReducer,
        cart: cartReducer
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