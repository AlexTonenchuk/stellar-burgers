import { rootReducer } from '../../store';

describe('Тестирование rootReducer', () => {
  test('Должен инициализировать корректное начальное состояние при неизвестном экшене', () => {
    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toEqual({
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null
      },
      ingredients: {
        ingredients: [],
        loading: false,
        error: null
      },
      order: {
        orderModalData: null,
        orderRequest: false,
        error: null,
        userOrders: []
      },
      user: {
        user: null,
        isAuthChecked: false,
        error: null
      }
    });
  });
});
