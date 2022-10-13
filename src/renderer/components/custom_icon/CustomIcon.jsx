import React from 'react';
import { customIcons } from '../../assets/js/utils/defaultVariables';

export default function CustomIcon(props) {
	if (props.icon === customIcons.analytics) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox="0 0 44 44"
			>
				<path
					d="M14.45 34.15h3V23.9h-3Zm16.15 0h3v-21h-3Zm-8.1 0h3v-5.9h-3Zm0-10.25h3v-3h-3ZM9.45 43.25q-1.95 0-3.325-1.375Q4.75 40.5 4.75 38.55V9.45q0-1.95 1.375-3.35Q7.5 4.7 9.45 4.7h29.1q1.95 0 3.35 1.4 1.4 1.4 1.4 3.35v29.1q0 1.95-1.4 3.325-1.4 1.375-3.35 1.375Z"
					fill="currentColor"
				/>
			</svg>
		);
	} else if (props.icon === customIcons.monitoring) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox="0 0 44 44"
			>
				<path
					d="M5.15 42.85v-5L9.7 33.3v9.55Zm8.3 0V29.8L18 25.25v17.6Zm8.3 0v-17.6l4.55 4.55v13.05Zm8.3 0V29.7l4.55-4.5v17.65Zm8.3 0v-21.2l4.5-4.5v25.7ZM5.15 32v-6.7L20 10.55l8 8 14.85-14.9v6.65L28 25.25l-8-8Z"
					fill="currentColor"
				/>
			</svg>
		);
	} else if (props.icon === customIcons.rules) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox="0 0 44 44"
			>
				<path
					d="M3.15 35.2v-4.7h18.5v4.7Zm0-17.7v-4.75h18.5v4.75ZM28.4 41.7l-3.3-3.3 5.6-5.55-5.6-5.55 3.3-3.3 5.6 5.55L39.55 24l3.3 3.3-5.55 5.55 5.55 5.55-3.3 3.3L34 36.15Zm5.25-20.05-8-8 3.3-3.3L33.6 15l8.25-8.35 3.3 3.4Z"
					fill="currentColor"
				/>
			</svg>
		);
	} else if (props.icon === customIcons.chevron_down) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox="0 0 12 8"
			>
				<path
					d="M5.99989 7.12101C5.86856 7.12116 5.73848 7.09535 5.61715 7.04507C5.49582 6.99479 5.38562 6.92102 5.29289 6.82801L1.05018 2.58586C0.862668 2.39834 0.757323 2.14402 0.757324 1.87883C0.757325 1.61364 0.862672 1.35931 1.05019 1.1718C1.23771 0.98428 1.49203 0.878935 1.75722 0.878936C2.02241 0.878937 2.27674 0.984283 2.46425 1.1718L5.99989 4.70692L9.53553 1.17177C9.72305 0.984254 9.97738 0.878907 10.2426 0.878906C10.5078 0.878905 10.7621 0.98425 10.9496 1.17177C11.1371 1.35928 11.2425 1.61361 11.2425 1.8788C11.2425 2.14399 11.1371 2.39831 10.9496 2.58583L6.70689 6.82804C6.61416 6.92105 6.50396 6.99481 6.38263 7.04508C6.2613 7.09536 6.13123 7.12117 5.99989 7.12101Z"
					fill="currentColor"
				/>
			</svg>
		);
	} else if (props.icon === customIcons.hamburger) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox={`0 0 ${props.iconSize} ${props.iconSize}`}
			>
				<rect y="0%" width="100%" height="12%" fill="currentColor" />
				<rect y="44%" width="100%" height="12%" fill="currentColor" />
				<rect y="88%" width="100%" height="12%" fill="currentColor" />
			</svg>
		);
	} else if (props.icon === customIcons.restore) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox="0 0 10 10"
			>
				<defs>
					<mask
						id="restore-window-b"
						width="10.2"
						height="10.2"
						x="0"
						y="0"
					>
						<use xlinkHref="#restore-window-a" />
					</mask>
				</defs>
				<g fill="none" fillRule="evenodd">
					<path
						fill="currentColor"
						d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V2H3.1V1h6.1V7.1z"
					/>
					<use stroke="currentColor" xlinkHref="#restore-window-a" />
				</g>
			</svg>
		);
	} else if (props.icon === customIcons.close) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox="0 0 10 10"
			>
				<g fill="none" fillRule="evenodd">
					<g
						stroke="currentColor"
						transform="translate(.25 .25)"
						strokeLinecap="square"
					>
						<path d="M0.5,0.5 L9,9" />
						<path
							d="M0.5,0.5 L9,9"
							transform="matrix(-1 0 0 1 9.5 0)"
						/>
					</g>
					<polygon points="0 0 10 0 10 10 0 10" />
				</g>
			</svg>
		);
	} else if (props.icon === customIcons.terminal) {
		return (
			<svg
				width={props.iconSize}
				height={props.iconSize}
				{...props}
				viewBox={`0 0 24 24`}
			>
				<path
					d="M20,19V7H4V19H20M20,3C21.1,3 22,3.9 22,5V19C22,20.1 21.1,21 20,21H4C2.9,21 2,20.1 2,19V5C2,3.89 2.9,3 4,3H20M13,17V15H18V17H13M9.58,13L5.57,9H8.4L11.7,12.3C12.09,12.69 12.09,13.33 11.7,13.72L8.42,17H5.59L9.58,13Z"
					fill="currentColor"
				/>
			</svg>
		);
	} else {
		return null;
	}
}
