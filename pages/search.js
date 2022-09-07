/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { getEventsAndDays } from '../api/events/mergedEvents';
import DayCard from '../components/DayCard';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';

function Search() {
  const router = useRouter();
  const [results, setResults] = useState([]);
  const value = router.query.keyword ? router.query.keyword : '';

  const getTheContent = () => {
    getEventsAndDays().then((contentArr) => {
      setResults(contentArr);
      const filteredData = contentArr.filter((content) => content.title.toLowerCase().includes(value.toLowerCase()) || content.city.toLowerCase().includes(value.toLowerCase()));
      setResults(filteredData);
    });
  };

  useEffect(() => {
    getTheContent();
    setResults([]);
  }, [router.query.keyword]);

  return (
    <>
      <div>Search</div>
      <SearchBar />
      <div className="searchResultsDiv">
        {results.map((content) => (
          content.category ? <EventCard key={content.firebaseKey} obj={content} /> : <DayCard key={content.firebaseKey} obj={content} />
        ))}
      </div>
    </>
  );
}

export default Search;
