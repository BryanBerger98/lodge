import Image from 'next/image';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { FiUser } from 'react-icons/fi';
import { useCsrfContext } from '../../../context/csrf.context';
import useToast from '../../../hooks/useToast';
import { updateUserAvatar } from '../../../services/users/users.client.service';
import { IApiError } from '../../../types/error.type';
import { IUser } from '../../../types/user.type';
import { checkIfFileIsAnImage } from '../../../utils/file.util';

type UserProfilePhotoInputProperties = {
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser | null>>;
};

const UserProfilePhotoInput = ({ user, setUser }: UserProfilePhotoInputProperties) => {

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [ saving, setSaving ] = useState(false);
    const { csrfToken } = useCsrfContext();

    const { triggerErrorToast } = useToast({ locale: 'fr' });

    const handleFileChange = async () => {
        try {
            const files = fileInputRef?.current?.files ?? [ null ];
            const [ file ] = Array.from(files);
            if (!file || file && !checkIfFileIsAnImage(file.type)) {
                triggerErrorToast('Merci de choisir une image.');
                return;
            }
            setSaving(true);
            const fileData = await updateUserAvatar(user._id, file, csrfToken);
            setUser({
                ...user,
                photo_url: fileData.photoUrl,
            });
        } catch (error) {
            triggerErrorToast(error as IApiError);
        } finally {
            setSaving(false);
        }
    };

    return(
        <div className="bg-light-50 rounded-full h-32 w-32 lg:h-20 lg:w-20 flex items-center justify-center text-3xl text-secondary-dark-default my-auto relative overflow-hidden group">
            {
                user && user.photo_url && user.photo_url !== '' ?
                    <Image
                        src={ user.photo_url }
                        alt={ `${ user.username } profile photo` }
                        fill
                    />
                    : <FiUser />
            }
            {
                saving &&
                <div className="bg-secondary-dark-default/50 flex items-center justify-center absolute inset-0 z-10">
                    <AiOutlineLoading3Quarters className={ `text-2xl text-light-50 ${ saving && 'animate-spin' }` } />
                </div>
            }
            {
                !saving &&
                <label
                    htmlFor="updateProfilePhotoInput"
                    className="absolute inset-0 text-xs items-end justify-center hidden group-hover:flex group-hover:cursor-pointer"
                >
                    <small className="text-light-50 bg-secondary-dark-default/75 pb-1 w-full text-center">MODIFIER</small>
                </label>
            }
            <input
                type="file"
                id="updateProfilePhotoInput"
                onChange={ handleFileChange }
                ref={ fileInputRef }
                hidden
            />
        </div>
    );
};

export default UserProfilePhotoInput;
