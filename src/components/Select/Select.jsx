import React from "react";
import css from './Select.module.css';

const Select = ({
    setValue,
    value,
    options = [],
    label,
    name,
    disabled
}) => {

    return (
        <div className={css.select_container}>
            <select
                className={css.select}
                onChange={(event) => setValue(event.target.value)}
                value={value}
                disabled={disabled}
                name={name}>
                {
                    options && (
                        options.map((item) =>
                            <option disabled={false} value={item.kod} key={item.kod}>{item.name}</option>
                        )
                    )
                }
            </select>
            {
                label && (
                    <label className={css.label} >{label}</label>
                )
            }
        </div>
    )
}

export default Select;