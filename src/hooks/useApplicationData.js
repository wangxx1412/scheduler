import { useEffect, useReducer } from "react";
import axios from "axios";

export default function useApplicationData() {
  const SET_DAY = "SET_DAY";
  const SET_APPLICATION_DATA = "SET_APPLICATION_DATA";
  const SET_INTERVIEW = "SET_INTERVIEW";
  const SET_DAYS = "SET_DAYS";

  function reducer(state, action) {
    switch (action.type) {
      case SET_DAY:
        return {
          ...state,
          day: action.day
        };
      case SET_APPLICATION_DATA:
        return {
          ...state,
          days: action.days,
          appointments: action.appointments,
          interviewers: action.interviewers
        };
      case SET_INTERVIEW:
        return {
          ...state,
          appointments: action.appointments,
          days: action.days
        };
      case SET_DAYS:
        return {
          ...state,
          days: action.days
        };
      default:
        throw new Error(
          `Tried to reduce with unsupported action type: ${action.type}`
        );
    }
  }
  const [state, dispatch] = useReducer(reducer, {
    day: "Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => dispatch({ type: SET_DAY, day });

  useEffect(() => {
    Promise.all([
      Promise.resolve(axios.get("/api/days")),
      Promise.resolve(axios.get("/api/appointments")),
      Promise.resolve(axios.get("/api/interviewers"))
    ]).then(all => {
      dispatch({
        type: SET_APPLICATION_DATA,
        days: all[0].data,
        appointments: all[1].data,
        interviewers: all[2].data
      });
    });
  }, []);

  function updateSpots(op) {
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

    let spots = state.days[dayInd].spots;

    if (op === "put") {
      const day = {
        ...state.days[dayInd],
        spots: spots - 1
      };
      let newdays = [...state.days];
      newdays[dayInd] = day;
      return newdays;
    } else if (op === "delete") {
      const day = {
        ...state.days[dayInd],
        spots: spots + 1
      };
      let newdays = [...state.days];
      newdays[dayInd] = day;
      return newdays;
    }
  }

  async function bookInterview(id, interview) {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };

    await axios.put(`/api/appointments/${id}`, { interview }).then(() => {
      const days = updateSpots("put");
      dispatch({
        type: SET_INTERVIEW,
        appointments,
        days
      });
    });
  }

  async function cancelInterview(id) {
    const appointment = {
      ...state.appointments[id],
      interview: null
    };

    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
    await axios.delete(`/api/appointments/${id}`).then(() => {
      const days = updateSpots("delete");
      dispatch({
        type: SET_INTERVIEW,
        appointments,
        days
      });
    });
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  };
}
