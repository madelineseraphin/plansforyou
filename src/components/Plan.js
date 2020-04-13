import React, { useState, useEffect } from "react";
import styled from "styled-components";
import moment from "moment";
import api from "../api";
import { formatString } from "../App";

const PlanWrapper = styled.div`
  padding: 10px;
  border: solid 1px black;
`;

const EditDeleteButton = styled.a`
  margin-left: 15px;
`;

const FriendPhoto = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 20px;
`;

const PlanPhoto = styled.img`
  width: 100%;
  max-height: 240px;
  object-fit: cover;
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
  const { first_name, last_name, text, id, friend_id, user_id, friend_photo } = props;
  const myComment = friend_id == user_id;
  const [comment, setComment] = useState(text);
  const [edit, setEdit] = useState(false);
  return (
    <div key={id}>
      <p>
        <FriendPhoto src={friend_photo} />
        <strong>{first_name} {last_name}</strong>
      </p>
      {edit ?
        <>
          <input type="text" value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={() => api.comments().update(id, { comment_text: comment }).then(setEdit(false))}>Save</button>
          <button onClick={() => setEdit(false)}>Cancel</button>
        </>
        :
        <p>
          {text}
        </p>
      }
      {myComment && !edit &&
        <>
          <button onClick={() => setEdit(true)}>Edit Comment</button>
          <button onClick={() => api.comments().delete(id)}>Delete Comment</button>
        </>}
    </div >
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
  const { title, host_name, start_time, end_time, description_text, plan_photo, plan_id, host_id } = planInfo;
  const formatted_start = moment(start_time).format(formatString);
  const duration = moment
    .duration(moment(end_time) - moment(start_time))
    .humanize();

  const RSVPs = planRsvps && planRsvps.map((rsvp) => (
    <RSVP
      first_name={rsvp.first_name}
      rsvp_status={rsvp.rsvp_status}
      id={rsvp.friend_id}
    />
  ));

  const Comments = planComments && planComments.map((c) => (
    <Comment
      first_name={c.first_name}
      last_name={c.last_name}
      text={c.comment_text}
      id={c.comment_id}
      friend_id={c.friend_id}
      user_id={user_id}
      friend_photo={c.friend_photo}
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

  const deletePlan = () => {
    const check = window.confirm("Are you sure you want to delete this plan?");
    if (check) {
      api.plans().delete(plan_id).then(() => props.history.push('/'));
    }
  }

  const goHome = () => {
    props.history.push({
        pathname: '/home',
        state: { user_id: user_id }
    });
};

  return (
    <PlanWrapper>
      <PlanPhoto src={plan_photo} />
      <button onClick={() => goHome()}>Back to homepage</button>
      <h2>{title}</h2>
      {user_id === host_id &&
        <>
          <EditDeleteButton href={`/plan-form/edit/${plan_id}`}>Edit Plan</EditDeleteButton>
          <EditDeleteButton href='#' onClick={() => deletePlan()}>Delete Plan</EditDeleteButton>
        </>
      }
      <p>{host_name}</p>
      <p>When: {formatted_start}</p>
      <p>Lasts {duration}</p>
      <p>Description: {description_text}</p>
      <select id="rsvp_select" value={userRsvp ? userRsvp.status : "n/a"} onChange={(event) => onRSVPSelect(event.target.value)}>
        <option value="going">going</option>
        <option value="maybe">maybe</option>
        <option value="not going">not going</option>
      </select>
      <h3>RSVPs</h3>
      {RSVPs}
      <h3>Comments</h3>
      {Comments}
      <p>Leave a comment:</p>
      <input type="textarea" value={comment} onChange={(e) => setComment(e.target.value)} />
      <button onClick={() => { addComment(comment) }}>Post Comment</button>
    </PlanWrapper>
  );
};

export default Plan;
