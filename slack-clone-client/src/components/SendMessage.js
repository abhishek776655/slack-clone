import React, { useState } from "react";
import { Input, Form } from "semantic-ui-react";
import { Formik } from "formik";
import FileUploadChannels from "./FileUploadChannels";
import FileUploadDirectMessage from "./FileUploadDirectMessage";

const SendMessage = ({
  placeholder,
  onSubmit,
  channelId,
  isDirectMessage,
  teamId,
  userId,
}) => {
  return (
    <div className="m-2">
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
            <div className="relative flex-auto grid grid-cols-sendMessageGrid">
              {isDirectMessage ? (
                <FileUploadDirectMessage
                  teamId={teamId}
                  userId={userId}
                ></FileUploadDirectMessage>
              ) : (
                <FileUploadChannels channelId={channelId}></FileUploadChannels>
              )}

              <Input
                onKeyDown={async (e) => {
                  if (e.key === "Enter") {
                    if (!values.message || !values.message.trim()) {
                      setSubmitting(false);
                      return;
                    }
                    try {
                      await onSubmit(values.message);
                      resetForm();
                    } catch (e) {
                      console.log(e.message);
                    }
                  }
                }}
                placeholder={`Message # ${placeholder}`}
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
