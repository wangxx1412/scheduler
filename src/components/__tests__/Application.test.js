import React from "react";
import axios from "__mocks__/axios";
import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

it("defaults to Monday and changes the schedule when a new day is selected", async () => {
  let days, appointments, interviewers;
  Promise.all([
    Promise.resolve(axios.get("/api/days")),
    Promise.resolve(axios.get("/api/appointments")),
    Promise.resolve(axios.get("/api/interviewers"))
  ]).then(all => {
    (days = all[0].data),
      (appointments = all[1].data),
      (interviewers = all[2].data);
  });

  const { getByText } = render(
    <Application
      days={days}
      appointments={appointments}
      interviewers={interviewers}
    />
  );

  await waitForElement(() => getByText("Monday"));
  fireEvent.click(getByText("Tuesday"));
  expect(getByText("Leopold Silvers")).toBeInTheDocument();
});
