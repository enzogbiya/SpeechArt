import React from "react";
import "./image.css";
import { ClipLoader } from "react-spinners";

const Image = (props) => {
	const { src, alt, loadingImage, onLoad } = props;
	return (
		<div className="image-wrapper">
			<ClipLoader loading={loadingImage} color="#fe9b62" />
			<a href={src} target="_blank" rel="noreferrer">
				<img className="image" src={src} alt={alt ? alt : "image here"} onLoad={onLoad}></img>
			</a>
		</div>
	);
};

export default Image;
