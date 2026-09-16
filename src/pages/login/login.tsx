import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { loginUser, selectUserError } from '../../services/slices/userSlice';
import { LoginUI } from '@ui-pages';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  // Достаем текст ошибки из Redux-стора, если server вернет "Неверный логин или пароль"
  const errorText = useSelector(selectUserError) || undefined;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Простая валидация перед отправкой, чтобы не спамить сервер пустыми запросами
    if (!email || !password) {
      return;
    }

    // Отправляем экшен в созданный нами userSlice
    await dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
