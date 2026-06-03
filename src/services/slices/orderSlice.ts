import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '../../utils/types';

export const orderBurger = createAsyncThunk(
  'order/create',
  async (ingredientIds: string[]) => {
    const response = await orderBurgerApi(ingredientIds);
    return response.order;
  }
);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => await getOrdersApi()
);

interface OrderState {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
  userOrders: TOrder[];
}

const initialState: OrderState = {
  orderModalData: null,
  orderRequest: false,
  error: null,
  userOrders: []
};

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrderData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(orderBurger.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(orderBurger.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload as unknown as TOrder;
      })
      .addCase(orderBurger.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Ошибка оформления заказа';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки истории заказов';
      });
  }
});

export const { clearOrderData } = orderSlice.actions;
export default orderSlice.reducer;
