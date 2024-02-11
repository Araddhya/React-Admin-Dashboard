import React from "react";
import 
{ BsFillCalendarFill,BsCardList , BsPeopleFill, BsFileText}
 from 'react-icons/bs'
 import './Home.css'


const Home = () => {
  return (
<main className='main-container'>
        <div className='main-title'>
            <h3>DASHBOARD</h3>
        </div>

        <div className='main-cards'>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Total Patients</h3>
                    <BsPeopleFill className='card_icon'/>
                </div>
                <h1>300</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Appointments</h3>
                    <BsFillCalendarFill className='card_icon'/>
                </div>
                <h1>12</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Prescriptions</h3>
                    <BsCardList className='card_icon'/>
                </div>
                <h1>33</h1>
            </div>
            <div className='card'>
                <div className='card-inner'>
                    <h3>Total Earnings</h3>
                    <BsFileText className='card_icon'/>
                </div>
                <h1>42</h1>
            </div>
        </div>
        </main>);
} 
export default Home;
/*
function Home(props) {
  return (
    <div>
      <div>
        <h1>
          <Link to="/login">Login</Link>
        </h1>
        <br />
        <h1>
          <Link to="/signup">Signup</Link>
        </h1>
      </div>

      <br />
      <br />
      <br />

      <h2>{props.name ? `Welcome - ${props.name}` : "Login please"}</h2>
    </div>
  );
}

export default Home;
*/