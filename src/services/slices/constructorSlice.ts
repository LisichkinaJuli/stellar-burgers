import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

type TConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addConstructorItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
        } else {
          state.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: nanoid() } as TConstructorIngredient
      })
    },
    removeConstructorItem: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    },
    moveConstructorItem: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const movedItem = state.ingredients[fromIndex];
      state.ingredients.splice(fromIndex, 1);
      state.ingredients.splice(toIndex, 0, movedItem);
    },
    clearConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const {
  addConstructorItem,
  removeConstructorItem,
  moveConstructorItem,
  clearConstructor
} = constructorSlice.actions;

export const selectConstructorItems = (state: RootState) =>
  state.burgerConstructor;

export default constructorSlice.reducer;
