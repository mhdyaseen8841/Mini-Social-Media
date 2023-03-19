import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import axios from 'axios'
import React, {useEffect, useState} from 'react'

import { ChatState } from '../../Context/ChatProvider'
import ProfileModal from './ProfileModal'
import { Avatar } from "@chakra-ui/avatar";
import "./styles.css"
import ScrollableChat from './ScrollableChat'





function SingleProfile() {

    const toast = useToast()

const [loading,setLoading] = useState(false)


const {user,selectedFriend,setSelectedFriend, notifications,setNotifications} = ChatState()

const [friend,setFriend] = useState([])

// const getProfile = async  () => {

//   try{
//     const config = {
//       headers: {
//         Authorization: `Bearer ${user.token}`,
//       },
//     }
//     const {data} = await axios.post(`/api/user/viewUserProfile`,{id:selectedFriend._id}, config)
//     setFriend(data)
//     console.log(data)
//   }catch(error){
//     toast({
//       title: "Error Occured! ",
//       description: "Failed to fetch Friend! ",
//       status: "error",
//       duration: 5000,
//       isClosable: true,
//       position: "bottom-left"
//     })
//   }
// }

useEffect(() => {
    console.log(selectedFriend)

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