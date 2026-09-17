import userReducer, { loginUser } from '../slices/userSlice';
import { TUser } from '@utils-types';

describe('Тесты обработки асинхронных экшенов (user)', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    isLoading: false,
    error: null
  };

  it('должен обрабатывать начало авторизации (loginUser.pending)', () => {
    const action = { type: loginUser.pending.type };
    const state = userReducer(initialState, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен обрабатывать успешную авторизацию (loginUser.fulfilled)', () => {
    const mockUser: TUser = {
      email: 'julilisichkina@yandex.ru',
      name: 'yulia'
    };

    const action = {
      type: loginUser.fulfilled.type,
      payload: mockUser
    };
    const state = userReducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(mockUser);
  });

  it('должен обрабатывать ошибку авторизации (loginUser.rejected)', () => {
    const mockErrorMessage = 'Ошибка авторизации';

    const action = {
      type: loginUser.rejected.type,
      error: { message: mockErrorMessage }
    };
    const state = userReducer({ ...initialState, isLoading: true }, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(mockErrorMessage);
  });
});
