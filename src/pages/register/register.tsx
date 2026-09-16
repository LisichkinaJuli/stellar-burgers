import { FC, SyntheticEvent, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser, selectUserError } from '../../services/slices/userSlice';
import { RegisterUI } from '@ui-pages';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();

  const errorText = useSelector(selectUserError) || undefined;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Проверяем, что пользователь заполнил все три поля
    if (!userName || !email || !password) {
      return;
    }

    // Отправляем данные в наш userSlice на регистрацию
    await dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={errorText}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
