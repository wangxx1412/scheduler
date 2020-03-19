export function getAppointmentsForDay(state, day) {
  let appointments = [];
  for (const el of state.days) {
    if (el.name === day) {
      appointments = el.appointments;
    }
  }

  const result = [];
  for (const el of appointments) {
    result.push(state.appointments[el]);
  }

  return result;
}

export function getInterview(state, interview) {
  if (interview) {
    for (const el in state.interviewers) {
      if (Number(el) === state.interviewers[el].id) {
        const result = {
          student: interview.student,
          interviewer: state.interviewers[el]
        };
        return result;
      }
    }
  } else {
    return null;
  }
}

export function getInterviewersForDay(state, day) {
  let interviewers = [];
  for (const el of state.days) {
    if (el.name === day) {
      interviewers = el.interviewers;
    }
  }

  const result = [];
  for (const el of interviewers) {
    result.push(state.interviewers[el]);
  }

  return result;
}
