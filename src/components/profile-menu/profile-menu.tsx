import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { logoutUser } from '../../services/slices/userSlice';
import { ProfileMenuUI } from '@ui';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Обработчик выхода пользователя из учетной записи
  const handleLogout = async () => {
    const resultAction = await dispatch(logoutUser());

    if (logoutUser.fulfilled.match(resultAction)) {
      navigate('/login', { replace: true });
    }
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
