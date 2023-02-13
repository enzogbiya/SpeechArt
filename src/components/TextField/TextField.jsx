import React from "react";
import "./textField.css";

const TextField = (props) => {
	const { children, handleTextField, placeHolder } = props;

	return (
		<textarea className="textarea" value={children} onChange={handleTextField} placeholder={placeHolder}></textarea>
	);
};

export default TextField;
