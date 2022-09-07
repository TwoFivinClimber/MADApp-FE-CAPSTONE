import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { Form } from 'react-bootstrap';

function SearchBar() {
  const [searchInput, setSearchInput] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { value } = e.target;
    setSearchInput(value);
  };

  const handleEnter = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      router.push({
        pathname: '/search',
        query: { keyword: searchInput },
      });
    }
  };

  return (
    <>
      <Form>
        <Form.Control
          type="search"
          placeholder="Search by Title or City"
          className="me-2"
          aria-label="Search"
          value={searchInput}
          onChange={handleChange}
          onKeyDown={handleEnter}
        />
      </Form>
    </>
  );
}

export default SearchBar;
