import React, { useState } from "react";
import Channels from "../components/Channels";
import Teams from "../components/Teams";
import CreateChannelModal from "../components/CreateChannelModal";
import DirectMessageModal from "../components/DirectMessageModal";
import InvitePeopleModal from "../components/InvitePeopleModal";

const Sidebar = (props) => {
  const { teams, team, username } = props;
  const [openModal, setOpenModal] = useState(false);
  const [openInviteModal, setOpenInviteModal] = useState(false);
  const [openDirectMessageModal, setOpenDirectMessageModal] = useState(false);
  console.log(props.currentUserId);
  return (
    <div className="grid h-full grid-cols-sidebar">
      <Teams teams={teams} />

      <Channels
        teamName={team.name}
        isOwner={team.admin}
        username={username}
        channels={team.channels}
        users={team.directMessageMembers}
        setOpenModal={setOpenModal}
        setOpenInviteModal={setOpenInviteModal}
        teamId={team.id}
        directMessageClick={setOpenDirectMessageModal}
      />
      <CreateChannelModal
        showModal={openModal}
        setShowModal={setOpenModal}
        teamId={team.id}
        currentUserId={props.currentUserId}
      />
      <DirectMessageModal
        showModal={openDirectMessageModal}
        setShowModal={setOpenDirectMessageModal}
        teamId={team.id}
      />
      <InvitePeopleModal
        setOpenInviteModal={setOpenInviteModal}
        openInviteModal={openInviteModal}
        teamId={team.id}
      />
    </div>
  );
};

export default Sidebar;
Sidebar.whyDidYouRender = true;
