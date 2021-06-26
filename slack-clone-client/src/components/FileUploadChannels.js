import { IconButton } from "@material-ui/core";
import { useDropzone } from "react-dropzone";
import { useContext } from "react";
import { FireBaseContext } from "../index";
import { useMutation, gql } from "@apollo/client";
import AttachFileIcon from "@material-ui/icons/AttachFile";

const FileUploadChannels = (props) => {
  const [onCreateFileMessage, { loading }] = useMutation(CREATE_FILE_MESSAGE);
  const storage = useContext(FireBaseContext);
  var storageRef = storage.ref();
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      storageRef
        .child(
          `images/${acceptedFiles[0].name}&${new Date().getMilliseconds()}`
        )
        .put(acceptedFiles[0])
        .then((snapshot) => {
          console.log(snapshot);
          snapshot.ref.getDownloadURL().then(async (url) => {
            // Insert url into an <img> tag to "download"
            console.log(url);
            await onCreateFileMessage({
              variables: {
                channelId: props.channelId,
                url: url,
                filetype: acceptedFiles[0].type,
              },
            });
          });
        });
    },
  });
  if (loading) {
    return <p>Loading...</p>;
  }
  return (
    <div>
      <div {...getRootProps({ className: "dropzone" })}>
        <input {...getInputProps()} />
        <IconButton disableRipple>
          <AttachFileIcon></AttachFileIcon>
        </IconButton>
      </div>
    </div>
  );
};
const CREATE_FILE_MESSAGE = gql`
  mutation (
    $message: String
    $channelId: Int!
    $filetype: String
    $url: String
  ) {
    createMessage(
      channelId: $channelId
      text: $message
      url: $url
      filetype: $filetype
    )
  }
`;
export default FileUploadChannels;
