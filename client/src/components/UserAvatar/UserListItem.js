import { Avatar } from "@chakra-ui/avatar";
import { Box, Text, VStack } from "@chakra-ui/layout";
import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import { useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";

import axios from "axios";

//chakraa ui icons
import { ChatState } from "../../Context/EssentialProvider";
import { Flex } from "@chakra-ui/react";
import { FaUserPlus, FaUserTimes } from "react-icons/fa";

const UserListItem = ({ Suser, handleFunction, display }) => {
  const [mutual, setMutual] = useState([]);
  const { user } = ChatState();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const handleMutualFriend = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };

    const { data } = await axios.post(
      `/api/user/viewMutualFriends`,
      { id: Suser._id },
      config
    );
    setMutual(data);
    onOpen();
  };

  const unfriendHandle = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `/api/user/removeFriend`,
        { id: Suser._id },
        config
      );
      display();
      toast({
        title: "Friend removed",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      display();
      toast({
        title: err.response.data.message,
        status: "error",
        isClosable: true,
      });
    }
  };

  const addFriendHandle = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    };
    try {
      const { data } = await axios.post(
        `/api/user/friendReq`,
        { userid: Suser._id },
        config
      );
      display();
      toast({
        title: "request sent",
        status: "success",
        isClosable: true,
      });
    } catch (err) {
      display();
      toast({
        title: err.response.data.message,
        status: "error",
        isClosable: true,
      });
    }
  };
  return (
    <>
      <Modal onClose={onClose} size="xs" isOpen={isOpen}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mutual Friends</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {mutual.map((Muser) => {
              return (
                <Box
                  cursor="pointer"
                  bg="#E8E8E8"
                  _hover={{
                    background: "#38B2AC",
                    color: "white",
                  }}
                  w="100%"
                  d="flex"
                  alignItems="center"
                  color="black"
                  px={3}
                  py={2}
                  mb={2}
                  borderRadius="lg"
                >
                  <Avatar
                    onClick={handleFunction}
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={Muser.name}
                    src={Muser.pic}
                  />
                  <Box>
                    <Text onClick={handleFunction}>{Muser.name}</Text>
                    <Text fontSize="xs" onClick={handleFunction}>
                      <b>Email:</b> {Muser.email}
                    </Text>
                  </Box>
                </Box>
              );
            })}
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Close</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Box
        cursor="pointer"
        bg="#E8E8E8"
        _hover={{
          background: "#38B2AC",
          color: "white",
        }}
        w="100%"
        d="flex"
        alignItems="center"
        color="black"
        px={3}
        py={2}
        mb={2}
        borderRadius="lg"
      >
        <Avatar
          onClick={handleFunction}
          mr={2}
          size="sm"
          cursor="pointer"
          name={Suser.name}
          src={Suser.pic}
        />
        <Box>
          <Text onClick={handleFunction}>{Suser.name}</Text>
          <Text fontSize="xs" onClick={handleFunction}>
            <b>Email:</b> {Suser.email}
          </Text>

          <Flex alignItems="center">
            <Text fontSize="xs">
              {Suser.mutualCount > 0 ? (
                <>
                  <h3>{Suser.mutualCount} MutualFriend</h3>
                  <h3 onClick={handleMutualFriend}>View All MutualFriend </h3>
                </>
              ) : (
                <>
                  <h3>No Mutual Friend</h3>
                </>
              )}
            </Text>
            <Box ml="auto">
              {Suser.friend ? (
                <FaUserTimes
                  style={{ color: "#D0342C" }}
                  onClick={unfriendHandle}
                />
              ) : (
                <FaUserPlus
                  style={{ color: "#4267B2" }}
                  onClick={addFriendHandle}
                />
              )}
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
};

export default UserListItem;
