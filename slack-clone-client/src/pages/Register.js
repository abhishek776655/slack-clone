import React, { useState } from "react";
import { Input, Header, Container, Button } from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

const RESGISTER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password)
  }
`;
const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = () => {
    console.log("user", { username, email, password });
    onRegister({ variables: { username, email, password } });
  };
  const [onRegister, { data }] = useMutation(RESGISTER);
  if (data) {
    console.log(data);
  }
  return (
    <Container type="text">
      <Header as="h2">Register</Header>
      <Input
        placeholder="username"
        name="username"
        value={username}
        fluid
        onChange={({ target }) => setUsername(target.value)}
      />
      <Input
        placeholder="email"
        name="email"
        value={email}
        fluid
        onChange={({ target }) => setEmail(target.value)}
      />
      <Input
        type="password"
        placeholder="password"
        name="password"
        value={password}
        fluid
        onChange={({ target }) => setPassword(target.value)}
      />
      <Button onClick={onSubmit}>Submit</Button>
    </Container>
  );
};

export default Register;
