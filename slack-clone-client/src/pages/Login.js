import React, { useState, useEffect } from "react";
import {
  Input,
  Header,
  Container,
  Button,
  Form,
  FormField,
  Message,
} from "semantic-ui-react";
import { gql, useMutation } from "@apollo/client";

const LOGIN = gql`
  mutation ($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      refreshToken
      ok
      errors {
        path
        message
      }
    }
  }
`;
const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [onLogin, { data }] = useMutation(LOGIN);
  const submit = () => {
    setPasswordError("");
    setEmailError("");
    try {
      onLogin({ variables: { email, password } });
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data) {
      const { ok, token, refreshToken, errors } = data.login;
      if (ok) {
        localStorage.setItem("token", token);
        localStorage.setItem("refreshToken", refreshToken);
        props.history.push(`view-team`);
      } else {
        errors.forEach(({ path, message }) => {
          if (path === "email") {
            setEmailError(message);
          } else {
            setPasswordError(message);
          }
        });
      }
    }
  }, [data, props.history]);
  const errorList = [];
  if (emailError) {
    errorList.push(emailError);
  }
  if (passwordError) {
    errorList.push(passwordError);
  }
  return (
    <Container type="text">
      <Header as="h2">Login</Header>
      <Form>
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
        <Button onClick={submit}>Submit</Button>
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

export default Login;
