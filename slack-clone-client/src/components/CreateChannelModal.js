import React, { useEffect, useState } from "react";

import { TextField, Button } from "@material-ui/core";
import { Formik, ErrorMessage } from "formik";
import { gql, useMutation } from "@apollo/client";
import findIndex from "lodash/findIndex";
import { Checkbox, FormGroup, FormControlLabel } from "@material-ui/core";
import MultiSelectUser from "./MultiSelectUser";

const CREATE_CHANNEL = gql`
  mutation ($teamId: Int!, $name: String!, $public: Boolean, $members: [Int!]) {
    createChannel(
      teamId: $teamId
      name: $name
      public: $public
      members: $members
    ) {
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
      variables: {
        name: values.name,
        teamId: parseInt(props.teamId),
        public: values.public,
        members: values.members.map((m) => m.id),
      },
    })
      .then((res) => {
        setError("");
        props.setShowModal(false);
      })
      .catch((e) => {
        console.log(e.networkError);
        // props.setShowModal(false);
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

  console.log(Error);
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
                    // onClick={() => props.setShowModal(false)}
                  >
                    <span className="opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <Formik
                  initialValues={{ name: "", public: true, members: [] }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.name) {
                      errors.name = "Required";
                    }
                    return errors;
                  }}
                  onSubmit={async (values, { resetForm, setSubmitting }) => {
                    console.log(values);
                    setError("");
                    createChannelSubmit(values);
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
                    setFieldValue,
                    resetForm,
                    /* and other goodies */
                  }) => (
                    <form onSubmit={handleSubmit}>
                      <div className="relative p-8 flex-auto">
                        {console.log(values)}
                        <FormGroup>
                          <TextField
                            error={Error > 0 ? true : false}
                            id="outlined-basic"
                            label="Channel Name"
                            variant="outlined"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="name"
                            value={values.name}
                          />

                          <FormControlLabel
                            control={
                              <Checkbox
                                value={!values.public}
                                color="primary"
                                aria-label="Private"
                                onChange={(e) =>
                                  setFieldValue("public", !e.target.checked)
                                }
                                inputProps={{
                                  "aria-label": "secondary checkbox",
                                }}
                              />
                            }
                            label="Private"
                          />
                          {!values.public ? (
                            <MultiSelectUser
                              teamId={parseInt(props.teamId)}
                              className="mt-4"
                              placeholder="Search Team members"
                              label="Team Members"
                              value={values.member}
                              handleChange={(e, value) => {
                                console.log(e.target);
                                setFieldValue("members", value);
                              }}
                            />
                          ) : null}
                        </FormGroup>
                        <ErrorMessage
                          className="my-2"
                          name="name"
                          component="div"
                        />
                        {Error}
                      </div>
                      {/*footer*/}
                      <div className="flex items-center w-full p-6  border-blueGray-200 rounded-b">
                        <Button
                          type="submit"
                          color="primary"
                          disabled={isSubmitting}
                          fullWidth
                        >
                          Create Channel
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          color="primary"
                          onClick={() => {
                            setError("");
                            props.setShowModal(false);
                          }}
                          fullWidth
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
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
