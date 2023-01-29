import React, { useEffect, useState } from "react";

const Stopwatch = () => {
	const [seconds, setSeconds] = useState(0);
	const [minutes, setMinutes] = useState(0);
	const [isRunning, setIsRunning] = useState(false);

	useEffect(() => {
		setIsRunning(true);
	}, []);

	useEffect(() => {
		let interval = null;
		if (isRunning) {
			interval = setInterval(() => {
				setSeconds((seconds) => seconds + 1);
			}, 1000);
		} else if (!isRunning && seconds !== 0) {
			clearInterval(interval);
		}
		return () => clearInterval(interval);
	}, [isRunning, seconds]);

	useEffect(() => {
		if (seconds === 60) {
			setMinutes((minutes) => minutes + 1);
			setSeconds(0);
		}
	}, [seconds]);

	const minutesString = minutes < 10 ? `0${minutes}` : minutes;
	const secondsString = seconds < 10 ? `0${seconds}` : seconds;

	return (
		<div>
			<span>{`${minutesString}:${secondsString}`}</span>
		</div>
	);
};

export default Stopwatch;
