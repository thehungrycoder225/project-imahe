import style from './FormControl.module.css';
function FormControl({
  label,
  id,
  type,
  value,
  change,
  disabled,
  state,
  name,
  placeholder,
  styles,
}) {
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
        name={name}
        id={id}
        className={`${style['form-control']} ${style[`${state}`]} ${
          style[`${styles}`]
        }`}
        value={value}
        onChange={change}
        disabled={disabled}
        placeholder={placeholder}
      />
    </div>
  );
}

export default FormControl;
