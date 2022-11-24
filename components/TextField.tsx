import React, { ChangeEvent, FocusEvent } from "react";

export interface ITextField {
    name: string,
    type: string,
    label: string
    error? : boolean,
    helperText? : string,
    placeholder? : string,
    value?: string,
    className? : string,
    handleBlur? : {
        (e: FocusEvent<any, Element>): void;
        <T = any>(fieldOrEvent: T): T extends string ? (e: any) => void : void;
    }
    handleChange? : {
        (e: ChangeEvent<any>): void;
        <T_1 = string | ChangeEvent<any>>(field: T_1): T_1 extends ChangeEvent<any> ? void : (e: string | ChangeEvent<any>) => any;
    } | undefined
    
}
const TextField = ({ error, helperText, placeholder, name, label, type, handleBlur, handleChange } : ITextField) => {
    return (
        <div className="flex w-5/6 sm:w-52 flex-col sm:h-28 justify-center">
            <label className={error ? "text-red-600" : "text-gray-500"} htmlFor={label}>{label}</label>
            <input 
                className={error ? "border border-red-600 text-sm rounded-md block w-full p-2.5 bg-white" : "border text-sm rounded-md block w-full p-2.5 bg-white"}
                onBlur={handleBlur}
                onChange={handleChange}
                id={label}
                type={type}
                name={name}
                placeholder={placeholder && placeholder}/>
            {error && <div className="text-red-600 flex text-md justify-start items-center mt-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
                {helperText}
                </div>}
        </div>
    )
}
export default TextField;