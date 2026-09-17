import constructorReducer, {
  addConstructorItem,
  removeConstructorItem,
  moveConstructorItem
} from '../slices/constructorSlice';
import { TIngredient, TConstructorIngredient } from '@utils-types';

describe('Тесты редьюсера конструктора бургера', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const mockBun: TIngredient = {
    _id: '643d69a5c3f7b9001cfa093c',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url'
  };

  const mockMain: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0941',
    name: 'Биокотлета из марсианской Магнолии',
    type: 'main',
    proteins: 44,
    fat: 26,
    carbohydrates: 85,
    calories: 643,
    price: 424,
    image: 'url',
    image_mobile: 'url',
    image_large: 'url'
  };

  it('должен обрабатывать экшен добавления булки в конструктор', () => {
    const action = addConstructorItem(mockBun);
    const state = constructorReducer(initialState, action);

    expect(state.bun).toEqual(
      expect.objectContaining({
        _id: mockBun._id,
        id: expect.any(String) // Используем expect.any, так как в prepare генерируется nanoid()
      })
    );
  });

  it('должен обрабатывать экшен добавления начинки в конструктор', () => {
    const action = addConstructorItem(mockMain);
    const state = constructorReducer(initialState, action);

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: mockMain._id,
        id: expect.any(String)
      })
    );
  });

  it('должен обрабатывать экшен удаления ингредиента из конструктора', () => {
    const filledState = {
      bun: null,
      ingredients: [
        { ...mockMain, id: 'unique-test-id' } as TConstructorIngredient
      ]
    };

    const action = removeConstructorItem('unique-test-id');
    const state = constructorReducer(filledState, action);

    expect(state.ingredients).toHaveLength(0);
  });

  it('должен обрабатывать экшен изменения порядка ингредиентов в начинке', () => {
    const item1 = {
      ...mockMain,
      id: 'id-1',
      name: 'Котлета'
    } as TConstructorIngredient;
    const item2 = {
      ...mockMain,
      id: 'id-2',
      name: 'Соус'
    } as TConstructorIngredient;

    const filledState = {
      bun: null,
      ingredients: [item1, item2] // Изначально порядок: Котлета(0), Соус(1)
    };

    const action = moveConstructorItem({ fromIndex: 0, toIndex: 1 });
    const state = constructorReducer(filledState, action);

    expect(state.ingredients[0].id).toBe('id-2'); // Соус стал первым
    expect(state.ingredients[1].id).toBe('id-1'); // Котлета стала второй
  });
});
