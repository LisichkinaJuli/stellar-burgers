import { FC, useMemo } from 'react';
import { useSelector } from '../../services/store';
import {
  selectFeedOrders,
  selectFeedTotal,
  selectFeedTotalToday
} from '../../services/slices/feedSlice';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

// Вспомогательная функция для фильтрации и получения номеров заказов
const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  // Получение актуальных данных из Redux хранилища с помощью селекторов
  const orders = useSelector(selectFeedOrders);
  const total = useSelector(selectFeedTotal);
  const totalToday = useSelector(selectFeedTotalToday);

  // Мемоизация объекта со статистикой заказов
  const feed = useMemo(
    () => ({
      total,
      totalToday
    }),
    [total, totalToday]
  );

  // Мемоизация списков готовых и находящихся в работе заказов
  const readyOrders = useMemo(() => getOrders(orders, 'done'), [orders]);
  const pendingOrders = useMemo(() => getOrders(orders, 'pending'), [orders]);

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feed}
    />
  );
};
