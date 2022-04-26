/* eslint-disable react/no-array-index-key */
import { SearchOutlined } from '@ant-design/icons';
import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { clearRecentSearch, removeSelectedRecent } from 'redux/actions/filterActions';
import { apiCall } from 'services/firebase';


let city = [];
apiCall('/quest/city_list').then(data => {
  city = data;
});

let clients = []
apiCall('/quest/client_list').then(json => {
    clients = json
})

let c = localStorage.getItem('city');
if (!c) {
    localStorage.setItem('city', '1');
}


const SearchBar = () => {
  console.log(city)
  const [searchInput, setSearchInput] = useState('');
  const { filter, isLoading } = useSelector((state) => ({
    filter: state.filter,
    isLoading: state.app.loading
  }));
  const searchbarRef = useRef(null);
  const history = useHistory();

  const dispatch = useDispatch();
  const isMobile = window.screen.width <= 800;

  const onSearchChange = (e) => {
    const val = e.target.value.trimStart();
    setSearchInput(val);
  };

  const onKeyUp = (e) => {
    if (e.keyCode === 13) {
      // dispatch(setTextFilter(searchInput));
      e.target.blur();
      searchbarRef.current.classList.remove('is-open-recent-search');

      if (isMobile) {
        history.push('/');
      }

      history.push(`/search/${searchInput.trim().toLowerCase()}`);
    }
  };

  const recentSearchClickHandler = (e) => {
    const searchBar = e.target.closest('.searchbar');

    if (!searchBar) {
      searchbarRef.current.classList.remove('is-open-recent-search');
      document.removeEventListener('click', recentSearchClickHandler);
    }
  };

  const onFocusInput = (e) => {
    e.target.select();

    if (filter.recent.length !== 0) {
      searchbarRef.current.classList.add('is-open-recent-search');
      document.addEventListener('click', recentSearchClickHandler);
    }
  };

  const onClickRecentSearch = (keyword) => {
    // dispatch(setTextFilter(keyword));
    searchbarRef.current.classList.remove('is-open-recent-search');
    history.push(`/search/${keyword.trim().toLowerCase()}`);
  };

  const onClearRecent = () => {
    dispatch(clearRecentSearch());
  };
  const currentClient = localStorage.getItem('client');

    return <div>
      Кешбек:&nbsp; {currentClient ? clients.find(item => item.contact == currentClient).cashback : 0}&nbsp;
      Ваш город:&nbsp;
        <select defaultValue={c} onChange={event => {
            localStorage.setItem('city', event.target.value);
            document.location.reload();
        }}>
            {city.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
        {!localStorage.getItem('client') && <button onClick={() => {
            const phone = prompt('Введите телефон');
            console.log(phone)
            localStorage.setItem('client', phone);
            setSearchInput('123')
        }}>Войти</button> }
    </div>
  return (
    <>
      <div className="searchbar" ref={searchbarRef}>
        <SearchOutlined className="searchbar-icon" />
        <input
          className="search-input searchbar-input"
          onChange={onSearchChange}
          onKeyUp={onKeyUp}
          onFocus={onFocusInput}
          placeholder="Search product..."
          readOnly={isLoading}
          type="text"
          value={searchInput}
        />
        {filter.recent.length !== 0 && (
          <div className="searchbar-recent">
            <div className="searchbar-recent-header">
              <h5>Recent Search</h5>
              <h5
                className="searchbar-recent-clear text-subtle"
                onClick={onClearRecent}
                role="presentation"
              >
                Clear
              </h5>
            </div>
            {filter.recent.map((item, index) => (
              <div
                className="searchbar-recent-wrapper"
                key={`search-${item}-${index}`}
              >
                <h5
                  className="searchbar-recent-keyword margin-0"
                  onClick={() => onClickRecentSearch(item)}
                  role="presentation"
                >
                  {item}
                </h5>
                <span
                  className="searchbar-recent-button text-subtle"
                  onClick={() => dispatch(removeSelectedRecent(item))}
                  role="presentation"
                >
                  X
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default SearchBar;
