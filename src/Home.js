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

  const Plans = plans.map((plan) => <PlanCard plan={plan} user_id={user_id} />);

  return (
    <>
      <h2>All plans</h2>
      <a href={`/plan-form/create/${user_id}`}>Create a new plan</a>
      {Plans}
      <h2>My Availabilities</h2>
      <Availabilities user_id={user_id} editable={true} />
    </>
  );
}

export default Home;
