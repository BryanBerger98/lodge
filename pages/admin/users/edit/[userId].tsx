import { FiAlertTriangle, FiChevronLeft } from 'react-icons/fi';
import { useEffect, useState } from 'react';
import csrf, { CsrfRequest, CsrfResponse } from '../../../../utils/csrf.util';
import EditUserInformationsSection from '../../../../components/admin/users/EditUserInformationsSection';
import { isUserAbleToWatch } from '../../../../utils/permissions.util';
import Button from '../../../../components/admin/ui/Button/Button';
import { useCsrfContext } from '../../../../context/csrf.context';
import { IUser } from '../../../../types/user.type';
import EditUserForm, { EditUserFormInputs } from '../../../../components/admin/users/EditUserForm';
import { useAuthContext } from '../../../../context/auth.context';
import { wrapper } from '../../../../store';
import { findUserById } from '../../../../infrastructure/data-access/user.data-access';
import { getSession } from 'next-auth/react';
import { updateUser } from '../../../../services/users/users.client.service';

type EditUserPageProperties = {
	csrfToken: string;
	userToEdit: IUser;
}

const EditUserPage = ({ csrfToken, userToEdit }: EditUserPageProperties) => {

    const [ user, setUser ] = useState<IUser | null>(userToEdit);
    const [ saving, setSaving ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState<string | null>(null);
    const { dispatchCsrfToken } = useCsrfContext();

    const { currentUser } = useAuthContext();

    useEffect(() => {
        dispatchCsrfToken(csrfToken);
    }, [ dispatchCsrfToken, csrfToken ]);

    const handleSubmit = (values: EditUserFormInputs) => {
        if (user) {
            setSaving(true);
            updateUser({
                ...user,
                ...values,
            }, csrfToken)
                .then(userData => {
                    setUser(userData);
                })
                .catch(console.error)
                .finally(() => {
                    setSaving(false);
                });
        }
    };

    return(
        <div className="container mx-auto my-10 px-5">
            <div className="flex mb-5 text-sm">
                <Button
                    variant='link-danger'
                    href='/admin/users'
                >
                    <FiChevronLeft />
                    <span>Retour</span>
                </Button>
            </div>
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 lg:col-span-10 xl:col-span-8 2xl:col-span-6">
                    <EditUserInformationsSection
                        user={ user }
                        setUser={ setUser }
                        currentUser={ currentUser as IUser }
                    />
                </div>
            </div>
            {
                user && user.disabled &&
				<div className="grid grid-cols-12 gap-2">
				    <div className="col-span-12 lg:col-span-10 xl:col-span-8 2xl:col-span-6 p-6 bg-white dark:bg-light-900 drop-shadow mb-4 rounded-md flex items-center justify-between">
				        <div>
				            <h3 className="flex items-center gap-2 text-lg text-warning-light-default dark:text-warning-dark-default">
				                <FiAlertTriangle />
				                <span>Ce compte est suspendu</span>
				            </h3>
				        </div>
				    </div>
				</div>
            }
            <div className="grid grid-cols-12 gap-2">
                <div className="col-span-12 lg:col-span-10 xl:col-span-8 2xl:col-span-6 bg-white dark:bg-secondary-dark-shade drop-shadow p-6 rounded-md">
                    <EditUserForm
                        user={ user }
                        onSubmit={ handleSubmit }
                        saving={ saving }
                        errorCode={ errorCode }
                    />
                </div>
            </div>
        </div>
    );
};

export default EditUserPage;

const getServerSideProps = wrapper.getServerSideProps(store => async ({ req, res, params }) => {
    const request = req as CsrfRequest;
    const response = res as CsrfResponse;
    await csrf(request, response);

    const session = await getSession({ req });

    if (!session || session && !isUserAbleToWatch(session.user.role, [ 'admin' ])) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    const { userId } = params as { userId: string };

    const user = await findUserById(userId);

    return {
        props: {
            userToEdit: JSON.parse(JSON.stringify(user)),
            session,
            csrfToken: request.csrfToken(),
        },
    };

});

export { getServerSideProps };
