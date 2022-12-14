import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { ThemeValue, useThemeContext } from '../../context/theme.context';
import { Toaster } from 'react-hot-toast';
import Loader from '../admin/ui/Loader';
import Sidebar from './Sidebar';
import { useAuthContext } from '../../context/auth.context';
import AdminHeader from './AdminHeader';
import { useSession } from 'next-auth/react';

type LayoutProperties = {
	children: ReactNode;
}

const Layout = ({ children = null }: LayoutProperties) => {

    const { data: session, status } = useSession();

    const { currentUser, getCurrentUser } = useAuthContext();
    const { theme, toggleTheme } = useThemeContext();
    const [ showLayout, setShowLayout ] = useState<boolean>(true);
    const [ showHeader, setShowHeader ] = useState<boolean>(false);
    const [ showAdminHeader, setShowAdminHeader ] = useState<boolean>(false);
    const [ showSidebar, setShowSidebar ] = useState<boolean>(false);
    const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (session) {
            getCurrentUser();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ session ]);

    useEffect(() => {
        const pathArr = router.pathname.split('/');
        pathArr.splice(0, 1);
        if ((pathArr[ 0 ] === 'auth' && pathArr[ 1 ] === 'verify-email') || (pathArr[ 0 ] === 'auth' && pathArr[ 1 ] === 'reset-password') || (pathArr[ 0 ] === 'admin' && pathArr[ 1 ] === 'auth')) {
            setShowLayout(false);
            setShowHeader(false);
            setShowAdminHeader(false);
            setShowSidebar(false);
        } else {
            if (currentUser) {
                setShowLayout(true);
                setShowHeader(true);
                setShowAdminHeader(true);
                setShowSidebar(true);
            }
        }
    }, [ router, currentUser ]);

    useEffect(() => {
        const darkMode = localStorage.getItem('theme') as ThemeValue | null;
        toggleTheme(darkMode ? darkMode : 'light');
    }, [ toggleTheme ]);

    useEffect(() => {
        const body = document.getElementsByTagName('body').item(0);
        if (body) {
            body.className = theme === 'dark' ? 'dark text-secondary-light-shade bg-secondary-dark-default' : 'text-secondary-dark-default bg-secondary-light-shade';
        }
    }, [ theme ]);

    return (
        <div className={ 'h-full' }>
            {
                status === 'loading' ?
                    <Loader isLoading={ true } />
                    : <>
                        <div className='flex h-full'>
                            {
                                currentUser && showSidebar &&
                                <Sidebar
                                    setIsSidebarOpen={ setIsSidebarOpen }
                                    isSidebarOpen={ isSidebarOpen }
                                />
                            }
                            <div className='grow h-full flex flex-col'>
                                {
                                    showAdminHeader &&
									<AdminHeader
									    currentUser={ currentUser }
									    isSidebarOpen={ isSidebarOpen }
									    setIsSidebarOpen={ setIsSidebarOpen }
									/>
                                }
                                <div className="grow">
                                    { children }
                                </div>
                            </div>
                        </div>
                        <Toaster
                            position="bottom-right"
                            toastOptions={ { duration: 3000 } }
                        />
                    </>
            }
        </div>
    );

};

export default Layout;
