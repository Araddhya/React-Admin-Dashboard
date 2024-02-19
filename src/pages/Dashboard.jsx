import { auth } from "../Firebase/firebase.jsx"
import Sidebar from "../components/Sidebar/Sidebar"
import Navbar from "../components/Navbar/Navbar"
import { useAuthState } from "react-firebase-hooks/auth"

const Dashboard = ({ children, theme, user }) => {
  const handleLogout = async () => {
    try{
        await auth.signOut()
    }
    catch(error){
        console.log("User signed out")
        console.error(error)
    }
  }

  return (
    <div className='dashboard' >
      <Navbar theme={theme} user={user} logout={handleLogout} />
      <Sidebar>{children}</Sidebar>
    </div>
  )
}

export default Dashboard
