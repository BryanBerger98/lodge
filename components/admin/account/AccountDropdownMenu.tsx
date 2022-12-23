import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { FiLogOut, FiUser } from 'react-icons/fi';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { IUser } from '../../../types/user.type';
import { signOut } from 'next-auth/react';

type AccountDropdownMenuProperties = {
	currentUser: IUser;
};

const AccountDropDownMenu = ({ currentUser }: AccountDropdownMenuProperties) => {

    const router = useRouter();

    const logoutHandler = () => {
        signOut();
    };

    return (
        <Menu
            as="div"
            className="relative inline-block text-left"
        >
            <div>
                <Menu.Button className='bg-primary-light-default dark:bg-primary-dark-default hover:bg-primary-light-shade dark:hover:bg-primary-dark-shade flex items-center justify-center text-md text-light-50 rounded-full w-9 h-9 hover:cursor-pointer  focus:outline-none overflow-hidden'>
                    {
                        currentUser && currentUser.photo_url && currentUser.photo_url !== '' ?
                            <Image
                                src={ `/${ currentUser.photo_url }` }
                                alt={ `${ currentUser.username } profile photo` }
                                width={ 36 }
                                height={ 36 }
                                className='rounded-full'
                            />
                            : <FiUser />
                    }
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
                <Menu.Items className="absolute right-0 w-60 mt-2 origin-top-right bg-light-100 dark:bg-light-800 divide-y divide-light-300/25 rounded-lg drop-shadow-md focus:outline-none">
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={ `${
                                        active ? 'bg-primary-light-default text-white dark:bg-primary-dark-default dark:text-secondary-dark-default' : 'text-secondary-dark-shade dark:text-secondary-light-shade'
                                    } group flex rounded-lg items-center w-full px-2 py-2 text-sm` }
                                    onClick={ () => {
                                        router.push('/admin/account');
                                    } }
                                >
                                    {active ? (
                                        <FiUser
                                            className="w-5 h-5 mr-2"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <FiUser
                                            className="w-5 h-5 mr-2 text-primary-light-default dark:text-primary-dark-default"
                                            aria-hidden="true"
                                        />
                                    )}
                        Mon compte
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                    <div className="px-1 py-1">
                        <Menu.Item>
                            {({ active }) => (
                                <button
                                    className={ `${
                                        active ? 'bg-danger-light-default text-white dark:bg-danger-dark-default dark:text-secondary-dark-default' : 'text-secondary-dark-shade dark:text-secondary-light-shade'
                                    } group flex rounded-lg items-center w-full px-2 py-2 text-sm` }
                                    onClick={ logoutHandler }
                                >
                                    {active ? (
                                        <FiLogOut
                                            className="w-5 h-5 mr-2"
                                            aria-hidden="true"
                                        />
                                    ) : (
                                        <FiLogOut
                                            className="w-5 h-5 mr-2 text-danger-light-default dark:text-danger-dark-default"
                                            aria-hidden="true"
                                        />
                                    )}
                    Déconnexion
                                </button>
                            )}
                        </Menu.Item>
                    </div>
                </Menu.Items>
            </Transition>
        </Menu>
    );
};

export default AccountDropDownMenu;
