import { CameraOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { message, Upload } from 'antd';
import type { RcFile, UploadChangeParam, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { Dispatch, SetStateAction, useState } from 'react';

import { useCsrfContext } from '@context/csrf.context';
import useToast from '@hooks/useToast';
import { updateUserAvatar } from '@services/users/users.client.service';
import { checkIfFileIsAnImage } from '@utils/file.util';
import { IUser } from 'types/user.type';

type UserProfilePhotoInputProperties = {
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser | null>>;
};

const UserProfilePhotoInput = ({ user, setUser }: UserProfilePhotoInputProperties) => {

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
		const { photoUrl } = await updateUserAvatar(user._id, file, csrfToken);
		setUser({
			...user,
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
				{ user.photo_url ?
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
							src={ user.photo_url }
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
			{ /* <div className="bg-light-50 rounded-full h-32 w-32 lg:h-20 lg:w-20 flex items-center justify-center text-3xl text-secondary-dark-default my-auto relative overflow-hidden group">
				{
					user && user.photo_url && user.photo_url !== '' ?
						<Image
							alt={ `${ user.username } profile photo` }
							src={ user.photo_url }
							fill
						/>
						: <FiUser />
				}
				{
					saving ?
						<div className="bg-secondary-dark-default/50 flex items-center justify-center absolute inset-0 z-10">
							<AiOutlineLoading3Quarters className={ `text-2xl text-light-50 ${ saving && 'animate-spin' }` } />
						</div>
						: null
				}
				{
					!saving &&
						<label
							className="absolute inset-0 text-xs items-end justify-center hidden group-hover:flex group-hover:cursor-pointer"
							htmlFor="updateProfilePhotoInput"
						>
							<small className="text-light-50 bg-secondary-dark-default/75 pb-1 w-full text-center">MODIFIER</small>
						</label>
				}
				<input
					id="updateProfilePhotoInput"
					ref={ fileInputRef }
					type="file"
					hidden
					onChange={ handleFileChange }
				/>
			</div> */ }
		</>
	);
};

export default UserProfilePhotoInput;
