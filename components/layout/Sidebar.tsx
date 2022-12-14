import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { func, bool } from 'prop-types';
import { Dispatch, FC, SetStateAction } from 'react';
import { FiAward, FiHome, FiLayers, FiUsers } from 'react-icons/fi';
import { isUserAbleToWatch } from '../../utils/permissions.util';

type SidebarProperties = {
	isSidebarOpen: boolean;
	setIsSidebarOpen: Dispatch<SetStateAction<boolean>>
}

const Sidebar: FC<SidebarProperties> = ({ isSidebarOpen, setIsSidebarOpen }) => {

    const { data } = useSession();

    const user = data?.user;

    return(
        <>
            <div className={ 'relative w-fit lg:w-56' }>
                <div className={ `${ isSidebarOpen ? 'w-52 p-3' : 'w-0' } lg:w-56 bg-primary-light-default dark:bg-light-900 fixed inset-y-0 left-0 z-50 flex flex-col lg:p-3 overflow-hidden transition duration-300 ease-in-out` }>
                    <p className="text-light-50 dark:text-primary-dark-default text-2xl mx-auto my-2 border-b border-dark-50 dark:border-primary-dark-default pb-2">Next-Base</p>
                    <nav className="mt-10 text-light-100 text-sm">
                        <small>NAVIGATION</small>
                        <ul>
                            <li>
                                <Link href={ '/admin/dashboard' }>
                                    <a className="flex gap-2 items-center p-2 rounded-md hover:text-light-50 hover:bg-primary-light-tint dark:hover:bg-light-700 hover:cursor-pointer">
                                        <FiHome />
                                        <span>Tableau de bord</span>
                                    </a>
                                </Link>
                            </li>
                            {
                                user && isUserAbleToWatch(user.role, [ 'admin' ]) &&
								<li>
								    <Link href={ '/admin/users' }>
								        <a className="flex gap-2 items-center p-2 rounded-md hover:text-light-50 hover:bg-primary-light-tint dark:hover:bg-light-700 hover:cursor-pointer">
								            <FiUsers />
								            <span>Utilisateurs</span>
								        </a>
								    </Link>
								</li>
                            }
                            <li>
                                <Link href={ '/admin/skills' }>
                                    <a className="flex gap-2 items-center p-2 rounded-md hover:text-light-50 hover:bg-primary-light-tint dark:hover:bg-light-700 hover:cursor-pointer">
                                        <FiAward />
                                        <span>Compétences</span>
                                    </a>
                                </Link>
                            </li>
                            <li>
                                <Link href={ '/admin/productions' }>
                                    <a className="flex gap-2 items-center p-2 rounded-md hover:text-light-50 hover:bg-primary-light-tint dark:hover:bg-light-700 hover:cursor-pointer">
                                        <FiLayers />
                                        <span>Productions</span>
                                    </a>
                                </Link>
                            </li>
                        </ul>
                    </nav>
                    <small className="mt-auto mx-auto text-xs text-primary-dark-tint">Designed by WeBerger</small>
                </div>
            </div>
            {
                isSidebarOpen &&
				<button
				    className="fixed inset-0 z-40 bg-light-800/30 dark:bg-light-600/50"
				    onClick={ () => setIsSidebarOpen(false) }
				></button>
            }
        </>
    );
};

export default Sidebar;

Sidebar.propTypes = {
    isSidebarOpen: bool.isRequired,
    setIsSidebarOpen: func.isRequired,
};
