import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import { TOrder } from '@utils-types';
import { RootState } from '../store';

// Асинхронный Thunk для получения общей ленты заказов с сервера
export const fetchFeed = createAsyncThunk('feed/fetchFeed', async () => {
  const data = await getFeedsApi();
  return data;
});

type TFeedState = {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  orders: [],
  total: 0,
  totalToday: 0,
  isLoading: false,
  error: null
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFeed.fulfilled, (state, action) => {
        state.isLoading = false;

        // Проверка структуры ответа API
        if (Array.isArray(action.payload)) {
          state.orders = action.payload;
        } else if (action.payload && typeof action.payload === 'object') {
          state.orders = action.payload.orders || [];
          state.total = action.payload.total || 0;
          state.totalToday = action.payload.totalToday || 0;
        }
      })
      .addCase(fetchFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ленту заказов';
      });
  }
});

// Селекторы для безопасного чтения состояния ленты из компонентов
export const selectFeedOrders = (state: RootState) => state.feed.orders;
export const selectFeedTotal = (state: RootState) => state.feed.total;
export const selectFeedTotalToday = (state: RootState) => state.feed.totalToday;
export const selectFeedIsLoading = (state: RootState) => state.feed.isLoading;

export default feedSlice.reducer;
