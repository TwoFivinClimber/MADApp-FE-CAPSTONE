/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import { Form } from 'react-bootstrap';
import { getEventCities } from '../api/events/mergedEvents';
// import DayCard from '../components/DayCard';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import { getCategorySelect } from '../api/categories';
import { getPublicEvents } from '../api/events/eventData';

function Search() {
  const router = useRouter();
  const input = router.query.keyword ? router.query.keyword : '';
  const [content, setContent] = useState([]);
  const [results, setResults] = useState([]);
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [city, setCity] = useState('');

  const keywordFilter = (array) => {
    const keywordResults = array.filter((event) => event.title.toLowerCase().includes(keyword.toLowerCase()));
    return keywordResults;
  };

  const categoryFilter = (array) => {
    const categoryResults = array.filter((event) => event.category.toLowerCase() === category.toLowerCase());
    return categoryResults;
  };

  const cityFilter = (array) => {
    const cityResults = array.filter((event) => event.city.toLowerCase() === city.toLowerCase());
    return cityResults;
  };

  const getResults = () => {
    if (keyword && city && category) {
      const filteredCities = cityFilter(content);
      const cityAndCategory = categoryFilter(filteredCities);
      setResults(keywordFilter(cityAndCategory));
    } else if (keyword && category) {
      const filteredCategories = categoryFilter(content);
      setResults(keywordFilter(filteredCategories));
    } else if (keyword && city) {
      const filteredCities = cityFilter(content);
      setResults(keywordFilter(filteredCities));
    } else if (city && category) {
      const filteredCities = cityFilter(content);
      setResults(categoryFilter(filteredCities));
    } else if (city) {
      setResults(cityFilter(content));
    } else if (category) {
      setResults(categoryFilter(content));
    } else if (keyword) {
      setResults(keywordFilter(content));
    } else {
      setResults(content);
    }
  };

  const handleInput = (e) => {
    setKeyword(e.target.value);
  };

  const handleCitySelect = (target) => {
    if (target) {
      const { value } = target;
      setCity(value);
    } else {
      setCity('');
    }
  };

  const handleCatSelect = (target) => {
    if (target) {
      const { value } = target;
      setCategory(value);
    } else {
      setCategory('');
    }
  };

  const getTheContent = () => {
    getPublicEvents().then((contentArr) => {
      setContent(contentArr);
      setKeyword(input);
    });
  };

  useEffect(() => {
    getTheContent();
  }, [router]);

  useEffect(() => {
    getResults();
  }, [content, keyword, category, city]);

  return (
    <>
      <div className="searchActionsDiv">
        <h5>Search by Keyword</h5>
        <SearchBar onChange={handleInput} setKeyword={setKeyword} keyword={keyword} />
        <h5>Refine Your Search</h5>
        <Form.Label>Category Search</Form.Label>
        <AsyncSelect
          isClearable
          defaultOptions
          loadOptions={getCategorySelect}
          onChange={handleCatSelect}
        />
        <Form.Label>City Search</Form.Label>
        <AsyncSelect
          isClearable
          defaultOptions
          loadOptions={getEventCities}
          onChange={handleCitySelect}
        />
      </div>
      <div className="searchResultsDiv">
        {results?.map((event) => (
          <EventCard key={event.firebaseKey} onUpdate={getTheContent} obj={event} />
        ))}
      </div>
    </>
  );
}

export default Search;
