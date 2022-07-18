import { displayActionMessage } from 'helpers/utils';
import { useDispatch, useSelector } from 'react-redux';
import { addToBasket as dispatchAddToBasket, removeFromBasket } from 'redux/actions/basketActions';

const useBasket = () => {
  const old = useSelector((state) => ({ basket: state.basket }));
  const { basket } = window;
  const dispatch = useDispatch();

  const isItemOnBasket = (id) => !!basket.find((item) => item.id === id);

  const addToBasket = (product) => {
    if (isItemOnBasket(product.id)) {
      window.basket =window.basket.filter(item => {
        return item.id !== product.id;
      });
      displayActionMessage('Item removed from basket', 'info');
    } else {
      window.basket.push(product);
      displayActionMessage('Item added to basket', 'success');
    }
    dispatch(dispatchAddToBasket({id: Math.random()}));
  };

  return { basket, isItemOnBasket, addToBasket };
};

export default useBasket;
