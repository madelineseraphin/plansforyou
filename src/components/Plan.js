import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import api from "../api";
import { formatString } from "../App";

const PlanWrapper = styled.div`
  padding: 10px;
  border: solid 1px black;
`;

const RSVP = (props) => {
  const { first_name, rsvp_status, id } = props;
  return (
    <p key={id}>
      {first_name}: {rsvp_status}
    </p>
  );
};

const Plan = (props) => {
  const { id, user_id } = props;
  const [planObject, setPlanObject] = useState({
    plan: [],
    rsvps: [],
    comments: [],
  });
  useEffect(() => {
    api
      .plans()
      .getOne(id)
      .then((res) => setPlanObject(res.data));
  });
  const planInfo = planObject.plan[0] || {};
  const planRsvps = planObject.rsvps;
  const planComments = planObject.comments;
  const { title, host_name, start_time, end_time, plan_id } = planInfo;
  const formatted_start = moment(start_time).format(formatString);
  const duration = moment
    .duration(moment(end_time) - moment(start_time))
    .humanize();

  const RSVPs = planRsvps.map((rsvp) => (
    <RSVP
      first_name={rsvp.first_name}
      rsvp_status={rsvp.rsvp_status}
      id={rsvp.friend_id}
    />
  ));
  return (
    <PlanWrapper>
      <h1>{title}</h1>
      <p>{host_name}</p>
      <p>When: {formatted_start}</p>
      <p>Lasts {duration}</p>
      <h2>RSVPs</h2>
      {RSVPs}
    </PlanWrapper>
  );
};

export default Plan;
