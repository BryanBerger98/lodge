import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import { FiHome } from 'react-icons/fi';
import PageTitle from '../../../components/admin/ui/PageTitle';

const AdminDashboardPage = () => {
    return(
        <div className="container mx-auto my-10 px-5">
            <PageTitle><FiHome /><span>Tableau de bord</span></PageTitle>
        </div>
    );
};

export default AdminDashboardPage;

const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
    const session = await getSession({ req });

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return { props: { session } };
};

export { getServerSideProps };
