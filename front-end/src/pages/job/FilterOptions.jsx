// FilterOptions.js
import React from 'react';

const FilterOptions = ({ options, checkedFilters, onChange }) => {
    return (
        <div className="checkbox">
            {options.map(option => (
                <label key={option.id} htmlFor={option.id}>
                    <input
                        type="checkbox"
                        name={option.name}
                        id={option.id}
                        value={option.value}
                        onChange={onChange}
                        checked={checkedFilters.includes(option.value)}
                    />
                    {option.label}
                </label>
            ))}
        </div>
    );
};

export default FilterOptions;
