import { Box, Tooltip, Button, Text, Menu, MenuButton, MenuList, MenuItem, MenuDivider,Drawer, useDisclosure,Image, DrawerContent,DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerCloseButton,Input, useToast } from "@chakra-ui/react";
  import NotificationBadge from 'react-notification-badge';
import {Effect} from 'react-notification-badge';
import { FaCheck,FaTimes } from "react-icons/fa";

import React, {useEffect, useState} from 'react'

import {BellIcon,ChevronDownIcon} from '@chakra-ui/icons'
import { Avatar, AvatarBadge, AvatarGroup } from '@chakra-ui/react'
import { ChatState } from "../../Context/EssentialProvider";
import {Spinner} from "@chakra-ui/spinner"
import ProfileModal from "./ProfileModal";
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

function SideDrawer({fetchFriends}) {
  const toast = useToast()
  
const {user,selectedFriend,setSelectedFriend, notifications,setNotifications} = ChatState()


  const { isOpen, onOpen, onClose } = useDisclosure()
  const [search, setSearch] = useState("");
  

  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
 
  const Navigate = useNavigate();


const handleSearch = async() => {
if(!search){
  toast({
    title: "Please Enter Something in search! ",
    status: "warning",
    duration: 5000,
    isClosable: true,
    position: "top-left"
  })
  return;
}

try{
setLoading(true)

const config = {
  headers: {
    Authorization: `Bearer ${user.token}`,
  },
}

const { data } = await axios.post(`/api/user/search?search=${search}`, {}, config);


  setLoading(false)
  setSearchResults(data)
  
  console.log(data);
}catch(error){
  
  toast({
    title: "Error Occured! ",
    description: "Failed to search users! ",
    status: "error",
    duration: 5000,
    isClosable: true,
    position: "bottom-left"
  })
}
  }

const accessProfile = async (user) => {
  try{
setLoadingChat(true)

setSelectedFriend(user)
setLoadingChat(false)
onClose();
  }catch(err){
    toast({
      title: "Error Occured! ",
      description: err.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
    setLoadingChat(false)
  }

}

const getFriendReq = async () => {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }

    const { data } = await axios.get(`/api/user/friendreq`, config);
    setNotifications(data)
    console.log(data);
  }catch(err){
    toast({
      title: "Error Occured! ",
      description: err.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
  }
}

const acceptFriend = async (uid) => {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }

    const { data } = await axios.post(`/api/user/acceptReq`, {id:uid}, config);
    console.log(data);
    getFriendReq()
    toast({
      title: "New Friend Added ",
      
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
   
    fetchFriends()
  }catch(err){
    toast({
      title: "Error Occured! ",
      description: err.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
  }finally{
    onClose()
  }
}

const declineFriend = async (reqid) => {
  try{
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    }

    const { data } = await axios.post(`/api/user/deleteReq`, {reqId:reqid}, config);
    console.log(data);
    toast({
      title: "Friend Removed ",
      status: "success",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
    getFriendReq()
    fetchFriends()
  }catch(err){
    toast({
      title: "Error Occured! ",
      description: err.message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "bottom-left"
    })
  }finally{
    onClose()
  }
}


const logoutHandler = () => {
  localStorage.removeItem("userInfo");
  Navigate("/")
}


useEffect(() => {
  const intervalId = setInterval(() => {
    // Fetch new notifications from the server
    getFriendReq()
  }, 5000); // Refresh every 5 seconds

  return () => clearInterval(intervalId); // Cleanup the interval when the component unmounts
}, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search users " hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fa-solid fa-magnifying-glass"></i>
            <Text display={{ sm: "none", md: "flex" }} px="4">
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" >
        Mini Social Media
        </Text>
        <div>
          <Menu>
<MenuButton p={1}>
  <NotificationBadge
  count = {notifications.length}
effect = {Effect.SCALE}
>

  </NotificationBadge>
<BellIcon fontSize="2xl" m={1} />
</MenuButton>
<MenuList pl={2}>
  {!notifications.length && "No New Requests"}
  {notifications.map((n) => (
<MenuItem key={n._id}>
  <Box pr={3}>
  <Avatar
 
 size="sm"
 
  cursor="pointer"
  name={n.from.name}
  src={n.from.pic}
  mr={3}
/>
New Request from  {n.from.name} 
  </Box>
 
  <Tooltip label='Accept' >
  <Box pr={3}  onClick={()=>acceptFriend(n.from._id)}>
<FaCheck style={{ color: '#4267B2' }} pl={3} />
</Box>
</Tooltip>


<Tooltip label='Decline' >
<Box pr={3}  onClick={()=>declineFriend(n._id)}>
<FaTimes style={{ color: '#D0342C' }} pl={3} />
 </Box>
</Tooltip>
</MenuItem>
  ))}
    
</MenuList>
          </Menu>

          <Menu>
<MenuButton p={1} as={Button} rightIcon ={<ChevronDownIcon/>}>
<Avatar size="sm" cursor="pointer" name={user.name} src={user.pic}/>
</MenuButton>
<MenuList>
  <ProfileModal user={user}>
 
  </ProfileModal>
  <MenuDivider/>
  <MenuItem onClick={logoutHandler}>Logout</MenuItem>
</MenuList>
          </Menu>
        </div>
      </Box>


      <Drawer placement="left" onClose={onClose} isOpen={isOpen} >
        <DrawerOverlay />
<DrawerContent>
  <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
  <DrawerBody>
<Box display="flex" pb={2}>
  <Input placeholder="Search by name or email"
  mr={2}
  value={search}
  onChange={(e)=> setSearch(e.target.value)}
  />
  <Button onClick={handleSearch}>Go</Button>
</Box>
{loading ? (
<ChatLoading/>
):(
searchResults?.map(user =>(
  <UserListItem
  key={user._id}
  Suser={user}
  display={handleSearch}
  handleFunction={()=>accessProfile(user)}
  />
))
)
}
{loadingChat && <Spinner ml="auto" d="flex" /> }
</DrawerBody>
</DrawerContent>

      </Drawer>
    </>
  );
}

export default SideDrawer;
