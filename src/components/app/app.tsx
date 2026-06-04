import { useEffect } from 'react';
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';

import { useDispatch, useSelector } from '../../services/store';
import { fetchIngredients } from '../../services/slices/ingredientsSlice';
import { checkUserAuth } from '../../services/slices/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';

import '../../index.css';
import styles from './app.module.css';

import { AppHeader, Modal, IngredientDetails, OrderInfo } from '@components';

import { Preloader } from '@ui';

const App = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const feedMatch = useMatch('/feed/:number');
  const profileOrderMatch = useMatch('/profile/orders/:number');

  const orderNumber =
    feedMatch?.params.number || profileOrderMatch?.params.number;

  const {
    ingredients,
    loading: isIngredientsLoading,
    error
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, [dispatch]);

  const backgroundLocation = location.state?.background;

  const closeModal = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : (
        <>
          <AppHeader />

          <Routes location={backgroundLocation || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />

            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />

            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />

            <Route path='/feed/:number' element={<OrderInfo />} />
            <Route path='/ingredients/:id' element={<IngredientDetails />} />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <OrderInfo />
                </ProtectedRoute>
              }
            />

            <Route path='*' element={<NotFound404 />} />
          </Routes>

          {backgroundLocation && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal title={`#${orderNumber}`} onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={closeModal}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal title={`#${orderNumber}`} onClose={closeModal}>
                    <OrderInfo />
                  </Modal>
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
