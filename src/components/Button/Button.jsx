import React from "react";
import "./button.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Button = (props) => {
	const { children, icon, onClick, disabled } = props;

	return (
		<button className="btn" onClick={onClick} disabled={disabled}>
			{icon && <FontAwesomeIcon icon={icon} />}
			{children}
		</button>
	);
};

export default Button;
