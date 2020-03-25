import React from "react";
import axios from "__mocks__/axios";
import {
  getByText,
  getByAltText,
  getByPlaceholderText,
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getAllByTestId,
  prettyDOM,
  waitForElementToBeRemoved,
  queryByText
} from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
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

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container } = render(<Application />);

    // use imported getByText for scoped(container) queries
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    await axios.put();

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    //OR await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    expect(getByText(appointment, "Lydia Miller-Jones")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    expect(
      getByText(appointment, "Are you sure to delete this appointment?")
    ).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));

    await axios.delete();

    expect(queryByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(getByAltText(appointment, "Add")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "2 spots remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Edit"));

    expect(getByText(appointment, "Save")).toBeInTheDocument();

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Someone else" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    await axios.put();

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(getByText(appointment, "Someone else")).toBeInTheDocument();

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );

    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    await axios.put.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, "Enter Student Name"), {
      target: { value: "Lydia Miller-Jones" }
    });

    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    fireEvent.click(getByText(appointment, "Save"));

    await waitForElementToBeRemoved(() => getByText(appointment, "Saving"));

    expect(
      getByText(appointment, "Could not save the appointment.")
    ).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByText(appointment, "Save")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    await axios.delete.mockRejectedValueOnce();

    const { container } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(container, "appointment")[1];

    fireEvent.click(getByAltText(appointment, "Delete"));

    fireEvent.click(getByText(appointment, "Confirm"));

    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    expect(
      getByText(appointment, "Could not delete the appointment.")
    ).toBeInTheDocument();

    fireEvent.click(getByAltText(appointment, "Close"));

    expect(getByAltText(appointment, "Delete")).toBeInTheDocument();
  });
});
