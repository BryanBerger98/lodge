import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';
import { useAuthContext } from '../../context/auth.context';
import { useSession } from 'next-auth/react';
import { Breadcrumb, Layout as AntLayout, theme as antTheme } from 'antd';
import Sider from './Sider';
import Header from './Header';
import Loader from '../admin/ui/Loader';

const { Content, Footer } = AntLayout;

type LayoutProperties = {
	children: ReactNode;
}

const Layout = ({ children = null }: LayoutProperties) => {

    const { data: session, status } = useSession();

    const { currentUser, getCurrentUser } = useAuthContext();
    const [ showLayout, setShowLayout ] = useState<boolean>(true);
    const [ showHeader, setShowHeader ] = useState<boolean>(false);
    const [ showAdminHeader, setShowAdminHeader ] = useState<boolean>(false);
    const [ showSidebar, setShowSidebar ] = useState<boolean>(false);
    const [ isSidebarOpen, setIsSidebarOpen ] = useState<boolean>(false);
    const router = useRouter();

    const [ collapsed, setCollapsed ] = useState(false);

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

    const { token } = antTheme.useToken();

    return (
        <>
            <AntLayout
                style={ {
                    minHeight: '100vh',
                    flexFlow: 'row',
                } }
            >
                {
                    status === 'loading' ? <Loader isLoading={ true } /> :
                        <>
                            {
                                currentUser && showSidebar &&
								<Sider
                                	collapsed={ collapsed }
                                	setCollapsed={ setCollapsed }
								/>
                            }
                            <AntLayout
                                style={ {
                                    flexFlow: 'column',
                                    flexGrow: 1,
                                } }
                            >
                                {
                                    currentUser && showAdminHeader &&
									<Header
									    token={ token }
									    collapsed={ collapsed }
									    setCollapsed={ setCollapsed }
									/>
                                }
                                <Content
                                    style={ {
                                        flexGrow: 1,
                                        margin: 24,
                                    } }
                                >
                                    <div
                                        style={ {
                                            padding: 24,
                                            minHeight: '100%',
                                            background: token.colorBgContainer,
                                        } }
                                    >
                                        { children }
                                    </div>
                                </Content>
                            </AntLayout>
                        </>
                }
            </AntLayout>
            {/* <div
            style={ { height: '100%' } }
            className={ 'h-full' }
        >
            {
                status === 'loading' ?
                    <Loader isLoading={ true } />
                    : <>
                        <div
                            className='flex h-full'
                            style={ { height: '100%' } }
                        >
                            {
                                currentUser && showSidebar &&
                                <Sidebar
                                    setIsSidebarOpen={ setIsSidebarOpen }
                                    isSidebarOpen={ isSidebarOpen }
                                />
                            }
                            <div
                                style={ {
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                } }
                                className='grow h-full flex flex-col'
                            >
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
        </div> */}
        </>
    );

};

export default Layout;
