import style from './FormControl.module.css';
function FormControl({ label, id, type, value, change, disabled, state }) {
  return (
    <div>
      <label
        htmlFor={id}
        className={`${style['form-label']} ${style['text-bold']}`}
      >
        {label}
      </label>
      <input
        type={type}
        id={id}
        className={`${style['form-control']} ${style[`${state}`]}`}
        value={value}
        onChange={change}
        disabled={disabled}
      />
    </div>
  );
}

export default FormControl;
