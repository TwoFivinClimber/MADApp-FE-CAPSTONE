/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Form } from 'react-bootstrap';
import { getEventCities, getEventsAndDays } from '../api/events/mergedEvents';
import DayCard from '../components/DayCard';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { getCategorySelect } from '../api/categories';

function Search() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');
  const input = router.query.keyword ? router.query.keyword : '';

  const getTheContent = () => {
    setKeyword(input);
    getEventsAndDays().then((contentArr) => {
      setResults(contentArr);
    });
  };

  const handleSelect = (target) => {
    if (target) {
      const { name, value } = target;
      if (name === 'category') {
        setCategory(value);
      } if (name === 'city') {
        setCity(value);
      }
    }
    console.warn(keyword, city, category);
  };

  useEffect(() => {
    getTheContent();
    setResults([]);
  }, [router.query.keyword]);

  return (
    <>
      <div className="searchActionsDiv">
        <h5>Search by Keyword</h5>
        <SearchBar />
        <h5>Refine Your Search</h5>
        <Form.Label>Category Search</Form.Label>
        <AsyncSelect
          isClearable
          defaultOptions
          loadOptions={getCategorySelect}
          onChange={handleSelect}
        />
        <Form.Label>City Search</Form.Label>
        <AsyncSelect
          isClearable
          loadOptions={getEventCities}
          onChange={handleSelect}
        />
      </div>
      <div className="searchResultsDiv">
        {results.map((content) => (
          content.category ? <EventCard key={content.firebaseKey} obj={content} /> : <DayCard key={content.firebaseKey} obj={content} />
        ))}
      </div>
    </>
  );
}

export default Search;
