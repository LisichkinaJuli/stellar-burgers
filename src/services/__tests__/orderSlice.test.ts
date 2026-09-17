import orderReducer, {
  createOrder,
  clearOrderData
} from '../slices/orderSlice';
import { TOrder } from '@utils-types';

describe('Тесты редьюсера слайса order', () => {
  const initialState = {
    orderModalData: null,
    orderRequest: false,
    orders: [],
    isHistoryLoading: false,
    orderByNumber: null,
    error: null
  };

  it('должен очищать данные заказа при вызове экшена clearOrderData', () => {
    const filledState = {
      ...initialState,
      orderModalData: { _id: 'order-123', number: 54791 } as TOrder
    };

    const state = orderReducer(filledState, clearOrderData());
    expect(state.orderModalData).toBeNull();
  });

  it('должен обрабатывать экшен начала создания заказа (createOrder.pending)', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать успешное создание заказа (createOrder.fulfilled)', () => {
    const mockOrder = { _id: 'order-123', number: 54791 } as TOrder;

    const action = {
      type: createOrder.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer({ ...initialState, orderRequest: true }, action);

    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(mockOrder);
  });
});
