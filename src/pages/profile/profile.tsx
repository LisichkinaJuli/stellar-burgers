import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  updateUser,
  selectUserData,
  selectUserError
} from '../../services/slices/userSlice';
import { ProfileUI } from '@ui-pages';

export const Profile: FC = () => {
  const dispatch = useDispatch();

  const user = useSelector(selectUserData);
  const updateUserError = useSelector(selectUserError) || undefined;

  const [formValue, setFormValue] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  useEffect(() => {
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  }, [user]);

  const isFormChanged =
    formValue.name !== (user?.name || '') ||
    formValue.email !== (user?.email || '') ||
    !!formValue.password;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    if (!isFormChanged) return;

    const updatedData: Record<string, string> = {};
    if (formValue.name !== user?.name) updatedData.name = formValue.name;
    if (formValue.email !== user?.email) updatedData.email = formValue.email;
    if (formValue.password) updatedData.password = formValue.password;

    const resultAction = await dispatch(updateUser(updatedData));

    if (updateUser.fulfilled.match(resultAction)) {
      setFormValue((prevState) => ({ ...prevState, password: '' }));
    }
  };

  const handleCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    setFormValue({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      updateUserError={updateUserError}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
