import React, { useEffect, useState } from "react";
import { Input, Button, FormField, Form } from "semantic-ui-react";
import { Formik, ErrorMessage } from "formik";
import { gql, useMutation } from "@apollo/client";
import findIndex from "lodash/findIndex";

const CREATE_CHANNEL = gql`
  mutation ($teamId: Int!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
      errors {
        path
        message
      }
    }
  }
`;

export default function Modal(props) {
  console.log(props.teamId);
  const [onCreateChannel, { data }] = useMutation(CREATE_CHANNEL, {
    update(cache, { data: { createChannel } }) {
      const { ok, channel } = createChannel;

      if (!ok) {
        return;
      }
      console.log(channel);
      const data = cache.readQuery({
        query: gql`
          query {
            me {
              id
              email
              username
              teams {
                id
                name
                admin
                channels {
                  id
                  name
                }
              }
            }
          }
        `,
      });
      console.log(data);

      const teamIdx = findIndex(data.me.teams, ["id", parseInt(props.teamId)]);
      const newData = JSON.parse(JSON.stringify(data));

      newData.me.teams[teamIdx].channels.push(channel);

      cache.writeQuery({
        query: gql`
          query {
            me {
              id
              email
              username
              teams {
                id
                name
                admin
                channels {
                  id
                  name
                }
              }
            }
          }
        `,
        data: newData,
      });
    },
  });

  const [Error, setError] = useState("");

  const createChannelSubmit = async (values) => {
    return onCreateChannel({
      variables: { name: values.name, teamId: parseInt(props.teamId) },
    })
      .then((res) => {
        console.log(res);
      })
      .catch((e) => {
        console.log(e.networkError);
        setError(e.message);
      });
  };

  useEffect(() => {
    if (data) {
      const { ok, errors } = data.createChannel;

      if (ok) {
      } else {
        errors.forEach(({ path, message }) => {
          setError(message);
        });
      }
    }
  }, [data, props]);

  console.log(props.showModal);
  return (
    <>
      {props.showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-1/2">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5  border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold">Add Channel</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => props.setShowModal(false)}
                  >
                    <span className="opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <Formik
                  initialValues={{ name: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                      errors.name = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    console.log(values);
                    setError("");
                    createChannelSubmit(values).then((res) => {
                      props.setShowModal(false);
                    });

                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    /* and other goodies */
                  }) => (
                    <Form onSubmit={handleSubmit}>
                      <div className="relative p-6 flex-auto">
                        <FormField error={!!Error}>
                          <Input
                            className="w-full"
                            fluid
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="name"
                            value={values.name}
                          />
                        </FormField>
                        <ErrorMessage
                          className="my-2"
                          name="name"
                          component="div"
                        />
                        {Error}
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6  border-blueGray-200 rounded-b">
                        <Button type="submit" disabled={isSubmitting} fluid>
                          Create Channel
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          onClick={() => {
                            setError("");
                            props.setShowModal(false);
                          }}
                          fluid
                        >
                          Cancel
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
