import { auth } from "../Firebase/firebase.jsx";
import Sidebar from "../components/Sidebar/Sidebar";
import Navbar from "../components/Navbar/Navbar";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { getUser } from "../Firebase/UserFirebaseService.js";
import { useDispatch } from "react-redux";
import { SET_USER } from "../Redux/UserStore/index.js";

const Dashboard = ({ children, theme, user }) => {
  const dispatch = useDispatch()
  const handleLogout = async () => {
    try{
        await auth.signOut()
    }
    catch(error){
        console.log("User signed out");
        console.error(error);
    }
  };

  useEffect(() => {
    const func = async () => {
      const user_data = await getUser(user.uid)
      dispatch(SET_USER(user_data))
    }
    func()
  }, [])

  return (
    <>
      <Navbar theme={theme} user={user} logout={handleLogout} />
      <Sidebar>{children}</Sidebar>
    </>
  );
};

export default Dashboard;
