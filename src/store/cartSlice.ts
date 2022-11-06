import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartComponent } from "../types/CartComponent.type";
import axios, { AxiosError, AxiosResponse } from 'axios';
import { RootState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
export interface IAddSuccessful {
    status: string,
    message: CartComponent
}
export interface IGetSuccessful {
    status:string,
    message: CartComponent[]
}
export interface IResponseFailed {
    status:string,
    message: string
}
export type ComponentToAdd = {
    componentId : number,
    quantity : number
}
export type CartState = {
    components: CartComponent[]
    totalQuantity : number,
    totalPrice: number
    loading: boolean
}
const initialState : CartState = {
    components : [],
    totalQuantity: 0,
    totalPrice: 0,
    loading: false
}
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async({componentId, quantity} : ComponentToAdd) => {
            const response : AxiosResponse<IAddSuccessful> = await axios.post('/api/cartComponent',{componentId, quantity});
            return response.data;
        

    }
)
const calculateTotalPrice = (items : CartComponent[]) => items.reduce((acc, current) => acc + current.Component.Pricing[0].price,0)
const calculateTotalQuantity = (items : CartComponent[]) => items.reduce((acc, current) => acc + current.quantity,0)
export const getCartItems = createAsyncThunk('cart/getCartItems', 
    async() => {
        const response : AxiosResponse<IGetSuccessful> = await axios.get('/api/cartComponent');
        return response.data;
    })
export const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers:{
        [HYDRATE]: (state, action) => {
            return {
                ...state,
                ...action.payload
            };
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addToCart.fulfilled, (state, action : PayloadAction<IAddSuccessful>) => {
            
            const index : number = state.components.findIndex((item : CartComponent) => item.componentId === action.payload.message.componentId);
            if(index === -1) {
                state.components.push(action.payload.message);
                
            }else{
                state.components[index] = action.payload.message;
            }
            state.totalPrice = calculateTotalPrice(state.components);
            state.totalQuantity = calculateTotalQuantity(state.components);
            state.loading = false;
        }),
        builder.addCase(addToCart.rejected, (state, action) => {
            state.loading = false;
        })
        builder.addCase(addToCart.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getCartItems.fulfilled, (state, action : PayloadAction<IGetSuccessful>) => {
            state.components = action.payload.message;
            state.totalPrice = calculateTotalPrice(action.payload.message);
            state.totalQuantity = calculateTotalQuantity(action.payload.message);
            state.loading = false;
        })
        builder.addCase(getCartItems.pending, (state) => {
            state.loading = true;
        })
        builder.addCase(getCartItems.rejected, (state) => {
            state.loading = false;
        })
    }
})
const reducer = cartSlice.reducer;
export const selectCart = (state : RootState) => state.cart;
export default cartSlice.reducer;