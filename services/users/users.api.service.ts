import { createFile, deleteFileById, findFileByUrl } from '@infrastructure/data-access/file.data-access';
import { updateUser } from '@infrastructure/data-access/user.data-access';
import { ObjectId } from '@infrastructure/types/database.type';
import { deleteFileFromKey, getFileFromKey } from '@lib/bucket';
import { convertFileRequestObjetToModel } from '@utils/file.util';
import { IUser } from 'types/user.type';


export const updateUserProfilePhoto = async (user: IUser, file: Express.MulterS3.File, actionAuthorId: string | ObjectId) => {

	if (user.photo_url && user.photo_url !== '') {
		const oldFile = await findFileByUrl(user.photo_url);
		if (oldFile) {
			await deleteFileFromKey(oldFile.key);
			await deleteFileById(oldFile._id);
		}
	}

	const parsedFile = {
		...convertFileRequestObjetToModel(file),
		created_by: actionAuthorId,
	};

	const savedFile = await createFile(parsedFile);

	await updateUser({
		_id: user._id,
		photo_url: parsedFile.url,
	});

	const photoUrl = savedFile ? await getFileFromKey(savedFile) : null;

	return {
		photoUrl,
		file: savedFile,
	};
};
