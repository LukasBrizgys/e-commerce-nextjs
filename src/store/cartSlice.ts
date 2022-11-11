import { createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import { CartComponent, CartComponentBase } from "../types/CartComponent.type";
import axios, { AxiosResponse } from 'axios';
import { RootState } from "../store";
import { HYDRATE } from "next-redux-wrapper";
export interface IAddSuccessful {
    status: string,
    message: CartComponent
}
export interface IRemoveSuccessful {
    status: string,
    message: CartComponentBase
}
export interface IUpdateSuccessful {
    status: string,
    message: CartComponentBase
}
export interface IGetSuccessful {
    status:string,
    message: CartComponent[]
}
export interface IResponseFailed {
    status:string,
    message: string
}
export type ComponentAdd = { 
    componentId : number;
    quantity : number
}
export type ComponentUpdate = ComponentAdd
export type ComponentToAddOrUpdate = {
    componentId : number,
    quantity : number,
    fallbackQuantity? : number
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
    async({componentId, quantity} : ComponentToAddOrUpdate) => {
            const response : AxiosResponse<IAddSuccessful> = await axios.post('/api/cartComponent',{componentId, quantity});
            return response.data;
        

    }
)
export const deleteCartItem = createAsyncThunk(
    'cart/deleteCartItem',
    async( componentId : number, thunkAPI ) => {
        const response : AxiosResponse<IRemoveSuccessful> = await axios.delete(`/api/cartComponent/${componentId}`);
        return response.data;
    }
)
export const setQuantity = createAsyncThunk<IUpdateSuccessful, ComponentUpdate, {rejectValue : ComponentUpdate}>(
    'cart/setQuantity',
    async({ componentId, quantity} : ComponentUpdate, { rejectWithValue}) => {
        try{
            const response : AxiosResponse<IUpdateSuccessful> = await axios.patch(`/api/cartComponent/${componentId}/quantity/${quantity}`)
            return response.data;
        }catch(error) {
            return rejectWithValue({ componentId, quantity});
        }
    }
)
const calculateTotalPrice = (items : CartComponent[]) => items.reduce((acc, current) => acc + current.Component.Pricing[0].price * current.quantity,0)
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
        })
        .addCase(addToCart.rejected, (state  : CartState) => {
            state.loading = false;
        })
        .addCase(addToCart.pending, (state : CartState) => {
            state.loading = true;
        })
        .addCase(getCartItems.fulfilled, (state : CartState, action : PayloadAction<IGetSuccessful>) => {
            state.components = action.payload.message;
            state.totalPrice = calculateTotalPrice(action.payload.message);
            state.totalQuantity = calculateTotalQuantity(action.payload.message);
            state.loading = false;
        })
        .addCase(getCartItems.pending, (state : CartState) => {
            
            state.loading = true;
        })
        .addCase(getCartItems.rejected, (state : CartState) => {
            state.loading = false;
        })
        .addCase(deleteCartItem.fulfilled, (state : CartState, action : PayloadAction<IRemoveSuccessful>) => {
            state.components = state.components.filter((component : CartComponent) => component.componentId !== action.payload.message.componentId);
            state.totalPrice = calculateTotalPrice(state.components);
            state.totalQuantity = calculateTotalQuantity(state.components);
            state.loading = false;
        })
        .addCase(deleteCartItem.rejected, (state : CartState) => {
            state.loading = false;
        })
        .addCase(deleteCartItem.pending, (state : CartState) => {
            state.loading = true;
        })
        .addCase(setQuantity.fulfilled, (state : CartState, action : PayloadAction<IUpdateSuccessful>) => {
            const index = state.components.findIndex((component : CartComponent) => component.componentId === action.payload.message.componentId);
            state.components[index].quantity = action.payload.message.quantity;
            state.totalPrice = calculateTotalPrice(state.components);
            state.totalQuantity = calculateTotalQuantity(state.components);
            state.loading = false;
        })
        .addCase(setQuantity.pending, (state : CartState) => {
            state.loading = true;
        })
        .addCase(setQuantity.rejected, (state: CartState) => {
            state.loading = false;
        })
        .addDefaultCase((state) => {
            state = initialState;
        })
    }
})
export const selectCart = (state : RootState) => state.cart;
export default cartSlice.reducer;