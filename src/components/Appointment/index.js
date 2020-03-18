import React from "react";

import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";

import "./styles.scss";

export default function Appointment(props) {
  return (
    <article className="appointment">
      <Header time={props.time} />
      {props.interview ? (
        <Show
          interviewer={props.interview.interviewer}
          student={props.interview.student}
        />
      ) : (
        <Empty />
      )}
    </article>
  );
}
