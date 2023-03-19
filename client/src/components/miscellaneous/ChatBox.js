import { Box } from "@chakra-ui/layout";

import { ChatState } from "../../Context/ChatProvider";
import SingleProfile from "./SingleProfile";

const Chatbox = () => {
  const { selectedFriend } = ChatState();

  return (
    <Box
      display={{ base: selectedFriend ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleProfile  />
    </Box>
  );
};

export default Chatbox;