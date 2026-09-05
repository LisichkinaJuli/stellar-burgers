import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi, getOrdersApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Асинхронный Thunk для отправки массива ID ингредиентов на сервер
export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredientIds: string[]) => {
    const res = await orderBurgerApi(ingredientIds);
    return res.order;
  }
);

// Асинхронный Thunk для получения истории заказов текущего пользователя
export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  async () => {
    const orders = await getOrdersApi();
    return orders;
  }
);

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orders: TOrder[];
  isHistoryLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  orders: [],
  isHistoryLoading: false,
  error: null
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
      // Создание заказа (createOrder)
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload as unknown as TOrder;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message || 'Не удалось оформить заказ';
      })

      // Получение истории заказов (fetchUserOrders)
      .addCase(fetchUserOrders.pending, (state) => {
        state.isHistoryLoading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.isHistoryLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.isHistoryLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить историю заказов';
      });
  }
});

export const { clearOrderData } = orderSlice.actions;

// Селекторы с использованием глобального типа RootState вместо any
export const selectOrderRequest = (state: RootState) =>
  state.order.orderRequest;
export const selectOrderModalData = (state: RootState) =>
  state.order.orderModalData;
export const selectOrderError = (state: RootState) => state.order.error;
export const selectOrders = (state: RootState) => state.order.orders;
export const selectIsHistoryLoading = (state: RootState) =>
  state.order.isHistoryLoading;

export default orderSlice.reducer;
