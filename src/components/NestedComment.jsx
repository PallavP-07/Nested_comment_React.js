import React, { useRef, useState } from "react";
import "./style.css";
import { FaReply, FaEdit, FaTrashAlt, FaSave, FaTimes } from "react-icons/fa";

const NestedComment = () => {
  const [comments, setComments] = useState([
    {
      id: 1,
      display: "First comment",
      nestedComment: [
        {
          id: 2,
          display: "New comment",
          nestedComment: [],
        },
      ],
    },
    {
      id: 3,
      display: "Second comment",
      nestedComment: [],
    },
  ]);
  const [input, setInput] = useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const generateId = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const newInput = (text) => {
    return {
      id: generateId(),
      display: text,
      nestedComment: [],
    };
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input) {
      setComments([...comments, newInput(input)]);
      setInput("");
    }
  };

  const addReply = (commentId, replyText) => {
    const updatedComments = [...comments];
    addNewComment(updatedComments, commentId, replyText);
    setComments(updatedComments);
  };

  const addNewComment = (commentList, commentId, replyText) => {
    for (let comment of commentList) {
      if (comment.id === commentId) {
        comment.nestedComment.unshift(newInput(replyText));
        return true;
      }
      if (comment.nestedComment.length > 0) {
        const added = addNewComment(
          comment.nestedComment,
          commentId,
          replyText
        );
        if (added) return true;
      }
    }
    return false;
  };

  const deleteComment = (commentId) => {
    const updatedComments = removeComment(comments, commentId);
    setComments(updatedComments);
  };

  const removeComment = (commentList, commentId) => {
    return commentList.filter((comment) => {
      if (comment.id === commentId) return false; // Remove this comment
      if (comment.nestedComment.length > 0) {
        comment.nestedComment = removeComment(comment.nestedComment, commentId); // Recursively remove nested comments
      }
      return true;
    });
  };

  return (
    <div className="comment-container">
      <div className="comment-input">
        <input
          type="text"
          placeholder="Enter your comment"
          onChange={handleChange}
          value={input}
          className="input-field"
        />
        <button onClick={handleSubmit} className="submit-button">
          Comment
        </button>
      </div>
      <div>
        {comments.map((item) => (
          <NewComment
            comment={item}
            key={item.id}
            addReply={addReply}
            deleteComment={deleteComment}
          />
        ))}
      </div>
    </div>
  );
};

const NewComment = ({ comment, addReply, deleteComment }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editInput, setEditInput] = useState(comment.display);
  const inputRef = useRef(null);

  const handleReply = () => {
    setShowReply(true);
    setTimeout(() => {
      inputRef.current.focus();
    }, 1);
  };

  const handleCancelButton = () => {
    setShowReply(false);
    setReplyInput("");
  };

  const handleReplySave = (commentID) => {
    addReply(commentID, replyInput);
    setShowReply(false);
    setReplyInput("");
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleEditSave = () => {
    comment.display = editInput;
    setIsEditing(false);
  };

  const handleKeyDown = (e, commentID) => {
    if (e.key === "Enter") {
      handleReplySave(commentID);
    } else if (e.key === "Escape") {
      handleCancelButton();
    }
  };

  const handleDelete = (commentID) => {
    deleteComment(commentID);
  };

  return (
    <div className="comment-box">
      {isEditing ? (
        <>
          <input
            type="text"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
          />
          <button onClick={handleEditSave} className="save-button">
            <FaSave className="icon" /> Save
          </button>
        </>
      ) : (
        <>
          <li className="comment-text">{comment.display}</li>
          <button onClick={handleEdit} className="edit-button">
            <FaEdit className="icon" /> Edit
          </button>
          <button
            onClick={() => handleDelete(comment.id)}
            className="delete-button"
          >
            <FaTrashAlt className="icon" /> Delete
          </button>
        </>
      )}
      {!showReply && (
        <button onClick={handleReply} className="reply-button">
          <FaReply className="icon" /> Reply
        </button>
      )}
      {showReply && (
        <div className="reply-section">
          <input
            type="text"
            placeholder="Enter your reply"
            ref={inputRef}
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, comment.id)}
            className="reply-input"
          />
          <button
            onClick={() => handleReplySave(comment.id)}
            className="save-button"
          >
            <FaSave className="icon" /> Save
          </button>
          <button onClick={handleCancelButton} className="cancel-button">
            <FaTimes className="icon" /> Cancel
          </button>
        </div>
      )}
      {comment.nestedComment.length > 0 && (
        <ul className="nested-comments">
          {comment.nestedComment.map((item) => (
            <NewComment
              comment={item}
              key={item.id}
              addReply={addReply}
              deleteComment={deleteComment}
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default NestedComment;
