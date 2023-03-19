import { createContext, useContext, useState, useEffect ,} from "react";
import { useNavigate } from 'react-router-dom'
const ChatContext = createContext();

const ChatProvider = ({ children }) => {
    const Navigate = useNavigate();
   const [user, setUser] = useState()
   const [selectedFriend, setSelectedFriend] = useState()
   const [friends, setFriends] = useState([]);
   const [notifications, setNotifications] = useState([]);
   useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo')) 
    setUser(userInfo)
    if(userInfo){
      Navigate("/home")
    }
  }, [Navigate])


    return (
        <ChatContext.Provider value={{user,setUser, setSelectedFriend, selectedFriend,friends,setFriends,notifications,setNotifications}}>
        {children}
        </ChatContext.Provider>
    );
   

}

export const ChatState = () => {
    return useContext(ChatContext)
}

   
    export default ChatProvider;