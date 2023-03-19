import { logDOM } from '@testing-library/react'
import React from 'react'
import axios from 'axios'
import {ChatState} from '../Context/EssentialProvider'
import { useEffect ,useState} from 'react'
import { Box,useToast } from '@chakra-ui/react'
import SideDrawer from '../components/miscellaneous/SideDrawer'
import MyFreinds from '../components/miscellaneous/MyFriends'
import ProfileBox from '../components/miscellaneous/ProfileBox'
import { useNavigate } from 'react-router-dom';

function MainPage() {

    const toast = useToast()
    const {selectedFriend, setSelectedFriend, user, setFriends,friends} = ChatState()

    const Navigate = useNavigate();
    

const fetchFriends = async  () => {

    try{
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
      const {data} = await axios.post(`/api/user/viewAllFriends`,{}, config)
      setFriends(data)
      console.log("heeheeee")
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

 if(!user){
    Navigate("/")
 }


}, [])



    return (
    <div style={{width: "100%"}}>
{user && <SideDrawer fetchFriends={fetchFriends} />}
<Box
display='flex'
justifyContent='space-between'
w='100%'
h='91.5vh'
p='10px'
>
    {user && <MyFreinds fetchFriends={fetchFriends} />}
    {user && <ProfileBox  />}
</Box>
    </div>
  )
}

export default MainPage