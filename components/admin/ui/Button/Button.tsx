import Link from 'next/link';
import { MouseEventHandler, ReactNode } from 'react';

export type ButtonVariant = 'primary' | 'primary-gradient' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'link' | 'link-danger';

export type ButtonUIOptions = {
	shadows: boolean;
};

export type ButtonType = 'button' | 'submit';

export type ButtonProperties = {
	variant?: ButtonVariant;
	href?: string;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	isDisabled?: boolean;
	type?: ButtonType;
	uiOptions?: ButtonUIOptions;
	children: ReactNode;
}

const defaultVariant: ButtonVariant = 'primary';
const defaultType: ButtonType = 'button';
const defaultUIOptions: ButtonUIOptions = { shadows: false };
const defaultClickHandler = () => {
	// Default Click Handler
};

const Button = ({ variant = defaultVariant, href = undefined, onClick: handleClick = defaultClickHandler, isDisabled = false, type = defaultType, uiOptions = defaultUIOptions, children = null }: ButtonProperties) => {

	const variants = {
		primary: `bg-primary-light-default dark:bg-primary-dark-default text-secondary-light-tint hover:bg-primary-light-shade dark:hover:bg-primary-dark-shade disabled:bg-primary-light-tint dark:disabled:bg-primary-dark-tint disabled:text-white ${ uiOptions.shadows && 'shadow-md shadow-primary-light-default/50 hover:shadow-primary-light-shade/50 dark:shadow-primary-dark-default/50 dark:hover:shadow-primary-dark-shade/50' }`,
		secondary: `bg-secondary-light-default dark:bg-secondary-dark-default hover:bg-secondary-light-shade dark:hover:bg-secondary-dark-shade text-secondary-dark-default dark:text-secondary-light-default disabled:bg-secondary-light-tint dark:disabled:bg-secondary-dark-tint disabled:text-secondary-dark-tint dark:disabled:text-secondary-light-tint ${ uiOptions.shadows && 'shadow-md shadow-secondary-light-default/50 hover:shadow-secondary-light-shade/50 dark:shadow-secondary-dark-default/50 dark:hover:shadow-secondary-dark-shade/50' }`,
		danger: `bg-danger-light-default dark:bg-danger-dark-default text-secondary-light-tint hover:bg-danger-light-shade dark:hover:bg-danger-dark-shade disabled:bg-danger-light-tint dark:disabled:bg-danger-dark-tint disabled:text-white ${ uiOptions.shadows && 'shadow-md shadow-danger-light-default/50 hover:shadow-danger-light-shade/50 dark:shadow-danger-dark-default/50 dark:hover:shadow-danger-dark-shade/50' }`,
		success: `bg-success-light-default dark:bg-success-dark-default text-secondary-light-tint dark:text-secondary-dark-tint hover:bg-success-light-shade dark:hover:bg-success-dark-shade disabled:bg-success-light-tint dark:disabled:bg-success-dark-tint disabled:text-white dark:disabled:text-gray-500 ${ uiOptions.shadows && 'shadow-md shadow-success-light-default/50 hover:shadow-success-light-shade/50 dark:shadow-success-dark-default/50 dark:hover:shadow-success-dark-shade/50' }`,
		info: `bg-info-light-default dark:bg-info-dark-default hover:bg-info-light-shade dark:hover:bg-info-dark-shade text-secondary-light-tint dark:text-secondary-dark-tint disabled:bg-info-light-tint dark:disabled:bg-info-dark-tint disabled:text-white dark:disabled:text-gray-500 ${ uiOptions.shadows && 'shadow-md shadow-info-light-default/50 hover:shadow-info-light-shade/50 dark:shadow-info-dark-default/50 dark:hover:shadow-info-dark-shade/50' }`,
		warning: `bg-warning-light-default dark:bg-warning-dark-default hover:bg-warning-light-shade dark:hover:bg-warning-dark-shade text-secondary-light-tint dark:text-secondary-dark-tint disabled:bg-warning-light-tint dark:disabled:bg-warning-dark-tint disabled:text-white dark:disabled:text-gray-500 ${ uiOptions.shadows && 'shadow-md shadow-warning-light-default/50 hover:shadow-warning-light-shade/50 dark:shadow-warning-dark-default/50 dark:hover:shadow-warning-dark-shade/50' }`,
		'primary-gradient': `bg-gradient-to-r from-indigo-700 to-indigo-500 text-gray-50 rounded-md hover:from-indigo-800 hover:to-indigo-600 ${ uiOptions.shadows && 'shadow-md shadow-indigo-500/50 hover:shadow-indigo-600/50' }`,
		link: 'text-gray-500 hover:underline dark:text-secondary-light-shade px-0',
		'link-danger': 'text-danger-light-default dark:text-danger-dark-default hover:underline px-0',
	};

	if (href) {
		return (
			<Link
				className={ `rounded-md flex gap-2 items-center px-3 py-2 ${ variant ? variants[ variant ] : '' }` }
				href={ href }
			>
				{ children }
			</Link>
		);
	}

	return (
		<button
			className={ `rounded-md flex gap-2 items-center px-3 py-2 ${ variant ? variants[ variant ] : '' }` }
			disabled={ isDisabled }
			type={ type === 'submit' ? 'submit' : 'button' }
			onClick={ handleClick }
		>{ children }
		</button>
	);
};

export default Button;
