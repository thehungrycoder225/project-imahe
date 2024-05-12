import { Link } from 'react-router-dom';
import styles from './RegisterSuccess.module.css';

function RegisterSuccess() {
  return (
    <div className={styles.container}>
      <p>🎉</p>
      <h1 className={styles.heading}>Registration Successful!</h1>
      <button className={`${styles['btn-base']} ${styles['btn-primary']}`}>
        <Link to='/'>Login</Link>
      </button>
    </div>
  );
}

export default RegisterSuccess;
