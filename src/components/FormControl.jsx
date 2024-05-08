import style from './FormControl.module.css';
function FormControl({ label, id, type, value, change }) {
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
        className={`${style['form-control']} ${style['input']}`}
        value={value}
        onChange={change}
      />
    </div>
  );
}

export default FormControl;
