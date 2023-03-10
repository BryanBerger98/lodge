import { Menu, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';
import { FiMoreVertical } from 'react-icons/fi';

export type DropdownVariant = 'default' | 'primary' | 'secondary' | 'danger' | 'warning' | 'success' | 'info' | 'link';

export type DropdownUIOptions = {
	shadows: boolean;
};

export type DropdownMenuProperties = {
	children?: ReactNode;
	icon?: ReactNode;
	name?: string | null;
	variant?: DropdownVariant;
	uiOptions?: DropdownUIOptions;
};

const defaultIcon = <FiMoreVertical />;
const defaultName = 'Menu';
const defaultVariant: DropdownVariant = 'default';
const defaultUIOptions: DropdownUIOptions = { shadows: false };

const DropdownMenu = ({ children = null, icon = defaultIcon, name = defaultName, variant = defaultVariant, uiOptions = defaultUIOptions }: DropdownMenuProperties) => {

	const variants = {
		default: 'text-sm font-medium text-gray-800 dark:text-gray-200 rounded-lg focus:outline-none',
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

	return (
		<Menu
			as="div"
			className="relative inline-block text-left"
		>
			<div>
				<Menu.Button className={ `rounded-md inline-flex gap-2 items-center justify-center w-full px-3 py-2 text-sm font-medium ${ variant ? variants[ variant ] : '' }` }>
					{ icon }
					{ name }
				</Menu.Button>
			</div>
			<Transition
				as={ Fragment }
				enter="transition ease-out duration-100"
				enterFrom="transform opacity-0 scale-95"
				enterTo="transform opacity-100 scale-100"
				leave="transition ease-in duration-75"
				leaveFrom="transform opacity-100 scale-100"
				leaveTo="transform opacity-0 scale-95"
			>
				<Menu.Items className="absolute right-0 w-60 mt-2 origin-top-right bg-secondary-light-default dark:bg-secondary-dark-tint divide-y divide-secondary-light-shade/25 rounded-lg drop-shadow-md focus:outline-none z-50">
					{ children }
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default DropdownMenu;
