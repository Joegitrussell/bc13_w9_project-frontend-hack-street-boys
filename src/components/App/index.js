import Display from "../Display";
import NavBar from "../NavBar";
import CreatePost from "../CreatePost";
import "./index.css";
import { useEffect, useState } from "react";
import Filters from "../Filters";

/**
 * App Component
 * Top Level component Tree for all components
 * Endpoint for the HTML 
 * Where all the CRUD requests for postDB take place
 * @component
 */

function App() {
  const [postDB, setPostDB] = useState([]);

  useEffect(() => {
    /**
     * - Makes an api get request for all posts
     * - sorts the posts in reverse week order so you see the latest one first
     * - updates the postDB state to sorted array of posts objects
     */

    async function getPosts() {
      const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
      const data = await response.json();
      let sortedData = data.payload.sort((a, b) => {
        return b.week_number - a.week_number;
      });
      setPostDB(sortedData);
    }
    getPosts();
  }, []);

  //POST A POST
  /**
   * - api post request giving the user the ability to create a post
   * - sorts the posts in reverse week order so you see the latest one first
   * - updates the postDB state to sorted array of posts objects
   * @param {object} newObj
   */
  async function createPost(newObj) {
    await fetch("https://soc13-w9-backend.onrender.com/api/posts", {
      method: "POST",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify(newObj),
    });
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
    const data = await response.json();
    let sortedData = data.payload.sort((a, b) => {
      return b.week_number - a.week_number;
    });
    setPostDB(sortedData);
  }

  /**
   * - handleClick function that gets passed down to the CreatePost component
   * - stores the information inputted by the user into an object
   * - calls the createPost function above and adds the new post (newobj)
   * @param {string} topic
   * @param {number} week
   * @param {string} post
   */

  function handleClick(topic, week, post) {
    const newObj = {
      user_id: 1,
      week_number: Number(week),
      topic: topic,
      post_text: post,
    };
    createPost(newObj);
  }

  //DELETE A POST
  /**
   * - delete request to the api giving the user the ability to delete a post,
   * - sorts the posts in reverse week order so you see the latest one first
   * - updates the postDB and removes the deleted post
   * @param {number} id
   */
  async function deletePost(id) {
    await fetch(`https://soc13-w9-backend.onrender.com/api/posts/${id}`, {
      method: "DELETE",
    });
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
    const data = await response.json();
    let sortedData = data.payload.sort((a, b) => {
      return b.week_number - a.week_number;
    });
    setPostDB(sortedData);
  }

  // User press POST delete
  // call the del comment function which is defined in display compontent and passed down to post
  // handleclick which first calls deletecomment function then calls the delete post function for that post_id

  //PATCH A POST
  /**
   * - patch request to the api giving the user the ability to update a post,
   * - sorts the posts in reverse week order so you see the latest one first
   * - updates the postDB and shows the updated post
   * @param {number} id
   * @param {number} userIdPost
   * @param {string} editPostText
   * @param {number} week
   * @param {string} topic
   */
  async function editPost(id, userIdPost, editPostText, week, topic) {
    const newObj = {
      id: id,
      user_id: userIdPost,
      post_text: editPostText,
      week_number: week,
      topic: topic,
    };
    await fetch(`https://soc13-w9-backend.onrender.com/api/posts/${id}`, {
      method: "PATCH",
      headers: { "content-type": "application/json" },
      mode: "cors",
      body: JSON.stringify(newObj),
    });
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
    const data = await response.json();
    let sortedData = data.payload.sort((a, b) => {
      return b.week_number - a.week_number;
    });
    setPostDB(sortedData);
  }

  return (
    <div className="app">
      <NavBar />
      <CreatePost handleClick={handleClick} />
      <Filters postDB={postDB} setPostDB={setPostDB} />
      <Display editPost={editPost} postDB={postDB} deletePost={deletePost} />
    </div>
  );
}

export default App;
