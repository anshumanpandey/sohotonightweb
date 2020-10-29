import React from 'react';
import UkLocations from '../utils/Location.json'

function UkLocationsDropdown({ onChange, ...props }: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {
    return (
        <select
            style={{ width: "100%" }}
            className="form-control"
            name={"country"}
            onChange={onChange}
            {...props}
        >
            <option value={"0"}>Select</option>
            {UkLocations.map(c => <option key={`${c.city}-${c.lat}`} value={c.city}>{c.city}</option>)}
        </select>
    );
}
export default UkLocationsDropdown;
