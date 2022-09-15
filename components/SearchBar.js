import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function SearchBar({ setContent, onChange, keyword }) {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { value } = e.target;
    if (router.pathname === '/search') {
      setContent(value);
      console.warn('no path');
    } else {
      setSearchInput(value);
      console.warn('regpath');
    }
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push({
        pathname: '/search',
        query: { keyword: searchInput },
      });
    }
    if (router.pathname === '/search') {
      onChange(e);
    }
  };

  return (
    <>
      <Form>
        <Form.Control
          type="search"
          placeholder="Search by Event Title"
          className="me-2"
          aria-label="Search"
          value={keyword}
          onChange={handleChange}
          onKeyDown={handleEnter}
          name="keyword"
        />
      </Form>
    </>
  );
}

SearchBar.propTypes = {
  onChange: PropTypes.func.isRequired,
  keyword: PropTypes.string.isRequired,
  setContent: PropTypes.func.isRequired,
};

// SearchBar.defaultProps = {
//   keyword: '',
// };

export default SearchBar;
