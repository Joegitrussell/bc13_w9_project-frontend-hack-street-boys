import React, { useEffect } from 'react'
import Select from "react-select";
import { useState } from 'react';
import "./index.css"

/**
 * Renders a dropdown for topics and weeks.
 * @param {array} postDB
 * @param {function} setPostDB
 * @component
 */

export default function Filters({ postDB, setPostDB }) {
    const [topicOption, setTopicOption] = useState("");
    const [weekOption, setWeekOption] = useState("");

    useEffect(() => {
        const populateDropdowns = async () => {
            const arrTopic = [];
            const arrWeek = [];
            let result = postDB;
      
            //Creates new object with label needed for Topic DropDown to work
            result.map((post) => {
              return arrTopic.push({ value: post.topic, label: post.topic });
            });
      
            //Creates new object with label needed for Week DropDown to work
            result.map((post) => {
              return arrWeek.push({
                value: post.week_number,
                label: post.week_number,
              });
            });
      
            //Removes duplicates from Topic dropdown
            const uniqueTopics = [];
            const unique = arrTopic.filter((element) => {
              const isDuplicate = uniqueTopics.includes(element.label);
              if (!isDuplicate) {
                uniqueTopics.push(element.label);
                return true;
              }
              return false;
            });
      
            //Removes duplicates from Week dropdown
            const uniqueWeeks = [];
            const uniqueWeek = arrWeek.filter((element) => {
              const isDuplicate = uniqueWeeks.includes(element.label);
              if (!isDuplicate) {
                uniqueWeeks.push(element.label);
                return true;
              }
              return false;
            });
      
            //Sorts Week Dropdown by size
            setWeekOption(
              uniqueWeek.sort((a, b) => {
                return a.label - b.label;
              })
            );
            //Sorts Topic Dropdown alphabetically
            setTopicOption(
              unique.sort((a, b) => {
                return a.label.toLowerCase() > b.label.toLowerCase()
                  ? 1
                  : a.label.toLowerCase() < b.label.toLowerCase()
                  ? -1
                  : 0;
              })
            );
          };
          populateDropdowns();
    }, [postDB])

    //Filter out the selected topic dropdown in postDB
    const handleTopic = async (selected) => {
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
    const data = await response.json();
    const payload = data.payload;
    const dropDownTopic = payload.filter((obj) => {
      return obj.topic === selected.label;
    });
    setPostDB(dropDownTopic);
    const arrWeek = [];
    dropDownTopic.map((post) => {
      return arrWeek.push({
        value: post.week_number,
        label: post.week_number,
      });
    });
    const uniqueWeeks = [];
    const uniqueWeek = arrWeek.filter((element) => {
      const isDuplicate = uniqueWeeks.includes(element.label);
      if (!isDuplicate) {
        uniqueWeeks.push(element.label);
        return true;
      }
      return false;
    });
    setWeekOption(
      uniqueWeek.sort((a, b) => {
        return a.label - b.label;
      })
    );
  };

  //Filters out the selected week dropdown in postDB
  const handleWeek = async (selected) => {
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
    const data = await response.json();
    const payload = data.payload;
    const dropDownWeek = payload.filter((obj) => {
      return obj.week_number === Number(selected.label);
    });
    setPostDB(dropDownWeek);
    const arrTopic = [];
    dropDownWeek.map((post) => {
      return arrTopic.push({ value: post.topic, label: post.topic });
    });
    const uniqueTopics = [];
    const unique = arrTopic.filter((element) => {
      const isDuplicate = uniqueTopics.includes(element.label);
      if (!isDuplicate) {
        uniqueTopics.push(element.label);
        return true;
      }
      return false;
    });
    setTopicOption(
      unique.sort((a, b) => {
        return a.label.toLowerCase() > b.label.toLowerCase()
          ? 1
          : a.label.toLowerCase() < b.label.toLowerCase()
          ? -1
          : 0;
      })
    );
  };

  const handleReset = async () => {
    const response = await fetch(`https://soc13-w9-backend.onrender.com/api/posts`);
    const data = await response.json();
    let result = data.payload;
    setPostDB(result);
  };

  return (
    <div className="filters">
        <h3>Filter By:</h3>
        <Select options={weekOption} placeholder="Week" onChange={handleWeek} />
        <Select
          options={topicOption}
          placeholder="Topic"
          onChange={handleTopic}
        />
        <button onClick={handleReset}>Reset Filters</button>
    </div>
  )
}
