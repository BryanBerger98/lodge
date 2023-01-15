import Button, { ButtonProperties, ButtonType, ButtonUIOptions, ButtonVariant } from './Button';
import ButtonSavingLoader, { ButtonSavingLoaderProperties } from './ButtonSavingLoader';
import { useCallback, useEffect, useState } from 'react';

export type ButtonWithLoaderProperties = ButtonProperties & Omit<ButtonSavingLoaderProperties, 'saved'>;

const defaultVariant: ButtonVariant = 'primary';
const defaultType: ButtonType = 'button';
const defaultUIOptions: ButtonUIOptions = { shadows: false };

const ButtonWithLoader = ({
    href = undefined,
    variant = defaultVariant,
    type = defaultType,
    onClick,
    disabled = false,
    uiOptions = defaultUIOptions,
    saving = false,
    loaderOrientation = 'right',
    errorCode = null,
    displayErrorMessage = 'none',
    children = null,
}: ButtonWithLoaderProperties) => {

    const [ firstLoad, setFirstLoad ] = useState<boolean>(true);
    const [ saved, setSaved ] = useState<boolean>(false);
    const [ savedDelay, setSavedDelay ] = useState<NodeJS.Timeout | null>(null);

    const triggerLoader = useCallback(() => {
        if (saving) {
            setFirstLoad(false);
            setSaved(false);
            if (savedDelay) clearTimeout(savedDelay);
        }
        if (!saving && !errorCode && !firstLoad) {
            setSaved(true);
            const delay = setTimeout(() => {
                setSaved(false);
            }, 3000);
            setSavedDelay(delay);
        }
    }, [ saving, firstLoad, errorCode, savedDelay ]);

    useEffect(() => {
        triggerLoader();
    	// eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ saving ]);

    return(
        <div className="relative w-fit">
            <div className="relative z-10 w-fit">
                <Button
                    variant={ variant }
                    type={ type }
                    onClick={ onClick }
                    href={ href }
                    disabled={ disabled ? disabled : saving }
                    uiOptions={ uiOptions }
                >
                    {children}
                </Button>
            </div>
            <ButtonSavingLoader
                saved={ saved }
                saving={ saving }
                loaderOrientation={ loaderOrientation }
                errorCode={ errorCode }
                displayErrorMessage={ displayErrorMessage }
            />
        </div>
    );
};

export default ButtonWithLoader;
