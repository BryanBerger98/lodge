import { CameraOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { useState } from 'react';

import { useAuthContext } from '@context/auth.context';
import { useCsrfContext } from '@context/csrf.context';
import useToast from '@hooks/useToast';
import { updateAvatar } from '@services/auth/auth.client.service';
import { checkIfFileIsAnImage } from '@utils/file.util';
import { IUser } from 'types/user.type';


type AccountProfilePhotoInputProperties = {
	currentUser: IUser;
}

const AccountProfilePhotoInput = ({ currentUser }: AccountProfilePhotoInputProperties) => {

	const { dispatchCurrentUser } = useAuthContext();

	const [ saving, setSaving ] = useState(false);
	const [ isImgOverlayDisplayed, setIsImgOverlayDisplayed ] = useState(false);
	const { csrfToken } = useCsrfContext();

	const { triggerErrorToast } = useToast({ locale: 'fr' });

	const handleFileChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
		if (info.file.status === 'uploading') {
			return setSaving(true);
		}
		if (info.file.status === 'done') {
			return setSaving(false);
		}
		if (info.file.status === 'error') {
			triggerErrorToast(info.file.error);
			return setSaving(false);
		}
	};

	const onUploadFile = async (file: RcFile) => {
		const { photoUrl } = await updateAvatar(file, csrfToken);
		dispatchCurrentUser({
			...currentUser,
			photo_url: photoUrl,
		});
		return photoUrl;
	};

	const onBeforeUpload = (file: RcFile) => {
		const isFileAnImage = checkIfFileIsAnImage(file.type);
		if (!isFileAnImage) {
			message.error('Seuls les fichiers gif, jpeg, png et webp sont acceptés.');
		}
		const hasFileGoodSize = file.size / 1024 / 1024 < 5;
		if (!hasFileGoodSize) {
			message.error('La taille de l\'image doit être inférieure à 5Mo.');
		  }
		return ;
	};

	const uploadButton = (
		<div>
			{ saving ? <LoadingOutlined /> : <PlusOutlined /> }
			<div style={ { marginTop: 8 } }>Photo</div>
		</div>
	);

	const handleDisplayImgOverlay = (event: 'enter' | 'leave') => () => {
		if (event === 'enter') {
			return setIsImgOverlayDisplayed(true);
		}
		setIsImgOverlayDisplayed(false);
	};

	return(
		<>
			<Upload
				action={ onUploadFile }
				beforeUpload={ onBeforeUpload }
				className="avatar-uploader"
				listType="picture-circle"
				name="avatar"
				showUploadList={ false }
				onChange={ handleFileChange }
			>
				{ currentUser.photo_url ?
					<div
						style={ {
							width: '100%',
							display: 'flex',
							position: 'relative',
							alignItems: 'center',
							justifyContent: 'center',
							padding: 2,
							borderRadius: '200px',
							overflow: 'hidden',
						} }
					>
						<img
							alt="avatar"
							src={ currentUser.photo_url }
							style={ {
								width: '100%',
								borderRadius: '200px',
							} }
							onMouseEnter={ handleDisplayImgOverlay('enter') }
						/>
						<div
							role="button"
							style={ {
								display: isImgOverlayDisplayed || saving ? 'flex' : 'none',
								position: 'absolute',
								inset: 2,
								borderRadius: '200px',
								backgroundColor: 'rgba(0, 0, 0, 0.6)',
								justifyContent: 'center',
								alignItems: 'center',
							} }
							onMouseLeave={ handleDisplayImgOverlay('leave') }
						>
							{
								saving ?
									<LoadingOutlined
										style={ {
											color: 'white',
											fontSize: '2rem',
										} }
									/>
									:
									<CameraOutlined
										style={ {
											color: 'white',
											fontSize: '2rem',
										} }
									/>
							}
						</div>
					</div>
					: uploadButton }
			</Upload>
		</>
	);
};

export default AccountProfilePhotoInput;
