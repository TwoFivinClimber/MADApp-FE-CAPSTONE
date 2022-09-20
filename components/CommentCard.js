import React, { useEffect, useState } from 'react';
import {
  Card, Dropdown, DropdownButton, Image,
} from 'react-bootstrap';
import PropTypes from 'prop-types';
import { FaEllipsisV } from 'react-icons/fa';
import Link from 'next/link';
import { getUser } from '../api/user/userData';
import { deleteComment, getComments } from '../api/comments/commentData';
import { useAuth } from '../utils/context/authContext';

function CommentCard({ obj, onUpdate, setCommentToUpdate }) {
  const { user } = useAuth();
  const [commentUser, setCommentUser] = useState({});

  const deleteThisComment = () => {
    if (window.confirm('Delete this comment?')) {
      getComments(obj.firebaseKey).then(() => {
        deleteComment(obj.firebaseKey).then(() => onUpdate());
      });
    }
  };

  const scroll = () => {
    window.scrollTo(1, 0);
  };

  useEffect(() => {
    getUser(obj.uid).then((userArr) => {
      setCommentUser(userArr[0]);
    });
  }, [obj]);

  return (
    <Card.Body className="commentCard">
      {commentUser.uid === user.uid ? (
        <Link href="/user/profile" passHref>
          <Image className="commentUserImage" src={commentUser.imageUrl} />
        </Link>
      ) : (
        <Link href={`/user/${commentUser.uid}`} passHref>
          <Image className="commentUserImage" src={commentUser.imageUrl} />
        </Link>
      )}
      <Card.Body>
        <Card.Text>{commentUser.userName}</Card.Text>
        <Card.Text>{ commentUser.displayName }</Card.Text>
        <Card.Text>{ obj.commentText }</Card.Text>
        <Card.Text>{ obj.date }</Card.Text>
      </Card.Body>
      {user.uid === obj.uid ? (
        <DropdownButton align="end" variant="secondary" className="cardDropdown" title={<FaEllipsisV className="droptoggleicon" />}>
          <>
            <Dropdown.Item
              className="dropDownItem"
              onClick={() => {
                setCommentToUpdate(obj); scroll();
              }}
            >Edit
            </Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item className="dropDownItem" onClick={deleteThisComment}>Delete</Dropdown.Item>
          </>
        </DropdownButton>
      ) : ('')}
    </Card.Body>
  );
}

CommentCard.propTypes = {
  obj: PropTypes.shape({
    firebaseKey: PropTypes.string,
    eventId: PropTypes.string,
    commentText: PropTypes.string,
    date: PropTypes.string,
    uid: PropTypes.string,
  }).isRequired,
  onUpdate: PropTypes.func.isRequired,
  setCommentToUpdate: PropTypes.func.isRequired,

};

export default CommentCard;
