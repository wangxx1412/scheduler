import React from "react";
import useVisualMode from "hooks/useVisualMode";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import Form from "./Form";
import Status from "./Status";
import Confirm from "./Confirm";
import Error from "./Error";

import "./styles.scss";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  );

  function save(name, interviewer) {
    const interview = {
      student: name,
      interviewer,
    };
    transition(SAVING);

    // If either student or interviewer is not fulfilled, transition back to Create mode
    if (!(interview.student && interview.interviewer)) {
      transition(CREATE);
    } else {
      props
        .bookInterview(props.id, interview)
        .then(() => {
          transition(SHOW);
        })
        .catch((e) => {
          transition(ERROR_SAVE, true);
        });
    }
  }

  function deleteInterview() {
    transition(DELETING, true);
    props
      .delete(props.id)
      .then(() => {
        transition(EMPTY);
      })
      .catch((e) => {
        transition(ERROR_DELETE, true);
      });
  }

  const onCancel = () => {
    transition(SHOW);
  };

  return (
    <article className="appointment" data-testid="appointment">
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
          onCancel={() => back()}
          onSave={save}
          name={props.student}
          interviewers={props.interviewers}
        />
      )}
      {mode === EDIT && (
        <Form
          onCancel={() => back()}
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
      {mode === ERROR_SAVE && (
        <Error
          message="Could not save the appointment."
          onClose={() => {
            back();
          }}
        />
      )}
      {mode === ERROR_DELETE && (
        <Error
          message="Could not delete the appointment."
          onClose={() => {
            back();
          }}
        />
      )}
    </article>
  );
}
