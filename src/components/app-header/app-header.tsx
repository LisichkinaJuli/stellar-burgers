import { FC } from 'react';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../services/slices/userSlice';
import { AppHeaderUI } from '@ui';

export const AppHeader: FC = () => {
  // Получаем данные авторизованного пользователя из Redux
  const user = useSelector(selectUserData);

  // Если пользователь вошел в систему, берем его имя для отображения в шапке
  const userName = user ? user.name : '';

  return <AppHeaderUI userName={userName} />;
};
