import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../Firebase/firebase'
import { updateDoctor } from '../Firebase/DoctorfirebaseService'
import { updatePatient } from '../Firebase/PatientfirebaseService'
import { useSelector } from 'react-redux'
import './Profile.css'

const Profile = () => {
  const [user] = useAuthState(auth)
  const profile = useSelector(state => state.user.user)
  const [displayName, setDisplayName] = useState(profile.name || '')
  const [email, setEmail] = useState(profile.email || '')
  const [specialization, setSpecialization] = useState(profile.specialization || '');
  const [hospital, setHospital] = useState(profile.hospital || '');
  const [age, setAge] = useState(profile.age || '');
  const [contactNumber, setContactNumber] = useState(profile.contactNumber || '');

  const handleUpdateProfile = async () => {
    try {
      const updatedProfile = {
        id: user.uid,
        email,
        name: displayName,
        specialization, 
        hospital,
        age, 
        contactNumber, 
      };
     // await updateDoctor({id: user.uid, email, name: displayName})
     if (profile?.isDoctor) {
      await updateDoctor(updatedProfile);
    } 
    else if (profile?.isPatient) {
      await updatePatient(updatedProfile);
    } 
    else {
      throw new Error('Invalid user role.');
    }

      await auth.currentUser.updateEmail(email)
      alert('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error.message)
    }
  };

  return (
    <div className="profile-container">
      <h2>Your Profile</h2>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
      </div>
      {profile.role === 'doctor' && (
        <>          
          <div>
            <label>
              Specialization:
              <input type="text" value={specialization} onChange={(e) => setSpecialization(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
              Hospital:
              <input type="text" value={hospital} onChange={(e) => setHospital(e.target.value)} />
            </label>
          </div>
        </>
      )}

      {profile.role === 'patient' && (
        <>
         <div>
            <label>
              Age:
              <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
            </label>
          </div>
          <div>
            <label>
            Contact Number:
              <input type="text" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
            </label>
          </div>
        </>
      )}

      {/* <button onClick={handleUpdateProfile}>Update Profile</button> */}
    </div>
  );
};

export default Profile;
