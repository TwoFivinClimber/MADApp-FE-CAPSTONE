/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Card, Carousel, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { FaEllipsisV } from 'react-icons/fa';
// import ImageList from '@mui/material/ImageList';
// import ImageListItem from '@mui/material/ImageListItem';
// import { getSingleEvent } from '../../api/events/eventData';
// import { getImagesByEvent } from '../../api/images/imageData';
import Moment from 'moment';
import { deleteEvent, getEventPackage } from '../../api/events/mergedEvents';
import { useAuth } from '../../utils/context/authContext';
import CommentForm from '../../components/CommentForm';
import { getComments } from '../../api/comments/commentData';
import CommentCard from '../../components/CommentCard';
// import { getSingleUserByUid } from '../../api/user/userData';

function ViewEvent() {
  const [event, setEvent] = useState({});
  const [images, setImages] = useState([]);
  const [eventUser, setEventUser] = useState({});
  const [comments, setComments] = useState([]);
  const [commentToUpdate, setCommentToUpdate] = useState({});
  const router = useRouter();
  const { user } = useAuth();
  const { firebaseKey } = router.query;

  const getTheContent = () => {
    getEventPackage(firebaseKey).then((eventObj) => {
      setEvent(eventObj);
      setImages(eventObj.images);
      setEventUser(eventObj.eventUser);
    });
    getComments(firebaseKey).then(setComments);
  };

  useEffect(() => {
    getTheContent();
  }, [firebaseKey]);

  const deleteThisEvent = () => {
    if (window.confirm('Are You Sure ?')) {
      deleteEvent(event.firebaseKey).then(() => {
        router.push('/user/profile');
      });
    }
  };

  return (
    <Card className="view-Day-Header">
      <Card.Body>
        <div className="view-day-head">
          <div className="view-day-user">
            <Card.Img className="round-User-Img" src={eventUser?.imageUrl} />
            <Card.Text className="view-day-username">{eventUser?.userName}</Card.Text>
          </div>
          <div className="view-day-dropdown">
            <DropdownButton align="end" variant="secondary" className="card-Dropdown" title={<FaEllipsisV />}>
              {user.uid === event.uid ? (
                <><Dropdown.Item className="drop-Down-Item" onClick={() => router.push(`/event/edit/${event.firebaseKey}`)}>Edit</Dropdown.Item><><Dropdown.Divider /><Dropdown.Item className="drop-Down-Item" onClick={deleteThisEvent}>Delete This Day</Dropdown.Item></></>
              ) : ('')}
            </DropdownButton>
          </div>
        </div>
        <Carousel fade className="event-page-carousel">
          {images?.map((image) => (
            <Carousel.Item>
              <img
                key={image.firebasekey}
                className="event-page-images d-block w-100"
                src={image.imageUrl}
                alt="First slide"
              />
            </Carousel.Item>
          ))}
        </Carousel>
        <div className="view-day-details">
          <Card.Body>
            <Card.Title>{event.title}</Card.Title>
            <Card.Text>{event.city}</Card.Text>
            <Card.Text className="comment-card-date">{Moment(event.date).format('MM-DD-YYYY')}</Card.Text>
            <Rating
              name="starRating"
              allowHover={false}
              showTooltip
              allowHalfIcon
              ratingValue={event.starRating}
              readonly
              size={26}
              tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
              tooltipStyle={{
                height: 'auto', width: 'auto', fontSize: '12px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
              }}
            />
          </Card.Body>
          <Card.Body className="view-day-description">
            <Card.Text>{event.description}</Card.Text>
          </Card.Body>
        </div>
      </Card.Body>
      <div className="comments-Div">
        <CommentForm obj={commentToUpdate} firebaseKey={firebaseKey} onUpdate={getTheContent} />
        {comments?.map((comment) => (
          <CommentCard key={comment.firebaseKey} obj={comment} onUpdate={getTheContent} setCommentToUpdate={setCommentToUpdate} />
        ))}
      </div>
    </Card>
  );
}

export default ViewEvent;
