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

const Comment = (props) => {
  const { first_name, last_name, text, id } = props;
  return (
    <div key={id}>
      <p>
        <strong>{first_name} {last_name}</strong>
      </p>
      <p>
        {text}
      </p>
    </div>
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
  const [comment, setComment] = useState('');
  const planInfo = planObject.plan[0] || {};
  const planRsvps = planObject.rsvps;
  const userRsvp = planRsvps.find((r) => r.friend_id = user_id);
  const planComments = planObject.comments;
  const { title, host_name, start_time, end_time, plan_photo, plan_id } = planInfo;
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

  const Comments = planComments.map((c) => (
    <Comment
      first_name={c.first_name}
      last_name={c.last_name}
      text={c.comment_text}
      id={c.comment_id}
    />
  ));

  const onRSVPSelect = (status) => {
    api.rsvps().upsert(user_id, plan_id, { ...userRsvp, rsvp_status: status });
  };

  const addComment = (text) => {
    console.log(text);
    const comment =
    {
      "plan_id": plan_id,
      "friend_id": user_id,
      "comment_text": text
    };
    console.log(comment);
    api.comments().create(comment);
  };

  return (
    <PlanWrapper>
      <h1>{title}</h1>
      <p>{host_name}</p>
      <p>When: {formatted_start}</p>
      <p>Lasts {duration}</p>
      <select id="rsvp_select" value={userRsvp ? userRsvp.status : "n/a"} onChange={(event) => onRSVPSelect(event.target.value)}>
        <option value="going">going</option>
        <option value="maybe">maybe</option>
        <option value="not going">not going</option>
      </select>
      <h2>RSVPs</h2>
      {RSVPs}
      <h2>Comments</h2>
      {Comments}
      <p>Leave a comment:</p>
      <input type="textarea" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={() => {addComment(comment)}}>Post Comment</button>
    </PlanWrapper>
  );
};

export default Plan;
