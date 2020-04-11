import React, { useState } from 'react';
import styled from "styled-components";
import PlanCard from "./components/PlanCard"

export const formatString = "dddd, MMMM Do YYYY @ h:mm:ss a"

export const PageBody = styled.div`
  width: 1100px;
  margin-left: auto;
  margin-right: auto;
`;

const App = () => {
  // const [plans, setPlans] = useState({});
  const plans = [
    {plan_id: 1,
    title: 'Larz Anderson Park',
    description_text: 'come hang out w us',
    plan_photo: '',
    start_time: '2020-04-24 20:00:00',
    end_time: '2020-04-24 22:00:00',
    host_name: 'Ian Anderson',
    comments: [
      {
        friend_name: 'Maddie',
        comment_text: 'sounds fun'
      },
      {
        friend_name: 'Billie',
        comment_text: 'i guess ill come'
      }
    ],
    rsvps: [
      {
        friend_name: "maddie",
        response: "going"
      }
    ]
  }
  ]

  const myAvailibilities = [
    {
      availability_id: 1,
      start_date: '2020-04-24 18:00:00',
      end_date: '2020-04-24 22:00:00'
    }
  ]

  const Plans = plans.map((plan) => <PlanCard plan={plan} />);
  return (
    <PageBody>
      <h1>All plans</h1>
      {Plans}
      <h1>My Availabilities</h1>
    </PageBody>
  );
}

export default App;
