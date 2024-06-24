// FilterContext.js
import React, { createContext, useContext, useState } from 'react';

const FilterContext = createContext();

export const FilterProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        jobCategory: [],
        jobDate: [],
    });


    const updateFilters = (name, value, checked, type) => {
        setFilters((prevFilters) => {
            let updatedFilters;
            if (type === 'checkbox') {
                if (checked) {
                    updatedFilters = {
                        ...prevFilters,
                        [name]: [...prevFilters[name], value],
                    };
                } else {
                    updatedFilters = {
                        ...prevFilters,
                        [name]: prevFilters[name].filter((filter) => filter !== value),
                    };
                }
            }
            return updatedFilters;
        });
    };

    return (
        <FilterContext.Provider value={{ filters, setFilters, updateFilters }}>
            {children}
        </FilterContext.Provider>
    );
};

export const useFilterContext = () => {
    return useContext(FilterContext);
};
