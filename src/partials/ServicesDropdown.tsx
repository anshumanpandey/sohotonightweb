import React from 'react';
import useAxios from 'axios-hooks'

function    ServicesDropdown({ onChange, ...props }: React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>) {

    const [{ data, loading, error }, getUser] = useAxios({
        url: '/services/',
    });

    if (error) return <p>Could not load services</p>
    if (loading) return <p>Loading services</p>

    return (
        <select
            multiple
            disabled={loading}
            style={{ width: "100%" }}
            className="form-control"
            onChange={onChange}
            {...props}
        >
            {loading ? (
                <option value={"0"}>Loading</option>
            ): (
                <>
                    <option value={"0"}>Select</option>
                    {data.map((c: any) => <option key={`${c.id}`} value={c.id}>{c.name}</option>)}
                </>
            )}
        </select>
    );
}
export default ServicesDropdown;
