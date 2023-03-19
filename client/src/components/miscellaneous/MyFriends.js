import { Box, Stack, useToast, Text } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { ChatState } from "../../Context/EssentialProvider";
import axios from "axios";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";
import { Tooltip } from "@chakra-ui/react";
import ChatLoading from "./ChatLoading";

import { Avatar } from "@chakra-ui/avatar";

function MyFreinds({ fetchFriends }) {
  const [loggedUser, setLoggedUser] = useState();

  const { selectedFriend, setSelectedFriend, user, setFriends, friends } =
    ChatState();

  const toast = useToast();

  const unfriendHandle = async (uid) => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `/api/user/removeFriend`,
        { id: uid },
        config
      );
      fetchFriends();
      toast({
        title: "Friend removed",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      fetchFriends();
      toast({
        title: err.response.data.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchFriends();
  }, [friends]);

  return (
    <Box
      display={{ base: selectedFriend ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Friends
      </Box>

      <Box
        d="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {friends ? (
          <Stack>
            {friends.map((friend) => (
              <Box
                cursor="pointer"
                bg={selectedFriend === friend ? "#38B2AC" : "#E8E8E8"}
                color={selectedFriend === friend ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={friend._id}
              >
                <Avatar
                  onClick={() => setSelectedFriend(friend)}
                  mr={2}
                  size="sm"
                  cursor="pointer"
                  name={friend.name}
                  src={friend.pic}
                />
                <Box>
                  <Text onClick={() => setSelectedFriend(friend)}>
                    {friend.name}
                  </Text>
                  <Text onClick={() => setSelectedFriend(friend)} fontSize="xs">
                    <b>Email:</b> {friend.email}
                  </Text>
                  <Tooltip label="UnFriend">
                    <Box onClick={() => unfriendHandle(friend._id)}>
                      <FaUserTimes
                        style={{ color: "#D0342C", float: "right" }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
}

export default MyFreinds;
