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

const CREATE_TEAM = gql`
  mutation ($name: String!) {
    createTeam(name: $name) {
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;
const CreateTeam = (props) => {
  const [name, setName] = useState("");

  const [nameError, setNameError] = useState("");

  const [onCreateTeam, { data }] = useMutation(CREATE_TEAM);
  const submit = async () => {
    setNameError("");
    try {
      await onCreateTeam({ variables: { name } });
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (data) {
      const { ok, errors } = data.createTeam;
      console.log(data.createTeam);
      if (ok) {
        console.log(data);
        props.history.push(`view-team/${data.createTeam.team.id}`);
      } else {
        console.log(errors);
        errors.forEach(({ path, message }) => {
          if (path === "name") {
            setNameError(message);
          }
        });
      }
    }
  }, [data, props]);
  const errorList = [];
  if (nameError) {
    errorList.push(nameError);
  }

  return (
    <Container type="text">
      <Header as="h2">Create a Team</Header>
      <Form>
        <FormField error={!!nameError}>
          <Input
            placeholder="Name"
            name="name"
            value={name}
            fluid
            onChange={({ target }) => setName(target.value)}
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

export default CreateTeam;
