import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import PlanCard from "./components/PlanCard"
import api from './api'

export const PageBody = styled.div`
  width: 1100px;
  margin-left: auto;
  margin-right: auto;
`;

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
  console.log(plans)
  const Plans = plans.map((plan) => <PlanCard plan={plan} user_id={user_id} />);
  return (
    <PageBody>
      <h1>All plans</h1>
      {Plans}
      <h1>My Availabilities</h1>
    </PageBody>
  );
}

export default Home;
