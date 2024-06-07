import React, { useState } from 'react';

const FieldSelectionPopup = ({ availableFields, onClose, onExport }) => {
    const [selectedFields, setSelectedFields] = useState(availableFields.map(field => field.key));

    const handleCheckboxChange = (fieldKey) => {
        setSelectedFields(prevSelectedFields => {
            if (prevSelectedFields.includes(fieldKey)) {
                return prevSelectedFields.filter(key => key !== fieldKey);
            } else {
                return [...prevSelectedFields, fieldKey];
            }
        });
    };

    const handleExport = () => {
        onExport(selectedFields);
        onClose();
    };

    return (
        <div className="field-selection-popup">
            <div className="popup-content">
                <h3>Select Fields to Export</h3>
                <div className="field-list">
                    {availableFields.map(field => (
                        <div key={field.key} className="field-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedFields.includes(field.key)}
                                    onChange={() => handleCheckboxChange(field.key)}
                                    disabled={field.key === 'jobTitle' || field.key === 'srNo'}
                                />
                                {field.label}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="popup-actions">
                    <button className='secondary-button' onClick={onClose}>Cancel</button>
                    <button className='primary-button' onClick={handleExport}>Export</button>
                </div>
            </div>
        </div>
    );
};

export default FieldSelectionPopup;
