import { combineSlices } from '@reduxjs/toolkit';
import constructorReducer from '../slices/constructorSlice';
import ingredientsReducer from '../slices/ingredientsSlice';
import feedReducer from '../slices/feedSlice';
import orderReducer from '../slices/orderSlice';
import userReducer from '../slices/userSlice';

describe('Тест настройки и работы rootReducer', () => {
  // Собираем rootReducer на основе ваших слайсов
  const rootReducer = combineSlices({
    burgerConstructor: constructorReducer,
    burgerIngredients: ingredientsReducer,
    feed: feedReducer,
    order: orderReducer,
    user: userReducer
  });

  it('Вызов rootReducer с undefined и UNKNOWN_ACTION возвращает корректное начальное состояние', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что состояние хранилища инициализировалось правильно и содержит все слайсы
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('burgerIngredients');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('order');
    expect(initialState).toHaveProperty('user');

    // Проверяем базовые дефолтные значения из ваших initialState
    expect(initialState.burgerConstructor.ingredients).toEqual([]);
    expect(initialState.burgerIngredients.ingredients).toEqual([]);
    expect(initialState.user.user).toBeNull();
  });
});
