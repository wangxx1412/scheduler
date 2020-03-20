import React from "react";
import useVisualMode from "hooks/useVisualMode";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer
    };
    transition(SAVING);
    props.bookInterview(props.id, interview).then(() => {
      transition(SHOW);
    });
  }

  function deleteInterview() {
    transition(DELETING);
    props.delete(props.id).then(() => {
      transition(EMPTY);
    });
  }

  const onCancel = () => {
    transition(SHOW);
  };

  return (
    <article className="appointment">
      <Header time={props.time} />
      {mode === EMPTY && (
        <Empty
          onAdd={() => {
            transition(CREATE);
          }}
        />
      )}
      {mode === SHOW && (
        <Show
          student={props.interview.student}
          interviewer={props.interview.interviewer}
          onEdit={() => transition(EDIT)}
          onDelete={() => {
            transition(CONFIRM);
          }}
        />
      )}
      {mode === CREATE && (
        <Form
          onCancel={() => back(EMPTY)}
          onSave={save}
          name={props.student}
          interviewers={props.interviewers}
        />
      )}
      {mode === EDIT && (
        <Form
          onCancel={() => back(EMPTY)}
          edit={"edit"}
          interview={props.interview}
          onSave={save}
          name={props.student}
          interviewers={props.interviewers}
        />
      )}
      {mode === SAVING && <Status message={"Saving"} />}
      {mode === DELETING && <Status message={"Deleting"} />}
      {mode === CONFIRM && (
        <Confirm
          onDelete={deleteInterview}
          onCancel={onCancel}
          message={"Are you sure to delete this appointment?"}
        />
      )}
    </article>
  );
}
