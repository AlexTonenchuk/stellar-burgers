import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

describe('Тестирование ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  test('Должен возвращать начальное состояние', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('Должен обрабатывать fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);

    expect(result.loading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('Должен обрабатывать fetchIngredients.fulfilled', () => {
    const mockIngredients = [
      { _id: '1', name: 'Тестовая булка', type: 'bun', price: 100 }
    ];

    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const result = ingredientsReducer(initialState, action);

    expect(result.loading).toBe(false);
    expect(result.ingredients).toEqual(mockIngredients);
  });

  test('Должен обрабатывать fetchIngredients.rejected', () => {
    const mockError = 'Ошибка сети';

    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: mockError }
    };
    const result = ingredientsReducer(initialState, action);

    expect(result.loading).toBe(false);
    expect(result.error).toBe(mockError);
  });
});
