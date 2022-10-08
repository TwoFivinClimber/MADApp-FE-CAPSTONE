/* eslint-disable @next/next/no-img-element */
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Moment from 'moment';
import { Button } from 'react-bootstrap';
import { useAuth } from '../utils/context/authContext';
import { updateComment, createComment } from '../api/comments/commentData';
import { getSingleUserByUid } from '../api/user/userData';

const initialState = {
  commentText: '',
};

// eslint-disable-next-line react/prop-types
function CommentForm({ obj, firebaseKey, onUpdate }) {
  const [input, setInput] = useState(initialState);
  const [comment, setComment] = useState();
  const [commentUser, setCommentUser] = useState({});
  const { user } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const date = () => {
    const d = new Date();
    const dateValue = Moment(d).format('MM-DD-YYYY');
    return dateValue;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (comment?.firebaseKey) {
      updateComment(input)
        .then(() => {
          setComment({});
          setInput(initialState);
          onUpdate();
        });
    } else {
      const commentObj = {
        ...input, uid: user.uid, date: date(), eventId: firebaseKey,
      };
      createComment(commentObj).then(() => {
        setInput(initialState);
        onUpdate();
      });
    }
  };

  useEffect(() => {
    getSingleUserByUid(user.uid).then(setCommentUser);
    if (obj.firebaseKey) {
      setComment(obj);
      setInput(obj);
    } else {
      setComment({});
      setInput(initialState);
    }
  }, [obj, user.uid]);

  return (
    <>
      {user.uid ? (

        <Form className="comment-form" onSubmit={handleSubmit}>
          <div className="comment-form-image-div">
            <img src={commentUser?.imageUrl} alt={commentUser?.userName} className="comment-form-user-image" />
          </div>
          <Form.Control
            className="comment-form-input"
            as="textarea"
            placeholder="Add a comment..."
            name="commentText"
            value={input.commentText}
            onChange={handleChange}
            required
          />
          <Button type="submit" variant="secondary" className="comment-form-button">Submit</Button>
        </Form>
      ) : (
        <div>
          <h5>Sign in to add comments</h5>
        </div>
      )}
    </>

  );
}

CommentForm.propTypes = {
  obj: PropTypes.shape({
    firebaseKey: PropTypes.string,
  }),
  onUpdate: PropTypes.func.isRequired,
};

CommentForm.defaultProps = {
  obj: initialState,
};

export default CommentForm;
