import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchUserOrders,
  selectOrders,
  selectIsHistoryLoading
} from '../../services/slices/orderSlice';
import { Preloader } from '@ui';
import { ProfileOrdersUI } from '@ui-pages';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectOrders);
  const isHistoryLoading = useSelector(selectIsHistoryLoading);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  if (isHistoryLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
