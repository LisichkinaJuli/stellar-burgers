import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { selectFeedOrders } from '../../services/slices/feedSlice';
import { selectOrders } from '../../services/slices/orderSlice';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  // Получение списков данных из хранилища через внешние селекторы
  const ingredients = useSelector(selectIngredients);
  const feedOrders = useSelector(selectFeedOrders);
  const profileOrders = useSelector(selectOrders);

  // Поиск конкретного заказа в общей ленте или в истории личного кабинета
  const orderData = useMemo(() => {
    if (!number) return null;
    const targetNumber = number.toString();

    const feedOrder = feedOrders.find(
      (item: TOrder) => item.number.toString() === targetNumber
    );
    if (feedOrder) return feedOrder;

    const profileOrder = profileOrders.find(
      (item: TOrder) => item.number.toString() === targetNumber
    );
    if (profileOrder) return profileOrder;

    return null;
  }, [number, feedOrders, profileOrders]);

  // Трансформация данных заказа и расчет стоимости для отображения
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find(
            (ing: TIngredient) => ing._id === item
          );
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
