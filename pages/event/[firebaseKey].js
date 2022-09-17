/* eslint-disable react-hooks/exhaustive-deps */
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import {
  Card, Image, Dropdown, DropdownButton,
} from 'react-bootstrap';
import { Rating } from 'react-simple-star-rating';
import { FaEllipsisV } from 'react-icons/fa';
import { getSingleEvent } from '../../api/events/eventData';
import { getImagesByEvent } from '../../api/images/imageData';
import { deleteEvent } from '../../api/events/mergedEvents';
import { useAuth } from '../../utils/context/authContext';
import CommentForm from '../../components/CommentForm';
import { getComments } from '../../api/comments/commentData';
import CommentCard from '../../components/CommentCard';

function ViewEvent() {
  const [event, setEvent] = useState({});
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentToUpdate, setCommentToUpdate] = useState({});
  const router = useRouter();
  const { user } = useAuth();
  const { firebaseKey } = router.query;

  const getTheContent = () => {
    getSingleEvent(firebaseKey).then(setEvent);
    getImagesByEvent(firebaseKey).then(setImages);
    getComments(firebaseKey).then(setComments);
  };

  useEffect(() => {
    getTheContent();
  }, []);

  const deleteThisEvent = () => {
    if (window.confirm('Are You Sure ?')) {
      deleteEvent(event.firebaseKey).then(() => {
        router.push('/user/profile');
      });
    }
  };

  return (
    <>
      <div className="eventPageContainerDiv">
        <Card className="eventPage">
          <Card.Body className="eventPageLeft">
            <Card.Title className="eventPageTitle">{event.title}</Card.Title>
            <Card.Text>{event.date}</Card.Text>
            <Card.Text>{event.location}</Card.Text>
            <Card.Text>{event.city}</Card.Text>
            <Card.Text>{event.userName}</Card.Text>
            <Rating
              name="starRating"
              allowHover={false}
              showTooltip
              allowHalfIcon
              tooltipArray={['Bad', 'Bad', 'Not Bad', 'Not Bad', 'Good', 'Good', 'Great', 'Great', 'Awesome', 'M.A.D. Awesome']}
              tooltipStyle={{
                height: 'auto', width: 'auto', fontSize: '12px', padding: '2px 4px', textAlign: 'center', marginTop: '4px', marginLeft: '10px',
              }}
              ratingValue={event.starRating}
              size={24}
              readonly
            />
          </Card.Body>
          <Card.Body className="eventPageCenter">
            <Card.Text>{event.description}</Card.Text>
          </Card.Body>
          <DropdownButton align="end" variant="secondary" className="eventPageDropdown" title={<FaEllipsisV className="droptoggleicon" />}>
            {user.uid === event.uid ? (
              <>
                <Dropdown.Item className="dropDownItem" onClick={() => router.push(`/event/edit/${event.firebaseKey}`)}>Edit</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item className="dropDownItem" onClick={deleteThisEvent}>Delete</Dropdown.Item>
              </>
            ) : (
              <Dropdown.Item className="dropDownItem">Save</Dropdown.Item>
            )}
          </DropdownButton>
        </Card>
        <div className="eventPageImages">
          {images?.map((image) => (
          // eslint-disable-next-line import/no-dynamic-require, global-require
            <Image key={image.firebaseKey} src={image.imageUrl} style={{ maxHeight: '250px', width: 'auto' }} rounded />
          ))}
        </div>
      </div>
      <div className="commentsDiv">
        <CommentForm obj={commentToUpdate} firebaseKey={firebaseKey} onUpdate={getTheContent} />
        {comments?.map((comment) => (
          <CommentCard key={comment.firebaseKey} obj={comment} onUpdate={getTheContent} setCommentToUpdate={setCommentToUpdate} />
        ))}
      </div>
    </>
  );
}

export default ViewEvent;
