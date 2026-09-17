import feedReducer, { fetchFeed } from '../slices/feedSlice';
import { TOrder } from '@utils-types';

describe('Тесты обработки асинхронных экшенов (feed)', () => {
  const initialState = {
    orders: [],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null
  };

  it('должен обрабатывать экшен начала запроса (pending)', () => {
    const action = { type: fetchFeed.pending.type };
    const state = feedReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать экшен успешного выполнения запроса (fulfilled)', () => {
    const mockPayload = {
      orders: [{ _id: 'order-1', number: 111 } as TOrder],
      total: 500,
      totalToday: 10
    };

    const action = {
      type: fetchFeed.fulfilled.type,
      payload: mockPayload
    };
    const state = feedReducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockPayload.orders);
    expect(state.total).toBe(mockPayload.total);
    expect(state.totalToday).toBe(mockPayload.totalToday);
  });

  it('должен обрабатывать экшен ошибки запроса (rejected)', () => {
    const mockErrorMessage = 'Не удалось загрузить ленту заказов';

    const action = {
      type: fetchFeed.rejected.type,
      error: { message: mockErrorMessage }
    };
    const state = feedReducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(mockErrorMessage);
  });
});
