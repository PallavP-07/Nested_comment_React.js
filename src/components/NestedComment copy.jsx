import React, { useRef, useState } from "react";
import './style.css';

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
        const added = addNewComment(comment.nestedComment, commentId, replyText);
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
          <NewComment comment={item} key={item.id} addReply={addReply} deleteComment={deleteComment} />
        ))}
      </div>
    </div>
  );
};

// const NewComment = ({ comment, addReply }) => {
//   const [showReply, setShowReply] = useState(false);
//   const [replyInput, setReplyInput] = useState("");
//   const inputRef = useRef(null);

//   const handleReply = () => {
//     setShowReply(true);
//     setTimeout(() => {
//       inputRef.current.focus();
//     }, 1);
//   };

//   const handleCancelButton = () => {
//     setShowReply(false);
//     setReplyInput("");
//   };

//   const handleReplySave = (commentID) => {
//     addReply(commentID, replyInput);
//     setShowReply(false);
//     setReplyInput("");
//   };

//   const handleKeyDown = (e, commentID) => {
//     if (e.key === "Enter") {
//       handleReplySave(commentID);
//     } else if (e.key === "Escape") {
//       handleCancelButton();
//     }
//   };

//   return (
//     <div className="comment-box">
//       <li className="comment-text">{comment.display}</li>
//       {!showReply && <button onClick={handleReply} className="reply-button">Reply</button>}
//       {showReply && (
//         <div className="reply-section">
//           <input
//             type="text"
//             placeholder="Enter your reply"
//             ref={inputRef}
//             value={replyInput}
//             onChange={(e) => setReplyInput(e.target.value)}
//             onKeyDown={(e) => handleKeyDown(e, comment.id)}
//             className="reply-input"
//           />
//           <button onClick={() => handleReplySave(comment.id)} className="save-button">Save</button>
//           <button onClick={handleCancelButton} className="cancel-button">Cancel</button>
//         </div>
//       )}
//       {comment.nestedComment.length > 0 && (
//         <ul className="nested-comments">
//           {comment.nestedComment.map((item) => (
//             <NewComment comment={item} key={item.id} addReply={addReply} />
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// };
const NewComment = ({ comment, addReply,deleteComment }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyInput, setReplyInput] = useState("");
  const [isEditing, setIsEditing] = useState(false); // New state for editing
  const [editInput, setEditInput] = useState(comment.display); // New state for edit input
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
    comment.display = editInput; // Update the comment display with the new text
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
    <div>
      {isEditing ? (
        <>
          <input
            type="text"
            value={editInput}
            onChange={(e) => setEditInput(e.target.value)}
          />
          <button onClick={handleEditSave}>Save</button>
        </>
      ) : (
        <>
          <li>{comment.display}</li>
          <button onClick={handleEdit}>Edit</button>
          <button onClick={() => handleDelete(comment.id)}>Delete</button>
        </>
      )}
      {!showReply && <button onClick={handleReply}>reply</button>}
      {showReply && (
        <>
          <input
            type="text"
            placeholder="enter your reply"
            ref={inputRef}
            value={replyInput}
            onChange={(e) => setReplyInput(e.target.value)}
            onKeyDown={(e) => handleKeyDown(e, comment.id)}
          />
          <button onClick={() => handleReplySave(comment.id)}>save</button>
          <button onClick={handleCancelButton}>cancel</button>
        </>
      )}
      {comment.nestedComment.length > 0 && (
        <ul>
          {comment.nestedComment.map((item) => (
            <NewComment
              comment={item}
              key={item.id}
              addReply={addReply}
              deleteComment={deleteComment}
              // Add edit and delete functions as needed
            />
          ))}
        </ul>
      )}
    </div>
  );
};

export default NestedComment;
