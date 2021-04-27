import React from "react";
import { gql, useQuery } from "@apollo/client";

const Home = () => {
  const GET_USERS = gql`
    query Getusers {
      allUsers {
        username
        email
        id
      }
    }
  `;
  const { loading, error, data } = useQuery(GET_USERS);
  console.log(error);
  if (loading) return "Loading...";
  if (error) return `Error! ${error}`;
  return (
    <div>
      {data.allUsers.map((item) => (
        <h1>{item.email}</h1>
      ))}
    </div>
  );
};

export default Home;
