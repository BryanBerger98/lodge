import { FiCheckCircle, FiLock, FiRotateCw, FiUser } from 'react-icons/fi';
import { getStringSlashedDateFromDate } from '../../../utils/date.utils';
import { useState, Fragment, useCallback, useEffect } from 'react';
import UserTableDataMenu from './UserTableDataMenu';
import Image from 'next/image';
import Table, { TableSort } from '../tables/Table';
import { useRouter } from 'next/router';
import { format } from 'libphonenumber-js';
import { useAuthContext } from '../../../context/auth.context';
import useUsersClientService from '../../../services/users/users.client.service';
import { useDispatch } from 'react-redux';
import { setUsersState } from '../../../store/users.slice';
import { IUser } from '../../../types/user.type';
import { ObjectId } from '../../../infrastructure/types/database.type';

type UserTableProperties = {
	searchString?: string;
	usersList: IUser[];
	usersCount: number;
};

type TableField = {
	title: string;
	name: string;
	sortable: boolean,
	fontStyle: 'bold' | 'semibold' | 'medium' | 'light',
	align: 'left' | 'right' | 'center',
};

type TableConfig = {
	limit: number;
	skip: number;
	sort: TableSort;
}

const UsersTable = ({ searchString, usersList, usersCount }: UserTableProperties) => {

    const router = useRouter();
    const { getUsers } = useUsersClientService();
    const dispatch = useDispatch();

    const LOCAL_USERS_TABLE_CONFIG = localStorage.getItem('usersTableConfig') ? JSON.parse(localStorage.getItem('usersTableConfig') as string) as TableConfig : null;

    const DEFAULT_LIMIT = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.limit ? LOCAL_USERS_TABLE_CONFIG.limit : 10;
    const DEFAULT_SKIP = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.skip ? LOCAL_USERS_TABLE_CONFIG.skip : 0;
    const DEFAULT_SORT: TableSort = LOCAL_USERS_TABLE_CONFIG && LOCAL_USERS_TABLE_CONFIG.sort && LOCAL_USERS_TABLE_CONFIG.sort.field ? LOCAL_USERS_TABLE_CONFIG.sort : {
        field: 'createdAt',
        direction: -1,
    };

    const [ limit, setLimit ] = useState<number>(DEFAULT_LIMIT);
    const [ skip, setSkip ] = useState<number>(DEFAULT_SKIP);
    const [ sort, setSort ] = useState<TableSort | undefined>(DEFAULT_SORT);

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

    const { currentUser } = useAuthContext();
    const [ dataLoading, setDataLoading ] = useState<boolean>(usersList ? false : true);

    const loadUsersTable = useCallback((limit: number, skip: number, sort: TableSort, searchString?: string) => {
        getUsers(sort, skip, limit, searchString)
            .then(response => {
                dispatch(setUsersState(response));
            })
            .catch(console.error)
            .finally(() => setDataLoading(false));
    	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ setDataLoading, usersList ]);


    const handleReloadTable = (limit: number, skip: number, sort: TableSort) => {
        setLimit(limit);
        setSkip(skip);
        setSort((prevSort: TableSort | undefined) => {
            if (!prevSort || (prevSort && (prevSort.direction !== sort.direction || prevSort.field !== sort.field))) {
                return sort;
            }
        });
        loadUsersTable(limit, skip, sort);
    };

    const onEditUser = (userId: string | ObjectId) => {
        router.push(`/admin/users/edit/${ userId }`);
    };

    useEffect(() => {
        loadUsersTable(limit, skip, sort as TableSort, searchString);
    	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ searchString ]);

    // useEffect(() => {
    //     getSession()
    //         .then(session => {
    //             if (session) {
    //                 setCurrentUser(session.user);
    //             }
    //         });
    // }, [ setCurrentUser ]);

    useEffect(() => {
        setDataLoading(true);
    }, [ setDataLoading ]);

    return(
        <Fragment>
            <Table
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
