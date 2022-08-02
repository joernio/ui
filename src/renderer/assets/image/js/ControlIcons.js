import React from 'react';

export default function CloseTabIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24">
			<g>
				<path d="M13.1919001,11.9997324 L23.7528721,22.5607045 C24.0822321,22.8904941 24.0822321,23.4241533 23.7528721,23.7526581 C23.4235121,24.0824473 22.8898521,24.0824473 22.5609201,23.7526581 L11.999948,13.1916857 L1.43897601,23.7526581 C1.109612,24.0824473 0.575952002,24.0824473 0.247020001,23.7526581 C-0.0823400003,23.4237253 -0.0823400003,22.8900657 0.247020001,22.5607045 L10.80842,11.9997324 L0.247020001,1.43961681 C-0.0823400003,1.110684 -0.0823400003,0.576168002 0.247020001,0.247663201 C0.576384002,-0.0825544003 1.11004,-0.0825544003 1.43897601,0.247663201 L11.999948,10.8082072 L22.5609201,0.247663201 C22.8902801,-0.0825544003 23.4239401,-0.0825544003 23.7528721,0.247663201 C24.0822321,0.576596002 24.0822321,1.111112 23.7528721,1.43961681 L13.1919001,11.9997324 L13.1919001,11.9997324 L13.1919001,11.9997324 Z"></path>
			</g>
		</svg>
	);
}

export function HamburgerIcon() {
	return (
		<svg width="24" height="24" viewBox="0 0 24 24">
			<rect y="0.5" width="10" height="1" fill="currentColor" />
			<rect y="4.5" width="10" height="1" fill="currentColor" />
			<rect y="8.5" width="10" height="1" fill="currentColor" />
		</svg>
	);
}

export function MinimizeIcon() {
	return (
		<svg viewBox="0 0 10 10" width="10" height="10">
			<g fill="none" fillRule="evenodd">
				<polygon points="0 0 10 0 10 10 0 10" />
				<path
					stroke="currentColor"
					d="M9.5,5 L0.5,5"
					strokeLinecap="square"
				/>
			</g>
			<g fill="none" fillRule="evenodd">
				<polygon points="0 0 10 0 10 10 0 10" />
				<rect width="10" height="1" y="4.5" fill="currentColor" />
			</g>
		</svg>
	);
}

export function MaximizeIcon() {
	return (
		<svg viewBox="0 0 10 10" width="10" height="10">
			<defs>
				<polygon id="maximize-window-a" points="0 0 10 0 10 10 0 10" />
				<mask id="maximize-window-b" width="10" height="10" x="0" y="0">
					<use xlinkHref="#maximize-window-a" />
				</mask>
			</defs>
			<g fill="none" fillRule="evenodd">
				<polygon fill="none" points="0 0 10 0 10 10 0 10" />
				<use
					stroke="currentColor"
					strokeWidth="2"
					mask="url(#maximize-window-b)"
					xlinkHref="#maximize-window-a"
				/>
			</g>
		</svg>
	);
}

export function RestoreIcon() {
	return (
		<svg viewBox="0 0 10 10" width="10" height="10">
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
}

export function CloseIcon() {
	return (
		<svg viewBox="0 0 10 10" width="10" height="10">
			{/* // <svg width="24" height="24" viewBox="0 0 100% 100%"> */}
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
}
