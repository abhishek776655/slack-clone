import React from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { FormField, Form, Button } from "semantic-ui-react";
import TextField from "@material-ui/core/TextField";
import { gql, useQuery } from "@apollo/client";
import { useHistory } from "react-router-dom";

const GET_TEAM_MEMBER = gql`
  query ($teamId: Int!) {
    getTeamMembers(teamId: $teamId) {
      username
      id
      email
    }
  }
`;
export default function DirectMessageModal(props) {
  let history = useHistory();
  const { data, error } = useQuery(GET_TEAM_MEMBER, {
    variables: {
      teamId: props.teamId,
    },
  });
  if (error) {
    return;
  }
  let membersData = [];
  if (data) {
    membersData = data.getTeamMembers.map((m) => {
      return {
        ...m,
        title: m.username,
      };
    });
  }
  console.log(data);
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

                <Form>
                  <div className="relative p-6 flex-auto">
                    <FormField>
                      <Autocomplete
                        options={membersData}
                        getOptionLabel={(option) => option.title}
                        freeSolo
                        onChange={(event, value) => {
                          if (value) {
                            props.setShowModal(false);
                            return history.push(
                              `/view-team/user/${props.teamId}/${value.id}`
                            );
                          }
                        }}
                        loadingText={false}
                        id="free-solo-demo"
                        renderInput={(params) => (
                          <TextField
                            style={{
                              width: "100%",
                              borderWidth: "0px",
                            }}
                            {...params}
                            label="search user"
                            margin="normal"
                            variant="outlined"
                          />
                        )}
                      />
                    </FormField>
                  </div>

                  <div className="flex items-center justify-end p-6  border-blueGray-200 rounded-b">
                    <Button
                      onClick={() => {
                        props.setShowModal(false);
                      }}
                      fluid
                    >
                      Close
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
