import React from 'react';
import { Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

function SearchBar({ setKeyword, keyword }) {
  const handleChange = (e) => {
    const { value } = e.target;
    setKeyword(value);
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
          name="keyword"
        />
      </Form>
    </>
  );
}

SearchBar.propTypes = {
  keyword: PropTypes.string.isRequired,
  setKeyword: PropTypes.func.isRequired,
};

export default SearchBar;
