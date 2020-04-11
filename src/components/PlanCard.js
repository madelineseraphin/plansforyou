import React from "react";
import styled from "styled-components";
import moment from "moment";
import { formatString } from "../App"

const PlanCardWrapper = styled.div`
  padding: 10px;
  border: solid 1px black;
`;

const PlanCard = props => {
  const { plan, user_id } = props;
  const { title, host_name, start_time, end_time, plan_id } = plan;
  const formatted_start = moment(start_time).format(formatString);
  const duration = moment.duration(moment(end_time) - moment(start_time)).humanize();
  return (
    <PlanCardWrapper>
      <p>{title}</p>
      <p>{host_name}</p>
      <p>When: {formatted_start}</p>
      <p>Lasts {duration}</p>
    </PlanCardWrapper>
  );
};

export default PlanCard;
