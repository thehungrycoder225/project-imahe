import { Link } from 'react-router-dom';

function RegisterSuccess() {
  return (
    <div>
      <div>Registration Successful!</div>
      <div>
        <Link to='/'>Login</Link>
      </div>
    </div>
  );
}

export default RegisterSuccess;
