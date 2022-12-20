import { FiCheckCircle, FiLock, FiRotateCw, FiUser } from 'react-icons/fi';
import { getStringSlashedDateFromDate } from '../../../utils/date.utils';
import { Fragment, useEffect } from 'react';
import UserTableDataMenu from './UserTableDataMenu';
import Image from 'next/image';
import Table, { TableSort } from '../tables/Table';
import { useRouter } from 'next/router';
import { format } from 'libphonenumber-js';
import { useAuthContext } from '../../../context/auth.context';
import { IUser } from '../../../types/user.type';
import { ObjectId } from '../../../infrastructure/types/database.type';
import useLoadUsersTable from '../../../hooks/useLoadUsersTable';

type UserTableProperties = {
	searchString?: string;
	usersList: IUser[];
	usersCount: number;
};

export type TableField = {
	title: string;
	name: string;
	sortable: boolean,
	fontStyle: 'bold' | 'semibold' | 'medium' | 'light',
	align: 'left' | 'right' | 'center',
};

export type TableConfig = {
	limit: number;
	skip: number;
	sort: TableSort;
}

const UsersTable = ({ searchString, usersList, usersCount }: UserTableProperties) => {

    const router = useRouter();

    const tableFields: TableField[] = [
        {
            title: 'Nom',
            name: 'displayName',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left',
        },
        {
            title: 'Adresse email',
            name: 'email',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left',
        },
        {
            title: 'Téléphone',
            name: 'phoneNumber',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left',
        },
        {
            title: 'Rôle',
            name: 'role',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left',
        },
        {
            title: 'Date de création',
            name: 'createdAt',
            sortable: true,
            fontStyle: 'semibold',
            align: 'left',
        },
        {
            title: 'Actions',
            name: 'actions',
            sortable: false,
            fontStyle: 'semibold',
            align: 'center',
        },
    ];

    const { dataLoading, loadUsersTable, DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_SORT } = useLoadUsersTable(usersList);

    const { currentUser } = useAuthContext();

    const handleReloadTable = (limit: number, skip: number, sort: TableSort) => {
        loadUsersTable({
            limit,
            skip,
            sort,
            searchString,
        });
    };

    const onEditUser = (userId: string | ObjectId) => {
        router.push(`/admin/users/edit/${ userId }`);
    };

    useEffect(() => {
        // loadUsersTable(limit, skip, sort as TableSort, searchString);
    	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchString ]);

    return(
        <Fragment>
            <Table
                tableName='usersTableConfig'
                dataLoading={ dataLoading }
                dataCount={ usersCount }
                defaultLimit={ DEFAULT_LIMIT }
                defaultSkip={ DEFAULT_SKIP }
                defaultSort={ DEFAULT_SORT }
                fields={ tableFields }
                onReloadTable={ handleReloadTable }
            >
                {
                    usersList && usersList.map((user, index) => (
                        <tr
                            key={ user._id + '-' + index }
                            className={ `${ user.disabled ? 'text-light-400' : '' }` }
                        >
                            <td
                                className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
                                onClick={ () => onEditUser(user._id) }
                            >
                                <span className="flex items-center gap-2">
                                    <div className="h-10 w-10 rounded-full drop-shadow bg-primary-light-default dark:bg-primary-dark-default text-light-50 flex justify-center items-center text-lg overflow-hidden relative">
                                        {
                                            user.photo_url && user.photo_url !== '' ?
                                                <Image
                                                    className="rounded-full"
                                                    src={ `/${ user.photo_url }` }
                                                    alt={ `${ user.username ? user.username : user._id } profile photo` }
                                                    height={ 40 }
                                                    width={ 40 }
                                                />
                                                :
                                                <FiUser />
                                        }
                                        {
                                            user.disabled &&
                                            <div className="absolute inset-0 bg-danger-light-default/50 dark:bg-danger-dark-shade/50 flex justify-center items-center rounded-full">
                                            	<FiLock
                                            		title='Compte désactivé'
                                            		className="text-light-50 text-xl"
                                            	/>
                                            </div>
                                        }
                                    </div>
                                    {user.username && user.username.length > 0 ? <span>{user.username}</span> : <span className="italic text-light-400">Sans nom</span>}
                                </span>
                            </td>
                            <td
                                className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
                                onClick={ () => onEditUser(user._id) }
                            >
                                <span className="flex items-center gap-1">
                                    <span>{user.email}</span>
                                    { user.email_verified ?
                                        <FiCheckCircle
                                            title='Compte vérifié'
                                            className="text-success-light-default dark:text-success-dark-default"
                                        />
                                        :
                                        <FiRotateCw
                                            title="En attente de vérification"
                                            className="text-warning-light-default dark:text-warning-dark-default"
                                        />
                                    }
                                </span>
                            </td>
                            <td
                                className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
                                onClick={ () => onEditUser(user._id) }
                            >
                                {user.phone_number && user.phone_number.length > 0 ? <span>{ format(user.phone_number, 'INTERNATIONAL') }</span> : ''}
                            </td>
                            <td
                                className="py-2 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
                                onClick={ () => onEditUser(user._id) }
                            >
                                {user.role === 'admin' ? 'Administrateur' : user.role === 'user' ? 'Utilisateur' : ''}
                            </td>
                            <td
                                className="py-2 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
                                onClick={ () => onEditUser(user._id) }
                            >
                                {user.created_on && getStringSlashedDateFromDate(new Date(user.created_on), 'fr')}
                            </td>
                            <td className="py-2 border-b-[0.5px] border-light-300 dark:border-light-700 text-center">
                                <UserTableDataMenu
                                    user={ user }
                                    currentUser={ currentUser }
                                />
                            </td>
                        </tr>
                    ))
                }
            </Table>
        </Fragment>
    );
};

export default UsersTable;
