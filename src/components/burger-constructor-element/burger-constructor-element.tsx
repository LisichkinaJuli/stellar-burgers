import { FC, memo } from 'react';
import { useDispatch } from '../../services/store';
import {
  removeConstructorItem,
  moveConstructorItem
} from '../../services/slices/constructorSlice';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    // Перемещение ингредиента на одну позицию вверх в списке
    const handleMoveUp = () => {
      if (index === 0) return;
      dispatch(moveConstructorItem({ fromIndex: index, toIndex: index - 1 }));
    };

    // Перемещение ингредиента на одну позицию вниз в списке
    const handleMoveDown = () => {
      if (index === totalItems - 1) return;
      dispatch(moveConstructorItem({ fromIndex: index, toIndex: index + 1 }));
    };

    // Удаление ингредиента из конструктора по его уникальному ID
    const handleClose = () => {
      dispatch(removeConstructorItem(ingredient.id));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
