import ingredientsReducer, {
  fetchIngredients
} from '../slices/ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('Тесты обработки асинхронных экшенов (ingredients)', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  it('должен обрабатывать экшен начала запроса (pending / Request)', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать экшен успешного выполнения запроса (fulfilled / Success)', () => {
    const mockIngredients: TIngredient[] = [
      { _id: '1', name: 'Марсианская булка', type: 'bun' } as TIngredient
    ];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  it('должен обрабатывать экшен ошибки запроса (rejected / Failed)', () => {
    const mockErrorMessage = 'Ошибка соединения с космическим сервером';

    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: mockErrorMessage }
    };
    const state = ingredientsReducer(
      { ...initialState, isLoading: true },
      action
    );

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(mockErrorMessage);
  });
});
