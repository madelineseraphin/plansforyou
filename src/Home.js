import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import PlanCard from "./components/PlanCard"
import api from './api'

const Home = () => {
  const user_id = 1;
  const [plans, setPlans] = useState([]);
  useEffect(() => {
    api.plans().getAll().then((res) => setPlans(res.data));
  }, []);

  const myAvailibilities = [
    {
      availability_id: 1,
      start_date: '2020-04-24 18:00:00',
      end_date: '2020-04-24 22:00:00'
    }
  ]

  const Plans = plans.map((plan) => <PlanCard plan={plan} user_id={user_id} />);
  
  return (
    <>
      <h1>All plans</h1>
      <a href='/plan-form/create'>Create a new plan</a>
      {Plans}
      <h1>My Availabilities</h1>
    </>
  );
}

export default Home;
