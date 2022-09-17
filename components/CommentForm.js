import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import Moment from 'moment';
import { useAuth } from '../utils/context/authContext';
import { updateComment, createComment } from '../api/comments/commentData';

const initialState = {
  commentText: '',
};

// eslint-disable-next-line react/prop-types
function CommentForm({ obj, firebaseKey, onUpdate }) {
  const [input, setInput] = useState(initialState);
  const [comment, setComment] = useState();
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
    if (comment.firebaseKey) {
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
    if (obj.firebaseKey) {
      setComment(obj);
      setInput(obj);
    } else {
      setComment({});
      setInput(initialState);
    }
  }, [obj]);

  return (
    <>
      {user.uid ? (
        <Form onSubmit={handleSubmit}>
          <Form.Control
            type="text"
            placeholder="Add a comment..."
            name="commentText"
            value={input.commentText}
            onChange={handleChange}
            required
          />
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
