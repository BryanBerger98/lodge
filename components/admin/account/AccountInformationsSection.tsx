import { EditOutlined } from '@ant-design/icons';
import { Button, Space, Tag } from 'antd';
import { FC, useState } from 'react';

import { useAuthContext } from '../../../context/auth.context';
import useTranslate from '../../../hooks/useTranslate';
import { IUser } from '../../../types/user.type';
import PageTitle from '../ui/PageTitle';

import AccountInformationsFormModal from './AccountInformationsFormModal';
import AccountProfilePhotoInput from './AccountProfilePhotoInput';

type AccountInformationsSectionProperties = {
	currentUser: IUser | null;
}

const AccountInformationsSection: FC<AccountInformationsSectionProperties> = ({ currentUser }) => {

	const { dispatchCurrentUser } = useAuthContext();
	const { getTranslatedRole } = useTranslate({ locale: 'fr' });

	const [ isEditAccountInfosModalOpen, setIsEditAccountInfosModalOpen ] = useState(false);

	const handleEditInformations = () => setIsEditAccountInfosModalOpen(true);

	return(
		<>
			{
				currentUser ?
					<Space
						className="drop-shadow"
						style={ {
							borderRadius: 8,
							backgroundColor: '#F5F5F5',
							padding: '2rem',
							margin: '2rem 0 1rem 0',
							width: '100%',
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
						} }
					>
						<Space
							size="large"
						>
							<AccountProfilePhotoInput
								currentUser={ currentUser }
							/>
							<Space direction="vertical">
								<PageTitle style={ { margin: 0 } }>{ currentUser.username }</PageTitle>
								<Space size="small">
									<Tag>{ getTranslatedRole(currentUser.role) }</Tag>
								</Space>
							</Space>
						</Space>
						<Button
							icon={ <EditOutlined /> }
							onClick={ handleEditInformations }
						>
							Modifier
						</Button>
					</Space>
					: null
			}
			{
				currentUser ?
					<AccountInformationsFormModal
						dispatchUser={ dispatchCurrentUser }
						isOpen={ isEditAccountInfosModalOpen }
						setIsOpen={ setIsEditAccountInfosModalOpen }
						user={ currentUser }
					/>
					: null
			}
		</>
	);
};

export default AccountInformationsSection;
