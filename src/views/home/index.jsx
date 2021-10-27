import { ArrowRightOutlined } from '@ant-design/icons';
import { MessageDisplay } from 'components/common';
import { ProductShowcaseGrid } from 'components/product';
import { FEATURED_PRODUCTS, RECOMMENDED_PRODUCTS, SHOP } from 'constants/routes';
import {
  useDocumentTitle, useFeaturedProducts, useRecommendedProducts, useScrollTop
} from 'hooks';
import React from 'react';
import { Link } from 'react-router-dom';


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
          <div className="banner-img"><img src="https://sun9-4.userapi.com/impg/c856032/v856032854/18081d/URjF9LnAhLM.jpg?size=576x768&quality=96&sign=04c3fef13b8804d9a3bd4d35d201ee10&type=album" alt="" /></div>
        </div>
        <div className="display">
          <div className="display-header">
            <h1>Квесты</h1>
            {/*<Link to={FEATURED_PRODUCTS}>See All</Link>*/}
          </div>
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
