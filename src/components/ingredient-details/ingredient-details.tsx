import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { selectIngredients } from '../../services/slices/ingredientsSlice';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(selectIngredients);

  // Ищем нужный ингредиент по его уникальному _id с мемоизацией вычислений
  const ingredientData = useMemo(
    () => ingredients.find((item) => item._id === id),
    [ingredients, id]
  );

  if (!ingredientData) {
    return <Preloader />;
  }

  // Заворачиваем в центрирующий контейнер с заголовком, как в макете Figma при открытии на отдельной странице
  return (
    <div
      className='flex flex-column styles.container'
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '80vh',
        textAlign: 'center'
      }}
    >
      <h2
        className='text text_type_main-large mt-10'
        style={{ width: '100%', maxWidth: '600px', textAlign: 'center' }}
      >
        Детали ингредиента
      </h2>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </div>
  );
};
