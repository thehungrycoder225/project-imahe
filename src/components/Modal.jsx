import './Modal.css'; // Import your CSS

const Modal = ({ children, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className='modal-overlay'>
      <div className='modal'>{children}</div>
    </div>
  );
};

export default Modal;
