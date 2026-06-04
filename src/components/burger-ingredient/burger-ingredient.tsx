import { FC, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from '../../services/store';
import { addIngredient } from '../../services/slices/constructorSlice';
import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = ({
  ingredient
}) => {
  const location = useLocation();
  const dispatch = useDispatch();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);

  const count = useMemo(() => {
    if (ingredient.type === 'bun') {
      return bun && bun._id === ingredient._id ? 2 : 0;
    }

    return ingredients
      ? ingredients.filter((item) => item._id === ingredient._id).length
      : 0;
  }, [bun, ingredients, ingredient]);

  const handleAdd = () => {
    dispatch(addIngredient(ingredient));
  };

  return (
    <BurgerIngredientUI
      ingredient={ingredient}
      count={count}
      handleAdd={handleAdd}
      locationState={{ background: location }}
    />
  );
};
