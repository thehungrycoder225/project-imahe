import { Link } from 'react-router-dom';
import styles from './RegisterSuccess.module.css';
import { Helmet } from 'react-helmet';

function RegisterSuccess() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Imahe | Success</title>
      </Helmet>
      <p>🎉</p>
      <h1 className={styles.heading}>Registration Successful!</h1>
      <button className={`${styles['btn-base']} ${styles['btn-primary']}`}>
        <Link to='/login'>Login</Link>
      </button>
    </div>
  );
}

export default RegisterSuccess;
