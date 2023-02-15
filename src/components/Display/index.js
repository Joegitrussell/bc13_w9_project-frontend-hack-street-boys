import "./index.css";
import Post from "../Post/index.js";
import { useState, useEffect } from "react";

/**
 * The Display function renders the post component
 * Contain all CRUD requests for comments
 * Holds to commentsDB
 * @param {array} postDB
 * @param {function} deletePost
 * @param {function} editPost
 * @component
 */

function Display({ postDB, deletePost, editPost }) {
  const [commentDB, setCommentDB] = useState([]);

  /**
   * Function checks the comment id to match the post
   * It then deletes the comment linked to that post
   * @param {number} id
   */

  //CHECKS IF POSTS HAVE COMMENTS
  async function checkComments(id) {
    for (let i = 0; i < commentDB.length; i++) {
      if (commentDB[i].post_id === id) {
        await fetch(`https://soc13-w9-backend.onrender.com/api/comments/${commentDB[i].id}`, {
          method: "DELETE",
        });
      }
    }
    deletePost(id);
  }

  //GET ALL COMMENTS
  useEffect(() => {
    /**
     * - Makes an api get request for all comments
     * - links the comments to posts
     */
    async function getComments() {
      const response = await fetch(`https://soc13-w9-backend.onrender.com/api/comments`);
      const data = await response.json();
      setCommentDB(data.payload);
    }
    getComments();
  }, []);

  // POST A COMMENT
  /**
   * api post request to create a comment
   * @param {string} addComment
   * @param {number} postId
   */
  async function createComment(addComment, postId) {
    const newObj = {
      user_id: 2,
      post_id: postId,
      comment: addComment,
    };
    await fetch("https://soc13-w9-backend.onrender.com/api/comments", {
      method: "POST",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify(newObj),
    });
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/comments`);
    const data = await response.json();
    setCommentDB(data.payload);
  }

  // DELETE A COMMENT
  /**
   *  delete request to the api giving the user the ability to delete a comment,
   * @param {number} id
   */
  async function deleteComment(id) {
    await fetch(`https://soc13-w9-backend.onrender.com/api/comments/${id}`, {
      method: "DELETE",
    });
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/comments`);
    const data = await response.json();
    setCommentDB(data.payload);
  }

  //PATCH A COMMENT
  /**
   *  patch request to the api giving the user the ability to update a comment,
   * @param {number} commentId
   * @param {number} user_id
   * @param {number} postId
   * @param {string} commentText
   */
  async function editComment(commentId, user_id, postId, commentText) {
    const newObj = {
      id: commentId,
      user_id: user_id,
      post_id: postId,
      comment: commentText,
    };
    await fetch(`https://soc13-w9-backend.onrender.com/api/comments/${commentId}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify(newObj),
    });
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/comments`);
    const data = await response.json();
    setCommentDB(data.payload);
  }

  return (
    <div className="display">
      <div className="posts">
        {postDB.map(function (currentpost) {
          let array = [];
          for (let i = 0; i < commentDB.length; i++) {
            if (commentDB[i].post_id === currentpost.id) {
              array.push(commentDB[i]);
            }
          }
          return (
            <Post
              checkComments={checkComments}
              editPost={editPost}
              editComment={editComment}
              createComment={createComment}
              id={currentpost.id}
              setCommentDB={setCommentDB}
              comments={array}
              topic={currentpost.topic}
              week={currentpost.week_number}
              postText={currentpost.post_text}
              userIdPost={currentpost.user_id}
              deleteComment={deleteComment}
              deletePost={deletePost}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Display;
