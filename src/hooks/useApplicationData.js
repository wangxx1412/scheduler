import { useState, useEffect } from "react";
import axios from "axios";

export default function useApplicationData() {
  const [state, setState] = useState({
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {},
  });

  const setDay = (day) => setState({ ...state, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers")),
    ]).then((all) => {
      setState((prev) => ({
        ...prev,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data,
      }));
    });
  }, []);

  // Calculate the spots after add/delete interview and setState
  const updateSpots = () => {
    let dayInd;
    if (state.day === "Monday") {
      dayInd = 0;
    } else if (state.day === "Tuesday") {
      dayInd = 1;
    } else if (state.day === "Wednesday") {
      dayInd = 2;
    } else if (state.day === "Thursday") {
      dayInd = 3;
    } else if (state.day === "Friday") {
      dayInd = 4;
    }
    const apps = state.days[dayInd].appointments;

    let spots = 0;
    let totalSpots = state.days[dayInd].appointments.length;

    for (const el in state.appointments) {
      if (apps.includes(Number(el))) {
        if (state.appointments[el].interview) {
          spots += 1;
        }
      }
    }
    spots = totalSpots - spots;
    const day = {
      ...state.days[dayInd],
      spots,
    };
    let newdays = [...state.days];
    newdays[dayInd] = day;
    setState({ ...state, days: newdays });
  };

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview },
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };

    await axios
      .put(`/api/appointments/${id}`, { interview })
      .then(() => {
        setState((prev) => {
          prev.appointments = appointments;
          return prev;
        });
      })
      .then(() => {
        updateSpots();
      });
  }

  async function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null,
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment,
    };
    await axios
      .delete(`/api/appointments/${id}`)
      .then(() => {
        setState((prev) => {
          prev.appointments = appointments;
          return prev;
        });
      })
      .then(() => {
        updateSpots();
      });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview,
  };
}
