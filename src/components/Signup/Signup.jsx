import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { Dropdown } from 'primereact/dropdown';
import InputControl from "../InputControl/InputControl";
import { auth } from "../../Firebase/firebase";
import styles from "./Signup.module.css";
import withRole from '../../rbac';
import { addDoctor } from "../../Firebase/DoctorfirebaseService";
import { useDispatch } from "react-redux";
import {SET_USER} from '../../Redux/UserStore'
import { addPatient } from "../../Firebase/PatientfirebaseService";

function Signup() {
  const navigate = useNavigate();
  const dispatch = useDispatch()
  const [values, setValues] = useState({
    name: "",
    email: "",
    pass: "",
    userType: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [submitButtonDisabled, setSubmitButtonDisabled] = useState(false);

  const handleSubmission = () => {
    if (!values.name || !values.email || !values.pass || !values.userType) {
      setErrorMsg("Fill all fields");
      return;
    }
    setErrorMsg("");

    setSubmitButtonDisabled(true);
    createUserWithEmailAndPassword(auth, values.email, values.pass)
      .then(async (res) => {
        setSubmitButtonDisabled(false);
        const user = res.user;
        if(values.userType == 'doctor') dispatch(SET_USER(await addDoctor({available: true, experience: 0, email: values.email, id: user.uid, hospital: '', name: values.name, specialisation: '',})))
        else if(values.userType == 'patient') dispatch(SET_USER(await addPatient({email: values.email, id: user.uid, name: values.name, age: 0, gender: 'M', contact: '0000000000'})))
        else throw new Error('Unexpected User Type. Please Provide correct user type')
        // await updateProfile(user, {
        //   displayName: values.name,
        //   role: values.userType,
        // });

        
        navigate("/");
      })
      .catch((err) => {
        setSubmitButtonDisabled(false);
        setErrorMsg(err.message);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.innerBox}>
        <h1 className={styles.heading}>Signup</h1>

        <InputControl
          label="Name"
          placeholder="Enter your name"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, name: event.target.value }))
          }
        />
        <InputControl
          label="Email"
          placeholder="Enter email address"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, email: event.target.value }))
          }
        />
        <InputControl
          label="Password"
          placeholder="Enter password"
          onChange={(event) =>
            setValues((prev) => ({ ...prev, pass: event.target.value }))
          }
        />

        <InputControl
          label="User Type"
          placeholder="Select User Type"
          value={values.userType}
          onChange={(value) =>
            setValues((prev) => ({ ...prev, userType: value }))
          }
          type="dropdown"
          options={[
            { value: "doctor", label: "Doctor" },
            { value: "patient", label: "Patient" },
            { value: "admin", label: "Admin" },
          ]}
        />

        <div className={styles.footer}>
          <b className={styles.error}>{errorMsg}</b>
          <button onClick={handleSubmission} disabled={submitButtonDisabled}>
            Signup
          </button>
          <p>
            Already have an account?{" "}
            <span>
              <Link to="/login">Login</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;