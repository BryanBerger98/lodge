import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, FC, memo } from 'react';
import { useCsrfContext } from '../../../../context/csrf.context';
import csrf from '../../../../utils/csrf.util';
import { GetServerSidePropsContextWithCsrf } from '../../../../types/ssr.type';
import VerifyEmailBlock from '../../../../components/admin/auth/VerifyEmailBlock';

type VerifyEmailPageProperties = {
	csrfToken: string;
}
const VerifyEmailPage: FC<VerifyEmailPageProperties> = ({ csrfToken }) => {

    const router = useRouter();
    const { data: session, status } = useSession();

    if (status !== 'authenticated' || !session) {
        router.replace('/');
    }
    const { dispatchCsrfToken } = useCsrfContext();

    useEffect(() => {
        dispatchCsrfToken(csrfToken);
    }, [ csrfToken, dispatchCsrfToken ]);

    return(
        <VerifyEmailBlock />
    );
};

export default memo(VerifyEmailPage);

const getServerSideProps = async ({ req, res }: GetServerSidePropsContextWithCsrf) => {
    await csrf(req, res);

    return { props: { csrfToken: req.csrfToken() } };
};

export { getServerSideProps };
