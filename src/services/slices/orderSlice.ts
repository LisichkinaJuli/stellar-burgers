import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  orderBurgerApi,
  getOrdersApi,
  getOrderByNumberApi
} from '../../utils/burger-api';
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

// Асинхронный Thunk для точечного получения конкретного заказа по его номеру
export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const res = await getOrderByNumberApi(number);
    // Сервер возвращает массив orders, для поиска нам нужен конкретный заказ
    return res.orders[0];
  }
);

type TOrderState = {
  orderModalData: TOrder | null;
  orderRequest: boolean;
  orders: TOrder[];
  isHistoryLoading: boolean;
  orderByNumber: TOrder | null; // Поле хранилища для точечно запрошенного заказа
  error: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderRequest: false,
  orders: [],
  isHistoryLoading: false,
  orderByNumber: null,
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
      })

      // Точечное получение заказа по его номеру (fetchOrderByNumber)
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderByNumber = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.error =
          action.error.message || 'Не удалось загрузить заказ по номеру';
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
export const selectOrderByNumber = (state: RootState) =>
  state.order.orderByNumber;

export default orderSlice.reducer;
