import axios from "axios";
import React, { useContext, useState } from "react";
import GlobalState from "../../../GlobalState";
import GlobalErr from "../utils/Error/GlobalErr";
import Loading from "../utils/loading/Loading";

import "./Timing.css";

const Timing = () => {
  const state = useContext(GlobalState);
  const [token] = state.authAPI.token;
  const [timings, setTimings] = state.timingsAPI.timings;
  const [timingsCallback, setTimingsCallback] = state.timingsAPI.callback;
  const [selectedDay, setSelectedDay] = useState("");
  const [opening, setOpening] = useState("");
  const [closing, setClosing] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [loading, setLoading] = useState(false);
  const [responseError, setReponseError] = useState("");

  const weekdays = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDay || !weekdays.includes(selectedDay))
      setReponseError("Invalid day selected.");
    try {
      setLoading(true);
      if (!onEdit && (!responseError || responseError.length === 0)) {
        const newTiming = {
          day: selectedDay,
          opening: opening + ":00",
          closing: closing + ":00",
        };
        const response = await axios({
          method: "post",
          url: "http://localhost:8888/admin/timings/",
          headers: {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          },
          data: newTiming,
        });
        setClosing("");
        setOpening("");
        setLoading(false);
      } else if (!responseError || responseError.length === 0) {
        const timing = timings.find((tm) => tm.day === selectedDay);

        if (timing && token) {
          const newTiming = {
            opening: /^([2][0-3]|[01]?[0-9]):([1-5][0-9]|[0]?[0-9]):([1-5][0-9]|[0]?[0-9])$/.test(
              opening
            )
              ? opening
              : opening + ":00",
            closing: /^([2][0-3]|[01]?[0-9]):([1-5][0-9]|[0]?[0-9]):([1-5][0-9]|[0]?[0-9])$/.test(
              closing
            )
              ? closing
              : closing + ":00",
          };
          const response = await axios({
            method: "put",
            url: "http://localhost:8888/admin/timings/" + timing.day,
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
            data: newTiming,
          });

          setTimingsCallback(!timingsCallback);
          setOnEdit(false);
        }
      }
      setLoading(false);
    } catch (err) {
      if (err.response) {
        if (err.response.data.details)
          setReponseError(err.response.data.details);
        else setReponseError(err.response.data.messgae);

        return setLoading(false);
      }
      setReponseError(err.message);
      setLoading(false);
    }
  };

  const handleOpeningInput = (e) => {
    if (e.target.value) {
      setOpening(e.target.value);
      setReponseError("");
    } else if (!e.target.value || !opening) {
      setReponseError("Select an opening time.");
    }
    // TODO: check for validity
  };

  const handleClosingInput = (e) => {
    if (e.target.value) {
      setClosing(e.target.value);
      setReponseError("");
    } else if (!e.target.value || !closing) {
      setReponseError("Select a closing time.");
    }
    // TODO: check for validity
  };

  const handleDeleteTiming = async (day) => {
    try {
      setLoading(true);
      await axios({
        method: "delete",
        url: "http://localhost:8888/admin/timings/" + day,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setTimingsCallback(!timingsCallback);
      setLoading(false);
    } catch (err) {
      if (err.response) {
        if (err.response.data.details)
          setReponseError(err.response.data.details);
        else setReponseError(err.response.data.messgae);

        setLoading(false);
      }
      setReponseError(err.message);
      setLoading(false);
    }
  };

  const handleEditTiming = (timing) => {
    setSelectedDay(timing.day);
    setOpening(timing.opening);
    setClosing(timing.closing);
    setOnEdit(true);
  };

  return (
    <main className="timings">
      <GlobalErr error={responseError} />

      <form className="timings-form" onSubmit={handleFormSubmit}>
        <select
          name="day"
          id="daySelector"
          onChange={(e) => {
            if (!onEdit) {
              if (e.target.value) {
                if (responseError) setReponseError("");
                return setSelectedDay(e.target.value);
              }
              setReponseError("Invalid day selected");
            }
          }}
          value={selectedDay}
          disabled={onEdit}>
          <option value="">select day</option>
          {weekdays.map((day) => {
            if (!timings.find((tm) => tm.day === day)) {
              return (
                <option value={day} key={day}>
                  {day[0].toUpperCase() + day.slice(1)}
                </option>
              );
            }
            return null;
          })}
          {onEdit && (
            <option value={selectedDay}>
              {selectedDay[0].toUpperCase() + selectedDay.slice(1)}
            </option>
          )}
        </select>
        <input
          type="time"
          name="opening"
          id="openingInput"
          value={opening}
          onChange={handleOpeningInput}
        />
        <input
          type="time"
          name="closing"
          id="closingInput"
          value={closing}
          onChange={handleClosingInput}
        />
        <button type="submit">{onEdit ? "Update" : "Add"}</button>
      </form>

      {/* List of all elements */}
      {loading && <Loading />}
      {!loading && (
        <ul className="timings__timings-list">
          {timings.map((tm) => (
            <li className={"timings__timing-item"} key={tm.day}>
              <div className="timing-item__day">
                {tm.day[0].toUpperCase() + tm.day.slice(1)}
              </div>
              <div className="timing-item__opening">{tm.opening}</div>
              <div className="timing-item__closing">{tm.closing}</div>
              <button
                className="timing-item__button timing-item__button--edit"
                onClick={() => handleEditTiming(tm)}>
                EDIT
              </button>

              <button
                className="timing-item__button timing-item__button--delete"
                onClick={() => handleDeleteTiming(tm.day)}>
                DELETE
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
};
export default Timing;
