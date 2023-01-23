import React from "react";
import "./textField.css";

const TextField = (props) => {
	const { children } = props;
	return <textarea className="textarea" value={children} readOnly></textarea>;
};

export default TextField;
