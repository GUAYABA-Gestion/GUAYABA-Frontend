"use client";

import { CustomButtonProps } from "../../../Lab BD/Lab0BD_Ingesoft2_Front/types";

// Main hero

const CustomButton = ({ title, containerStyles, handleClick}: CustomButtonProps) => {
    return (
        <button
        disabled = {false}
        type = {"submit"}
        className={`custom-btn ${containerStyles}`}
        onClick={handleClick}>
            <span className={'flex-1'}>
                {title}
            </span>
        </button>
    )
}

export default CustomButton