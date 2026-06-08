import constructorReducer, {
  addIngredient,
  removeIngredient,
  clearConstructor,
  updateIngredients
} from '../constructorSlice';

describe('Тестирование constructorSlice', () => {
  // Начальное пустое состояние конструктора
  const initialState = {
    bun: null,
    ingredients: []
  };

  // Фейковые ингредиенты со всеми полями для TypeScript
  const mockBun = {
    _id: '1',
    name: 'Краторная булка',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 100,
    image: 'image-bun.png',
    image_mobile: 'image-bun-mobile.png',
    image_large: 'image-bun-large.png',
    id: 'mock-uuid-bun'
  };

  const mockMain = {
    _id: '2',
    name: 'Биокотлета',
    type: 'main',
    proteins: 10,
    fat: 10,
    carbohydrates: 10,
    calories: 100,
    price: 200,
    image: 'image-main.png',
    image_mobile: 'image-main-mobile.png',
    image_large: 'image-main-large.png',
    id: 'mock-uuid-main'
  };

  test('Должен возвращать начальное состояние при неизвестном экшене', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(result).toEqual(initialState);
  });

  test('Должен добавлять булку в стейт', () => {
    const result = constructorReducer(initialState, {
      type: addIngredient.type,
      payload: mockBun
    });
    expect(result.bun).toEqual(mockBun);
  });

  test('Должен добавлять начинку в массив ингредиентов', () => {
    const result = constructorReducer(initialState, {
      type: addIngredient.type,
      payload: mockMain
    });
    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients).toEqual([mockMain]);
  });

  test('Должен удалять ингредиент по его id', () => {
    const stateWithIngredient = {
      bun: null,
      ingredients: [mockMain]
    };

    const result = constructorReducer(
      stateWithIngredient,
      removeIngredient(mockMain.id)
    );
    expect(result.ingredients).toHaveLength(0);
  });

  test('Должен полностью очищать конструктор', () => {
    const filledState = {
      bun: mockBun,
      ingredients: [mockMain]
    };

    const result = constructorReducer(filledState, clearConstructor());
    expect(result).toEqual(initialState);
  });

  test('Должен обновлять порядок ингредиентов (сортировка)', () => {
    const mockMain2 = { ...mockMain, id: 'mock-uuid-main-2', name: 'Соус' };
    const initialOrderState = {
      bun: null,
      ingredients: [mockMain, mockMain2]
    };

    const newOrder = [mockMain2, mockMain];

    const result = constructorReducer(
      initialOrderState,
      updateIngredients(newOrder)
    );
    expect(result.ingredients).toEqual(newOrder);
    expect(result.ingredients[0].name).toBe('Соус');
  });
});
