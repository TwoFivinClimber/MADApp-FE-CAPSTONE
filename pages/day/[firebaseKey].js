import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, Image, DropdownButton,
} from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';
import { deleteDay, getDayPackage } from '../../api/day/mergedDayData';
import { getUser } from '../../api/user/userData';
import EventCard from '../../components/EventCard';
import { useAuth } from '../../utils/context/authContext';

function ViewDay() {
  const [day, setDay] = useState({});
  const [creator, setCreator] = useState({});
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const { user } = useAuth();
  const router = useRouter();
  const rating = events.reduce((a, b) => a + b.starRating / events.length, 0);

  const { firebaseKey } = router.query;

  const getTheContent = () => {
    getDayPackage(firebaseKey).then((dayObj) => {
      setDay(dayObj);
      setImages(dayObj.images);
      setEvents(dayObj.events);
      getUser(dayObj.uid).then((userArr) => {
        setCreator(userArr[0]);
      });
    });
  };

  useEffect(() => {
    getTheContent();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseKey]);

  const deleteThisDay = () => {
    if (window.confirm('Are you Sure?  Your Day Looks Awesome!')) {
      deleteDay(day.firebaseKey);
      router.push('/user/profile');
    }
  };
  return (
    <>
      <Card className="viewDayHeader">
        <Card.Body>
          <Card.Img className="roundUserImg" src={creator.imageUrl} />
          <Card.Title>{day.title}</Card.Title>
          <Card.Text>By:{creator.userName}</Card.Text>
          <Card.Text>{day.city}</Card.Text>
          <Rating
            name="starRating"
            allowHover={false}
            showTooltip
            allowHalfIcon
            ratingValue={rating}
            readonly
            size={26}
            tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
            tooltipStyle={{
              height: 'auto', width: 'auto', fontSize: '12px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
            }}
          />
        </Card.Body>
        <Card.Body className="viewDayCenter">
          <Card.Text>{day.description}</Card.Text>
        </Card.Body>
        <DropdownButton align="end" variant="secondary" className="cardDropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/day/edit/${day.firebaseKey}`)}>Edit</Dropdown.Item>
          {user.uid === day.uid ? (
            <><Dropdown.Divider /><Dropdown.Item className="dropDownItem" onClick={deleteThisDay}>Delete This Day</Dropdown.Item></>
          ) : ('')}
        </DropdownButton>
      </Card>
      <Card className="viewDayImagesDiv">
        {images.map((url) => (
          <Image className="viewDayImages" key={url} src={url} />
        ))}
      </Card>
      <Card>
        {events.map((event) => (
          <EventCard key={event.firebaseKey} obj={event} />
        ))}
      </Card>
    </>
  );
}

export default ViewDay;
