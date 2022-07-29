import { ArrowRightOutlined } from '@ant-design/icons';
import { MessageDisplay, Fields } from 'components/common';
import { ProductShowcaseGrid } from 'components/product';
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP } from 'constants/routes';
import {
  useDocumentTitle, useFeaturedProducts, useRecommendedProducts, useScrollTop
} from 'hooks';
import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { apiCall, toUrlParams } from 'services/firebase';

import { useHistory } from 'react-router-dom';

const Input = Fields.TextFieldWrapped;
const srcList = [
  "https://sun9-81.userapi.com/impf/c841222/v841222361/42e29/SVuaH-X5oXI.jpg?size=1080x1080&quality=96&sign=850eff2c0cc6a3ac561932ddcf0ba4e2&type=album",
  "https://sun9-61.userapi.com/impf/2rJ49OJST4uvjZ156c4S-s0Vdk0SPIbKDH23Vg/O-dcUdhhGtk.jpg?size=480x604&quality=96&sign=147c0c629e311bef571f4c1bc4512858&type=album",
  "https://sun9-4.userapi.com/impg/c856032/v856032854/18081d/URjF9LnAhLM.jpg?size=576x768&quality=96&sign=04c3fef13b8804d9a3bd4d35d201ee10&type=album",
  "https://sun7-9.userapi.com/impg/PI5RwUMNOxA4RDX9C-k4Kxf0GyNzuDsvE7up3Q/2zjiKkMT9Co.jpg?size=857x1080&quality=96&sign=4b0ca3ce93170c93adfdf6f1f35402c1&type=album",
  "https://sun9-85.userapi.com/impg/ewzURAO5rBzGyDARtGOYULzkkA48XVV7QjJU6g/eiAw2ovIsGs.jpg?size=564x564&quality=96&sign=f31c516593b039ce0556c3224496948e&type=album",
];


const SomeBlock = (props) => {
  return <div className="display">
    <div className="product-display-grid">
      <div className="product-display" onClick={() => {

      }}>
        <div className="product-display-details">
          {props.children}
        </div>
      </div>
    </div>
  </div>
}


let user_id = localStorage.getItem('user_id');

window.apiCall = apiCall


let clients = []
apiCall('/quest/client_list').then(json => {
    clients = json
})

let login2='';
let pw='';
const Login = () => {
  if (user_id) {
    return null;
  }
  return <SomeBlock>
    Логин
    <br/>
    Телефон: <Input onChange={(v) => {login2=v}}/>
    <br/>
    Пароль: <Input onChange={(v) => {pw=v}}/>
    <button onClick={() => {
      const c =clients.find(item => {
      return item.contact == login2 && item.pw == pw;
      })
      if (c) {
        localStorage.setItem('user_id', c.id)
        location.reload();
      }
    }}>OK</button>
  </SomeBlock>
}


let email = '';
let contact = '';
let password = '';
const Reg = () => {
  if (user_id) {
    return null;
  }
  return <SomeBlock>
    Регистрация
    Телефон: <Input onChange={(v) => {
      contact = v;
    }}/>
    <br/>
    Пароль: <Input onChange={(v) => {password=v}}/>
    Почта: <Input onChange={(v) => {email=v}}/>
    <button onClick={() => {
      apiCall('/quest/create_client' + toUrlParams({password, contact, email})).then((res) => {
        if (res.error) {
        return
        }
        localStorage.setItem('user_id', res[0].id)
        location.reload();
      })
    }}>OK</button>
  </SomeBlock>
}
let srcI = 0;
function Banners() {
  const [src, setSrc] = useState(srcList[0]);
  useEffect(() => {
    console.log('set')
    setInterval(() => {
      console.log('inside')
      if (srcI === srcList.length - 1) {
        srcI = 0;
      } else {
        srcI++;
      }
      setSrc(srcList[srcI]);
    }, 4000)
  }, []);
  return <div className="banner-img"><img src={src} alt="" /></div>
}
const Home = () => {
  //useDocumentTitle('Salinaka | Home');
  useScrollTop();

  const {
    featuredProducts,
    fetchFeaturedProducts,
    isLoading: isLoadingFeatured,
    error: errorFeatured
  } = useFeaturedProducts(6);
  const {
    recommendedProducts,
    fetchRecommendedProducts,
    isLoading: isLoadingRecommended,
    error: errorRecommended
  } = useRecommendedProducts(6);

  const history = useHistory();

  return (
    <main className="content">
      <div className="home">
        <div className="banner">
          <div className="banner-desc">
            <h1 className="text-thin">
              <strong>Тут</strong>
              &nbsp;будет&nbsp;
              <strong>текст</strong>
            </h1>
            <p>
              Описание магазина
            </p>
            <br />
            {/*<Link to={SHOP} className="button">
              К товарам &nbsp;
              <ArrowRightOutlined />
            </Link>*/}
          </div>
          <Banners/>
        </div>
        <Login/>
        <Reg/>
        <div className="display">
          <div className="product-display-grid">
            <div className="product-display" onClick={() => {
              history.push('/cert');
            }}>
              <div className="product-display-details">
                Сертификат
              </div>
            </div>
          </div>
        </div>
        <div className="display">
          {/*<div className="display-header">*/}
            {/*<h1>Квесты</h1>*/}
            {/*<Link to={FEATURED_PRODUCTS}>See All</Link>*/}
          {/*</div>*/}
          {(errorFeatured && !isLoadingFeatured) ? (
            <MessageDisplay
              message={errorFeatured}
              action={fetchFeaturedProducts}
              buttonLabel="Try Again"
            />
          ) : (
            <ProductShowcaseGrid
              products={featuredProducts}
              skeletonCount={6}
            />
          )}
        </div>
        {/*<div className="display">*/}
          {/*<div className="display-header">*/}
            {/*<h1>Recommended Products</h1>*/}
            {/*<Link to={RECOMMENDED_PRODUCTS}>See All</Link>*/}
          {/*</div>*/}
          {/*{(errorRecommended && !isLoadingRecommended) ? (*/}
            {/*<MessageDisplay*/}
              {/*message={errorRecommended}*/}
              {/*action={fetchRecommendedProducts}*/}
              {/*buttonLabel="Try Again"*/}
            {/*/>*/}
          {/*) : (*/}
            {/*<ProductShowcaseGrid*/}
              {/*products={recommendedProducts}*/}
              {/*skeletonCount={6}*/}
            {/*/>*/}
          {/*)}*/}
        {/*</div>*/}
      </div>
    </main>
  );
};

export default Home;
