import { Box, Stack, useToast,Text } from '@chakra-ui/react';
import React,{useState,useEffect} from 'react'
import { ChatState } from '../../Context/ChatProvider'
import axios from 'axios'

import ChatLoading from './ChatLoading';

import { Avatar } from "@chakra-ui/avatar";

function MyFreinds({fetchAgain}) {

const [loggedUser, setLoggedUser] = useState();

  const {selectedFriend, setSelectedFriend, user, setFriends,friends} = ChatState()

const toast = useToast();

const getFriends = async  () => {

  try{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }
    const {data} = await axios.post(`/api/user/viewAllFriends`,{}, config)
    setFriends(data)
  }catch(error){
    toast({
      title: "Error Occured! ",
      description: "Failed to fetch Friends! ",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
  }
}

useEffect(() => {
  setLoggedUser(JSON.parse(localStorage.getItem('userInfo')))
  getFriends()
}, [])


  return (
   <Box 
   display={{base: selectedFriend ? "none" : "flex", md: "flex"}}
   flexDir="column"
   alignItems="center"
   p={3}
   bg="white"
   w={{base: "100%", md: "31%"}}
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
     alignItems="center">
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

{friends?(
<Stack >
{
  friends.map((friend)=>(
    <Box
    onClick={() => setSelectedFriend(friend)}
    cursor="pointer"
    bg={selectedFriend === friend ? "#38B2AC" : "#E8E8E8"}
    color={selectedFriend === friend ? "white" : "black"}
    px={3}
    py={2}
    borderRadius="lg"
    key={friend._id}
    >
<Avatar

  mr={2}
  size="sm"
  cursor="pointer"
  name={friend.name}
  src={friend.pic}
/>
<Box>
  <Text  >{friend.name}</Text>
  <Text fontSize="xs">
    <b>Email:</b> {friend.email}
  </Text>
 
  
</Box>
    </Box>
  
  ))
}
</Stack>
):(
<ChatLoading/>
)}
        </Box>  

   </Box>
  )
}

export default MyFreinds