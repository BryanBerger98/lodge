import { ReactNode } from 'react';
import { FiBell } from 'react-icons/fi';

type ToastVariant = 'primary' | 'danger' | 'warning' | 'info' | 'success';

type ToastProperties = {
	variant?: ToastVariant;
	children: ReactNode;
};

const defaultVariant: ToastVariant = 'primary';
const defaultChildren = (
	<>
		<FiBell />
		<span>Notification</span>
	</>
);

const Toast = ({ variant = defaultVariant, children = defaultChildren }: ToastProperties) => {
	console.log('HEY');
	return (
		<div
			className={ `flex items-center gap-4 bg-${ variant }-light-default dark:bg-${ variant }-dark-default text-light-50 dark:text-secondary-light-tint text-medium text-base px-5 py-3 rounded-md drop-shadow` }
		>
			{ children }
		</div>
	);
};

export default Toast;
