import React, { useEffect, useState } from "react";
import { Input, Button, FormField, Form } from "semantic-ui-react";
import { Formik, ErrorMessage } from "formik";
import { gql, useMutation } from "@apollo/client";

const INIVITE_PEOPLE = gql`
  mutation ($email: String!, $teamId: Int!) {
    inviteMember(email: $email, teamId: $teamId) {
      ok
      errors {
        path
        message
      }
    }
  }
`;

export default function InvitePeopleModal(props) {
  const [onInviteMember, { data }] = useMutation(INIVITE_PEOPLE);

  const [Error, setError] = useState("");

  const inviteMemberSubmit = async (values) => {
    try {
      setError("");
      await onInviteMember({
        variables: { email: values.email, teamId: parseInt(props.teamId) },
      });
    } catch (e) {
      console.log(e);
      setError(e.message);
    }
  };

  useEffect(() => {
    if (data) {
      const { ok, errors } = data.inviteMember;

      if (ok) {
        props.setOpenInviteModal(false);
      } else {
        errors.forEach(({ path, message }) => {
          setError(message);
        });
      }
    }
  }, [data, props.setOpenInviteModal]);

  return (
    <>
      {props.openInviteModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative my-6 mx-auto w-1/2">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5  border-blueGray-200 rounded-t">
                  <h3 className="text-xl font-semibold">Invite Member</h3>
                  <button
                    className="p-1 ml-auto bg-transparent border-0 text-black opacity-5 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => props.setOpenInviteModal(false)}
                  >
                    <span className="opacity-5 h-6 w-6 text-2xl block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                <Formik
                  initialValues={{ email: "" }}
                  validate={(values) => {
                    const errors = {};
                    if (!values.email) {
                      errors.email = "Required";
                    }
                    console.log(errors);
                    return errors;
                  }}
                  onSubmit={(values, { setSubmitting }) => {
                    setError("");
                    inviteMemberSubmit(values);
                    setSubmitting(false);
                  }}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    setErrors,
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
                            name="email"
                            value={values.email}
                          />
                        </FormField>
                        <ErrorMessage
                          className="my-2"
                          name="name"
                          component="div"
                        />
                        {Error}
                        {errors.email}
                      </div>
                      {/*footer*/}
                      <div className="flex items-center justify-end p-6  border-blueGray-200 rounded-b">
                        <Button type="submit" disabled={isSubmitting} fluid>
                          Invite
                        </Button>
                        <Button
                          disabled={isSubmitting}
                          onClick={() => {
                            setError("");
                            props.setOpenInviteModal(false);
                          }}
                          fluid
                        >
                          Close
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
