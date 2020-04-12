import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import PlanCard from "./components/PlanCard"
import api from './api'
import Availabilities from './components/Availabilities';

const Home = () => {
  const user_id = 1;
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    api.plans().getAll().then((res) => setPlans(res.data));
  }, []);

  const Plans = plans.map((plan) => <PlanCard plan={plan} user_id={user_id} />);

  return (
    <>
      <h1>All plans</h1>
      <a href='/plan-form/create'>Create a new plan</a>
      {Plans}
      <h1>My Availabilities</h1>
      <Availabilities user_id={user_id} editable={true}/>
    </>
  );
}

export default Home;
