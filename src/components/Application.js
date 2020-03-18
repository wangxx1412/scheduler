import React, { useState, useEffect } from "react";
import axios from "axios";

import "components/Application.scss";

import DayList from "components/DayList";
import Appointment from "./Appointment/index";

export default function Application(props) {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {}
  });

  const setDay = day => setState({ ...state, day });

  // const setDays = days => setState(prev => ({ ...prev, days: days }));

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments"))
    ]).then(all => {
      setState(prev => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data
      }));
    });
  }, []);
  const objtoarr = obj => {
    const result = [];
    for (const el in obj) {
      result.push(obj[el]);
    }
    return result;
  };
  const app = objtoarr(state.appointments);

  return (
    <main className="layout">
      <section className="sidebar">
        <img
          className="sidebar--centered"
          src="images/logo.png"
          alt="Interview Scheduler"
        />
        <hr className="sidebar__separator sidebar--centered" />
        <nav className="sidebar__menu">
          <DayList days={state.days} day={state.day} setDay={setDay} />
        </nav>
        <img
          className="sidebar__lhl sidebar--centered"
          src="images/lhl.png"
          alt="Lighthouse Labs"
        />
      </section>
      <section className="schedule">
        {app.map(appointment => {
          return <Appointment key={appointment.id} {...appointment} />;
        })}
        <Appointment key="last" time="5pm" />
      </section>
    </main>
  );
}
