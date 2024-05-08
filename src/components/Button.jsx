import style from './Button.module.css';
function Button({ text, click, size, color }) {
  return (
    <button
      className={`${style['btn-base']} ${style[`${color}`]} ${
        style[`${size}`]
      }`}
      onClick={click}
    >
      {text}
    </button>
  );
}

export default Button;
