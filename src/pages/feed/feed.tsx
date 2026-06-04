import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { fetchFeeds } from '../../services/slices/feedSlice';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';

export const Feed: FC = () => {
  const dispatch = useDispatch();

  const { orders, isLoading: isFeedLoading } = useSelector(
    (state) => state.feed
  );

  const { ingredients, loading: isIngredientsLoading } = useSelector(
    (state) => state.ingredients
  );

  useEffect(() => {
    dispatch(fetchFeeds());

    if (!ingredients.length) {
      dispatch(fetchIngredients());
    }
  }, [dispatch, ingredients.length]);

  const handleGetFeeds = () => {
    dispatch(fetchFeeds());
  };

  if (
    isFeedLoading ||
    isIngredientsLoading ||
    !orders.length ||
    !ingredients.length
  ) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
