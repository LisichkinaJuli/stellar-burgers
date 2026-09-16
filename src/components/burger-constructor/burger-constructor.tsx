import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import {
  createOrder,
  clearOrderData,
  selectOrderRequest,
  selectOrderModalData
} from '../../services/slices/orderSlice';
import {
  clearConstructor,
  selectConstructorItems
} from '../../services/slices/constructorSlice';
import { selectUserData } from '../../services/slices/userSlice';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector(selectUserData);
  const constructorItems = useSelector(selectConstructorItems);
  const orderRequest = useSelector(selectOrderRequest);
  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      return navigate('/login');
    }

    const ingredientIds = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(ingredientIds))
      .unwrap()
      .then(() => {
        dispatch(clearConstructor());
      })
      .catch(() => {});
  };

  const closeOrderModal = () => {
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (total: number, item: TConstructorIngredient) => total + item.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
