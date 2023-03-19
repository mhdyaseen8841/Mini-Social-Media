import React, { useEffect } from "react";
import { useDisclosure, Image, Text } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/button";
import { ViewIcon } from "@chakra-ui/icons";
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
import { Stack, HStack, VStack, Box } from "@chakra-ui/react";
function ProfileModal({ user, children }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {children ? (
        <span onCLick={onOpen}>{children}</span>
      ) : (
        <>
          <HStack pl={5} spacing="24px">
            <Text>
              <b>{user.name}</b>
            </Text>
            <IconButton
              d={{ base: "flex" }}
              icon={<ViewIcon />}
              onClick={onOpen}
            />
          </HStack>
        </>
      )}

      <Modal size="lg" isCentered isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent h="500px">
          <ModalHeader
            fontSize="40px"
            fontFamily="work sans"
            display="flex"
            justifyContent="center"
          >
            {user.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDir="column"
            alignItems="center"
            justifyContent="space-between"
          >
            <Image
              borderRadius="full"
              boxSize="150px"
              src={user.pic}
              alt={user.name}
            />
            <Text
              fontSize={{ base: "20px", md: "30px" }}
              fontFamily="work sans"
            >
              Email: {user.email}
            </Text>

            <Text
              fontSize={{ base: "20px", md: "30px" }}
              fontFamily="work sans"
            >
              Mobile No: {user.mobno}
            </Text>
            <Text
              fontSize={{ base: "10px", md: "20px" }}
              fontFamily="work sans"
            >
              Address: {user.address}
            </Text>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default ProfileModal;
