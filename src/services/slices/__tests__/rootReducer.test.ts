import { rootReducer } from '../../store';

describe('Тестирование rootReducer', () => {
  test('Должен инициализировать корректное начальное состояние при неизвестном экшене', () => {
    const expectedState = rootReducer(undefined, { type: '@@INIT' });

    const result = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    expect(result).toEqual(expectedState);
  });
});
