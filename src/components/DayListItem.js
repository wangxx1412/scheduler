import React from "react";
import classNames from "classnames";
import "components/DayListItem.scss";

export default function DayListItem(props) {
  const dayListClass = classNames("day-list__item", props.className, {
    "day-list__item--selected": props.selected,
    "day-list__item--full": props.spots === 0
  });

  const formatSpots = spots => {
    return spots === 0
      ? "no spots remaining"
      : spots === 1
      ? "1 spot remaining"
      : `${spots} spots remaining`;
  };

  return (
    <li
      onClick={() => props.setDay(props.name)}
      className={dayListClass}
      data-testid="day"
    >
      <h2 className="text--regular">{props.name}</h2>
      <h3 className="text--light">{formatSpots(props.spots)}</h3>
    </li>
  );
}
