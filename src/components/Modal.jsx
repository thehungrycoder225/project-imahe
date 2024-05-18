import './Modal.css'; // Import your CSS

const Modal = ({ children, visible, onClose }) => {
  if (!visible) return null;

  return (
    <div className='modal'>
      <div className='overlay'>
        <div className='modal-content'>{children}</div>
      </div>
    </div>
  );
};

export default Modal;
