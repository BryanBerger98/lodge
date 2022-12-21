import { FiChevronLeft, FiUserPlus } from 'react-icons/fi';
import { useState } from 'react';
import csrf from '../../../../utils/csrf.util';
import { string } from 'prop-types';
import { GetServerSidePropsContextWithCsrf } from '../../../../types/ssr.type';
import Button from '../../../../components/admin/ui/Button/Button';
import EditUserForm, { EditUserFormInputs } from '../../../../components/admin/users/EditUserForm';
import { createUser } from '../../../../services/users/users.client.service';
import { useRouter } from 'next/router';
import { IApiError } from '../../../../types/error.type';
import useTranslate from '../../../../hooks/useTranslate';

type NewUserPage = {
	csrfToken: string;
}

const NewUserPage = ({ csrfToken }: NewUserPage) => {

    const [ saving, setSaving ] = useState<boolean>(false);
    const [ errorCode, setErrorCode ] = useState<string | null>(null);

    const router = useRouter();

    const { getTranslatedError } = useTranslate({ locale: 'fr' });

    const handleSubmit = (values: EditUserFormInputs) => {
        setSaving(true);

        createUser({
            ...values,
            provider_data: 'email',
        }, csrfToken)
            .then(createdUser => {
                router.replace(`/admin/users/edit/${ createdUser._id }`);
            })
            .catch(error => {
                const apiError = error as IApiError;
                if (apiError.response && apiError.response.data && apiError.response.data.code) {
                    const errorMessage = getTranslatedError(apiError.response.data.code);
                    setErrorCode(errorMessage);
                    return;
                }
                // console.error(apiError);
            })
            .finally(() => {
                setSaving(false);
            });
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
            <div className="grid grid-cols-12">
                <div className="col-span-12 lg:col-span-10 xl:col-span-8 2xl:col-span-6 bg-white dark:bg-secondary-dark-shade drop-shadow p-10 rounded-md">
                    <h1 className="flex items-center gap-2 text-xl mb-5 text-primary-light-default dark:text-primary-dark-default"><FiUserPlus /><span>Nouvel utilisateur</span></h1>
                    <EditUserForm
                        onSubmit={ handleSubmit }
                        errorCode={ errorCode }
                        saving={ saving }
                    />
                </div>
            </div>
        </div>
    );
};

export default NewUserPage;

NewUserPage.propTypes = { csrfToken: string };

NewUserPage.defaultProps = { csrfToken: null };

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf ) => {
    await csrf(req, res);

    return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
