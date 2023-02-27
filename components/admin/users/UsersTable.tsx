import { format } from 'libphonenumber-js';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FiCheckCircle, FiLock, FiRotateCw, FiUser } from 'react-icons/fi';
import { useSelector } from 'react-redux';

import { useAuthContext } from '../../../context/auth.context';
import useLoadUsersTable from '../../../hooks/useLoadUsersTable';
import { ObjectId } from '../../../infrastructure/types/database.type';
import { selectUsersState } from '../../../store/users.slice';
import { IUser } from '../../../types/user.type';
import { getStringSlashedDateFromDate } from '../../../utils/date.util';
import Table from '../tables/Table';
import { TableField, TableSort } from '../tables/table.type';

import UserTableDataMenu from './UserTableDataMenu';


type UserTableProperties = {
	searchString?: string;
	usersList: IUser[];
	usersCount: number;
};

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

const UsersTable = ({ searchString, usersList, usersCount }: UserTableProperties) => {

	const router = useRouter();

	const { loadUsersTable, DEFAULT_LIMIT, DEFAULT_SKIP, DEFAULT_SORT } = useLoadUsersTable(usersList);
	const { loading } = useSelector(selectUsersState);

	const { currentUser } = useAuthContext();

	const handleReloadTable = (limit: number, skip: number, sort: TableSort) => {
		loadUsersTable({
			limit,
			skip,
			sort,
			searchString,
		});
	};

	const handleEditUser = (userId: string | ObjectId) => () => {
		router.push(`/admin/users/edit/${ userId }`);
	};

	return(
		<>
			<Table
				dataCount={ usersCount }
				dataLoading={ loading }
				defaultLimit={ DEFAULT_LIMIT }
				defaultSkip={ DEFAULT_SKIP }
				defaultSort={ DEFAULT_SORT }
				fields={ tableFields }
				tableName="usersTableConfig"
				onReloadTable={ handleReloadTable }
			>
				{
					usersList ? usersList.map((user) => (
						<tr
							key={ user._id.toString() }
							className={ `${ user.disabled ? 'text-light-400' : '' }` }
						>
							<td
								className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
								onClick={ handleEditUser(user._id) }
							>
								<span className="flex items-center gap-2">
									<div className="h-10 w-10 rounded-full drop-shadow bg-primary-light-default dark:bg-primary-dark-default text-light-50 flex justify-center items-center text-lg overflow-hidden relative">
										{
											user.photo_url && user.photo_url !== '' ?
												<Image
													alt={ `${ user.username ? user.username : user._id } profile photo` }
													className="rounded-full"
													height={ 40 }
													src={ user.photo_url }
													width={ 40 }
												/>
												:
												<FiUser />
										}
										{
											user.disabled ?
												<div className="absolute inset-0 bg-danger-light-default/50 dark:bg-danger-dark-shade/50 flex justify-center items-center rounded-full">
													<FiLock
														className="text-light-50 text-xl"
														title="Compte désactivé"
													/>
												</div>
												: null
										}
									</div>
									{ user.username && user.username.length > 0 ? <span>{ user.username }</span> : <span className="italic text-light-400">Sans nom</span> }
								</span>
							</td>
							<td
								className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
								onClick={ handleEditUser(user._id) }
							>
								<span className="flex items-center gap-1">
									<span>{ user.email }</span>
									{ user.email_verified ?
										<FiCheckCircle
											className="text-success-light-default dark:text-success-dark-default"
											title="Compte vérifié"
										/>
										:
										<FiRotateCw
											className="text-warning-light-default dark:text-warning-dark-default"
											title="En attente de vérification"
										/> }
								</span>
							</td>
							<td
								className="py-3 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
								onClick={ handleEditUser(user._id) }
							>
								{ user.phone_number && user.phone_number.length > 0 ? <span>{ format(user.phone_number, 'INTERNATIONAL') }</span> : '' }
							</td>
							<td
								className="py-2 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
								onClick={ handleEditUser(user._id) }
							>
								{ user.role === 'admin' ? 'Administrateur' : user.role === 'user' ? 'Utilisateur' : '' }
							</td>
							<td
								className="py-2 border-b-[0.5px] border-light-300 dark:border-light-700 cursor-pointer"
								onClick={ handleEditUser(user._id) }
							>
								{ user.created_on ? getStringSlashedDateFromDate(new Date(user.created_on), 'fr') : null }
							</td>
							<td className="py-2 border-b-[0.5px] border-light-300 dark:border-light-700 text-center">
								<UserTableDataMenu
									currentUser={ currentUser }
									user={ user }
								/>
							</td>
						</tr>
					)) : null
				}
			</Table>
		</>
	);
};

export default UsersTable;
