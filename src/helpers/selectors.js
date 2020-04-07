// Given the api data, find those appoinments for one of weekdays
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

// Grab the infomation of single interview
export function getInterview(state, interview) {
  if (interview) {
    for (const el in state.interviewers) {
      if (Number(el) === interview.interviewer) {
        const result = {
          student: interview.student,
          interviewer: state.interviewers[el],
        };

        return result;
      }
    }
  } else {
    return null;
  }
}

// Grab interviews that for one of weekdays
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
