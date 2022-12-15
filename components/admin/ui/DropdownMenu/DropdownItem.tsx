import { Menu } from '@headlessui/react';
import { cloneElement, MouseEventHandler, ReactElement, ReactNode } from 'react';
import { FiChevronRight } from 'react-icons/fi';
import { DropdownVariant } from './DropdownMenu';

type DropdownItemProperties = {
	variant?: DropdownVariant;
	onClick?: MouseEventHandler<HTMLButtonElement>;
	icon?: ReactNode;
	name?: string;
}

const defaultVariant: DropdownVariant = 'primary';
const defaultIcon = <FiChevronRight />;
const defaultName = 'Button';
const defaultOnClick: MouseEventHandler<HTMLButtonElement> = (e) => console.log(e);

const DropdownItem = ({ variant = defaultVariant, onClick = defaultOnClick, icon = defaultIcon, name = defaultName }: DropdownItemProperties) => {

    const getIcon = (icon: ReactNode, active: boolean) => {
        const props = { className: `w-5 h-5 mr-2 ${ !active && `text-${ variant }-light-default dark:text-${ variant }-dark-default` }` };
        return cloneElement(icon as ReactElement, props);
    };

    return (
        <Menu.Item>
            {({ active }) => (
                <button
                    className={ `${
                        active ? `bg-${ variant }-light-default text-white dark:bg-${ variant }-dark-default dark:text-secondary-dark-default` : 'text-secondary-dark-shade dark:text-secondary-light-shade'
                    } group flex rounded-lg items-center w-full px-2 py-2 text-sm` }
                    onClick={ onClick }
                >
                    { getIcon(icon, active) }
                    { name }
                </button>
            )}
        </Menu.Item>
    );
};

export default DropdownItem;
