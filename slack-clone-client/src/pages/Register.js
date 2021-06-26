import React, { useState, useEffect } from "react";
import {
  Input,
  Header,
  Container,
  Button,
  Message,
  Form,
  FormField,
} from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

const RESGISTER = gql`
  mutation ($username: String!, $email: String!, $password: String!) {
    register(username: $username, email: $email, password: $password) {
      ok
      errors {
        path
        message
      }
    }
  }
`;
const Register = (props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const onSubmit = async (props) => {
    setPasswordError("");
    setUsernameError("");
    setEmailError("");
    onRegister({ variables: { username, email, password } });
  };
  const [onRegister, { data }] = useMutation(RESGISTER);

  useEffect(() => {
    if (data) {
      const { ok, errors } = data.register;
      if (ok) {
        props.history.push("/login");
      } else {
        errors.forEach(({ path, message }) => {
          if (path === "username") {
            setUsernameError(message);
          } else if (path === "email") {
            setEmailError(message);
          } else {
            setPasswordError(message);
          }
        });
      }
    }
  }, [data, props.history]);
  const errorList = [];
  if (usernameError) {
    errorList.push(usernameError);
  }
  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }
  return (
    <Container type="text">
      <Header as="h2">Register</Header>
      <Form>
        <FormField error={!!usernameError}>
          <Input
            placeholder="username"
            name="username"
            value={username}
            fluid
            onChange={({ target }) => setUsername(target.value)}
          />
        </FormField>
        <FormField error={!!emailError}>
          <Input
            placeholder="email"
            name="email"
            value={email}
            fluid
            onChange={({ target }) => setEmail(target.value)}
          />
        </FormField>
        <FormField error={!!passwordError}>
          <Input
            type="password"
            placeholder="password"
            name="password"
            value={password}
            fluid
            onChange={({ target }) => setPassword(target.value)}
          />
        </FormField>
        <Button onClick={onSubmit}>Submit</Button>
      </Form>
      {errorList.length !== 0 ? (
        <Message
          error
          header="There was some error with your submission"
          list={errorList}
        />
      ) : null}
    </Container>
  );
};

export default Register;
