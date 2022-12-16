import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FC, useEffect } from 'react';
import { FiUser } from 'react-icons/fi';
import AccountChangePasswordForm from '../../../components/admin/account/AccountChangePasswordForm';
import AccountContactInformationsForm from '../../../components/admin/account/AccountContactInformationsForm';
import AccountEmailVerification from '../../../components/admin/account/AccountEmailVerification';
import AccountInformationsSection from '../../../components/admin/account/AccountInformationsSection';
import PageTitle from '../../../components/admin/ui/PageTitle';
import { useAuthContext } from '../../../context/auth.context';
import { useCsrfContext } from '../../../context/csrf.context';
import csrf, { CsrfRequest, CsrfResponse } from '../../../utils/csrf.util';

type AdminAccountPageProperties = {
	csrfToken: string;
}

const AdminAccountPage: FC<AdminAccountPageProperties> = ({ csrfToken }) => {

    const { currentUser } = useAuthContext();
    const { dispatchCsrfToken } = useCsrfContext();

    useEffect(() => {
        dispatchCsrfToken(csrfToken);
    }, [ dispatchCsrfToken, csrfToken ]);

    return (
        <div className="container mx-auto lg:px-5 my-10 text-gray-800">
            <PageTitle><FiUser /><span>Mon compte</span></PageTitle>

            <AccountInformationsSection currentUser={ currentUser } />
            { currentUser && !currentUser.email_verified && <AccountEmailVerification /> }
            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-6">
                    <div className="h-full bg-white dark:bg-gray-900 dark:text-gray-200 rounded-md drop-shadow p-5 text-sm">
                        { currentUser && <AccountContactInformationsForm currentUser={ currentUser } /> }
                    </div>
                </div>
                <div className="col-span-12 lg:col-span-6">
                    <div className="h-full bg-white dark:bg-gray-900 dark:text-gray-200 rounded-md drop-shadow p-5 flex flex-col text-sm">
                        <AccountChangePasswordForm />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminAccountPage;

const getServerSideProps = async ({ req, res }: GetServerSidePropsContext & { req: CsrfRequest, res: CsrfResponse }) => {
    const session = await getSession({ req });
    await csrf(req, res);

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {
            session,
            csrfToken: req.csrfToken(),
        },
    };
};

export { getServerSideProps };
