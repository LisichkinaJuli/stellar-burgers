import { FC, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchFeed,
  selectFeedOrders,
  selectFeedIsLoading
} from '../../services/slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const orders = useSelector(selectFeedOrders);
  const isLoading = useSelector(selectFeedIsLoading);

  useEffect(() => {
    if (orders.length === 0) {
      dispatch(fetchFeed());
    }
  }, [dispatch, orders.length]);

  const handleGetFeeds = useCallback(() => {
    dispatch(fetchFeed());
  }, [dispatch]);

  if (isLoading && !orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
