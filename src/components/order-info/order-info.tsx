import { FC, useMemo, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient, TOrder } from '@utils-types';
import { getOrderByNumberApi } from '../../utils/burger-api';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();

  const { ingredients } = useSelector((state) => state.ingredients);
  const { orders } = useSelector((state) => state.feed);

  const [localOrderData, setLocalOrderData] = useState<TOrder | null>(null);

  useEffect(() => {
    if (!number) return;

    const foundInRedux = orders.find((item) => item.number === Number(number));

    if (foundInRedux) {
      setLocalOrderData(foundInRedux);
    } else {
      getOrderByNumberApi(Number(number))
        .then((res) => {
          if (res.orders && res.orders.length > 0) {
            setLocalOrderData(res.orders[0]);
          }
        })
        .catch((err) => {
          console.error('Ошибка при получении данных заказа:', err);
        });
    }
  }, [orders, number]);

  const orderData = localOrderData;

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
