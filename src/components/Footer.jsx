import styles from './Footer.module.css';

function Footer() {
  return (
    <footer className={styles.footer}>
      <img src='favicon.ico' alt='' />
      <p>Project Imahe &copy; 2024</p>
    </footer>
  );
}

export default Footer;
