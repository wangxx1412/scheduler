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
