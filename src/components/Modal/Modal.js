import React, { useState } from "react";
import "./modal.css";
import Button from "../Button/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWindowClose } from "@fortawesome/fontawesome-free-solid";

const Modal = (props) => {
	const { show, onClose, handleButtonClick, handleInputChange } = props;

	if (!show) {
		return null;
	}

	return (
		<div className="modal">
			<div className="modal-content">
				<div className="modal-header">
					<div className="row">
						<div className="col-70">
							<h2 className="modal-title">Fill out the required fields</h2>
						</div>
						<div className="col-30">
							<span className="close" onClick={onClose}>
								<FontAwesomeIcon icon={faWindowClose} size="xl" />
							</span>
						</div>
					</div>
				</div>
				<div className="modal-body">
					<div className="row">
						<div className="col-100">
							<input onChange={handleInputChange} id="name" type="text" placeholder="Your name" />
							<input onChange={handleInputChange} id="email" type="email" placeholder="Your email" />
						</div>
					</div>
				</div>
				<div className="modal-footer">
					<div className="row">
						<div className="col-100">
							<Button onClick={handleButtonClick}>Send me</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Modal;
