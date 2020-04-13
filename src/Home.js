import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import PlanCard from "./components/PlanCard"
import api from './api'
import Availabilities from './components/Availabilities';

const Home = (props) => {
  const user_id = props.location.state.user_id;
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    api.plans().getAll().then((res) => setPlans(res.data));
  }, []);

  const [user, setUser] = useState({});

  useEffect(() => {
    api.friends().getOne(user_id).then((res) => res.data && setUser({name: res.data[0].first_name, id: res.data[0].friend_id}));
  }, [user_id]);

  const Plans = plans.map((plan) => <PlanCard plan={plan} user_id={user_id} />);

  return (
    <>
    <p>Logged in as <strong>{user.name}</strong>, user id is {user.id}</p>
      <h2>All plans</h2>
      <a href={`/plan-form/create/${user_id}`}>Create a new plan</a>
      {Plans}
      <h2>My Availabilities</h2>
      <Availabilities user_id={user_id} editable={true} />
    </>
  );
}

export default Home;
