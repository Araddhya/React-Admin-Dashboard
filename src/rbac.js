// rbac.js
import { Navigate } from 'react-router-dom';
import { auth } from './Firebase/firebase';
const withRole = (allowedRoles, WrappedComponent) => {
    return (props) => {
      // Get the user's role from props
      const userRole = props.user ? props.user.role : null;
  
      // Check if the user's role is allowed
      if (allowedRoles.includes(userRole)) {
        return <WrappedComponent {...props} />;
      } else {
        // Redirect or show an unauthorized message
        return <p>You are not authorized to view this page.</p>;
      }
    };
  };
  
  export default withRole;
  