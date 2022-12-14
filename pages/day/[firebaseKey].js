/* eslint-disable @next/next/no-img-element */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton, Carousel,
} from 'react-bootstrap';
import { FaEllipsisV } from 'react-icons/fa';
import { Rating } from 'react-simple-star-rating';
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
import Moment from 'moment';
import Link from 'next/link';
import { getComments } from '../../api/comments/commentData';
import { deleteDay, getDayPackage } from '../../api/day/mergedDayData';
import { getUser } from '../../api/user/userData';
import CommentCard from '../../components/CommentCard';
import CommentForm from '../../components/CommentForm';
// import EventCard from '../../components/EventCard';
import { useAuth } from '../../utils/context/authContext';
import EventCardNew from '../../components/EventCardNew';

function ViewDay() {
  const [day, setDay] = useState({});
  const [creator, setCreator] = useState({});
  const [images, setImages] = useState([]);
  const [events, setEvents] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentToUpdate, setCommentToUpdate] = useState({});
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
      getComments(firebaseKey).then(setComments);
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
    <Card className="view-Day-Header">
      <Card.Body>
        <div className="view-day-head">
          <div className="view-day-user">
            {creator?.uid === user.uid ? (
              <Link href="/user/profile" passHref>
                <Card.Img className="comment-User-Image" src={creator?.imageUrl} />
              </Link>
            ) : (
              <Link href={`/user/${creator?.uid}`} passHref>
                <Card.Img className="comment-User-Image" src={creator?.imageUrl} />
              </Link>
            )}
            <Card.Text className="view-day-username">{creator?.userName}</Card.Text>
          </div>
          <div className="view-day-dropdown">
            {user.uid === day.uid ? (
              <DropdownButton align="end" variant="secondary" className="card-Dropdown" title={<FaEllipsisV />}>
                <><Dropdown.Item className="drop-Down-Item" onClick={() => router.push(`/day/edit/${day.firebaseKey}`)}>Edit</Dropdown.Item><><Dropdown.Divider /><Dropdown.Item className="drop-Down-Item" onClick={deleteThisDay}>Delete This Day</Dropdown.Item></></>
              </DropdownButton>
            ) : ('')}
          </div>
        </div>
        <Carousel className="event-page-carousel" fade>
          {images?.map((image) => (
            <Carousel.Item key={image.firebasekey}>
              <img
                className="event-page-images d-block w-100"
                src={image}
                alt="First slide"
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="view-day-details">
          <Card.Body>
            <Card.Title>{day.title}</Card.Title>
            <Card.Text>{day.city}</Card.Text>
            <Card.Text className="comment-card-date">{Moment(day.date).format('MM-DD-YYYY')}</Card.Text>
            <div className="view-day-star-rating">
              <Rating
                className="starRating"
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
            </div>
          </Card.Body>
          <Card.Body className="view-day-description">
            <Card.Text>{day.description}</Card.Text>
          </Card.Body>
        </div>
      </Card.Body>
      <h5 className="view-day-events-header">Events From This Day</h5>
      <div className="view-day-events-div">
        {events.map((event) => (
          <EventCardNew key={event.firebaseKey} obj={event} onUpdate={getTheContent} />
        ))}
      </div>
      <div className="comments-Div">
        <CommentForm obj={commentToUpdate} firebaseKey={firebaseKey} onUpdate={getTheContent} />
        {comments?.map((comment) => (
          <CommentCard key={comment.firebaseKey} obj={comment} onUpdate={getTheContent} setCommentToUpdate={setCommentToUpdate} />
        ))}
      </div>
    </Card>
  );
}

export default ViewDay;
