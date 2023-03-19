import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, {useEffect, useState} from 'react'

import { ChatState } from '../../Context/EssentialProvider'

import { Avatar } from "@chakra-ui/avatar";
import "./styles.css"





function SingleProfile() {

    const toast = useToast()

const [loading,setLoading] = useState(false)


const {user,selectedFriend,setSelectedFriend, notifications,setNotifications} = ChatState()



useEffect(() => {
   

}, [selectedFriend])










  return (
    <>
{selectedFriend ? (
    <>
    <Text
        fontSize={{ base: "28px", md: "30px" }}
        pb={3}
        px={2}
        w="100%"
        fontFamily="Work sans"
        display="flex"
        justifyContent={{ base: "space-between" }}
        alignItems="center"
        >
   <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedFriend("")}
            />
{selectedFriend.name}
           
    </Text>
    <Box
    display="flex"
    flexDir="column"
    justifyContent="center"
    p={3}
    bg="#E8E8E8"
    w="100%"
    h="100%"
    borderRadius="lg"
    overflowY="hidden"
    >
{loading?(
    <Spinner 
    size="xl"
    w={20}
    h={20}
    alignSelf="center"
    margin="auto"
    />
):(
  <div className=''>
<Box
 display="flex"
 flexDir="column"
 alignItems="center"   // Add this line to center align the contents
 p={3}
 bg="#E8E8E8"
 w="100%"
 h="100%"
 borderRadius="lg"
 overflowY="hidden">
<Avatar
 
 size="xl"
 
  cursor="pointer"
  name={selectedFriend.name}
  src={selectedFriend.pic}
/>
<Text>
    Full Name: <b> {selectedFriend.name}</b>
   
</Text>
<Text>
ADDRESS: <b> {selectedFriend.address}</b>
   
</Text>
<Text>
MOB NO: <b> {selectedFriend.mobno}</b>
   
</Text>
<Text>
Email ID: <b> {selectedFriend.email}</b>
   
</Text>

</Box>


  </div>
)}

    </Box>
    </>
):
(
 <Box display="flex" alignItems="center" justifyContent="center"  h="100%">
<Text
fontSize="3xl" pb={3} fontFamily="work sans"
>
    Click on a user to View Profile
</Text>
    </Box>
)

}

    </>
  )
}

export default SingleProfile