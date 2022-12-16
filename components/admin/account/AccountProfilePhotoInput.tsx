import { FiUser } from 'react-icons/fi';
import { FC, useRef, useState } from 'react';
import { useAuthContext } from '../../../context/auth.context';
import Image from 'next/image';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { IUser } from '../../../types/user.type';
import useAuthClientService from '../../../services/auth/auth.client.service';

type AccountProfilePhotoInputProperties = {
	currentUser: IUser;
}

const AccountProfilePhotoInput: FC<AccountProfilePhotoInputProperties> = ({ currentUser }) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const { dispatchCurrentUser } = useAuthContext();
    const [ saving, setSaving ] = useState(false);

    const { updateAvatar } = useAuthClientService();

    const handleFileChange = async () => {
        try {
            const files = fileInputRef?.current?.files ?? [ null ];
            const [ file ] = Array.from(files);

            if (!file) {
                console.error('Pick an image !');
                return;
            }
            setSaving(true);


            const fileData = await updateAvatar(file);
            dispatchCurrentUser({
                ...currentUser,
                photo_url: fileData.path,
            });
            setSaving(false);
        } catch (error) {
            console.error(error);
        }
    };

    return(
        <div className="bg-light-50 rounded-full h-32 w-32 lg:h-20 lg:w-20 flex items-center justify-center text-3xl text-light-800 my-auto relative overflow-hidden group">
            {
                currentUser && currentUser.photo_url && currentUser.photo_url !== '' ?
                    <Image
                        src={ `/${ currentUser.photo_url }` }
                        alt={ `${ currentUser.username } profile photo` }
                        layout='fill'
                    />
                    :
                    <FiUser />
            }
            {
                saving &&
                <div className="bg-light-800/50 flex items-center justify-center absolute inset-0 z-10">
                    <AiOutlineLoading3Quarters className={ `text-2xl text-light-50 ${ saving && 'animate-spin' }` } />
                </div>
            }
            {
                !saving &&
                <label
                    htmlFor="updateProfilePhotoInput"
                    className="absolute inset-0 text-xs items-end justify-center hidden group-hover:flex group-hover:cursor-pointer"
                >
                    <small className="text-light-50 bg-light-800/75 pb-1 w-full text-center">MODIFIER</small>
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

export default AccountProfilePhotoInput;
