import React from "react";
import { gql, useMutation } from "@apollo/client";
import { Input, Form } from "semantic-ui-react";
import { Formik } from "formik";

const CREATE_MESSAGE = gql`
  mutation ($message: String!, $channelId: Int!) {
    createMessage(channelId: $channelId, text: $message)
  }
`;
const SendMessage = ({ channelName, channelId }) => {
  const [onCreateMessage] = useMutation(CREATE_MESSAGE);
  return (
    <div className="m-5">
      <Formik
        initialValues={{ message: "" }}
        validate={(values) => {
          const errors = {};
          if (!values.message) {
            errors.message = "Required";
          }
          return errors;
        }}
      >
        {({
          values,
          handleChange,
          handleBlur,
          handleSubmit,
          resetForm,
          isSubmitting,
          setSubmitting,
          /* and other goodies */
        }) => (
          <Form>
            <div className="relative flex-auto">
              <Input
                fluid
                onKeyDown={async (e) => {
                  console.log(e);
                  if (e.key === "Enter") {
                    console.log("enter");
                    console.log(values);
                    if (!values.message || !values.message.trim()) {
                      setSubmitting(false);
                      console.log(values);
                      return;
                    }
                    try {
                      await onCreateMessage({
                        variables: { channelId, message: values.message },
                      });
                      resetForm();
                    } catch (e) {
                      console.log(e);
                    }
                  }
                }}
                placeholder={`Message # ${channelName}`}
                onChange={handleChange}
                onBlur={handleBlur}
                name="message"
                value={values.message}
              ></Input>
              {/* <ErrorMessage className="my-2" name="name" component="div" />
              {Error} */}
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SendMessage;
