import { useCallback, useEffect, useState } from 'react';

import Button, { ButtonProperties, ButtonType, ButtonUIOptions, ButtonVariant } from './Button';
import ButtonSavingLoader, { ButtonSavingLoaderProperties } from './ButtonSavingLoader';

export type ButtonWithLoaderProperties = ButtonProperties & Omit<ButtonSavingLoaderProperties, 'saved'>;

const defaultVariant: ButtonVariant = 'primary';
const defaultType: ButtonType = 'button';
const defaultUIOptions: ButtonUIOptions = { shadows: false };

const ButtonWithLoader = ({
	href = undefined,
	variant = defaultVariant,
	type = defaultType,
	onClick: handleClick,
	isDisabled = false,
	uiOptions = defaultUIOptions,
	isSaving = false,
	loaderOrientation = 'right',
	errorCode = null,
	displayErrorMessage = 'none',
	children = null,
}: ButtonWithLoaderProperties) => {

	const [ firstLoad, setFirstLoad ] = useState<boolean>(true);
	const [ saved, setSaved ] = useState<boolean>(false);
	const [ savedDelay, setSavedDelay ] = useState<NodeJS.Timeout | null>(null);

	const triggerLoader = useCallback(() => {
		if (isSaving) {
			setFirstLoad(false);
			setSaved(false);
			if (savedDelay) clearTimeout(savedDelay);
		}
		if (!isSaving && !errorCode && !firstLoad) {
			setSaved(true);
			const delay = setTimeout(() => {
				setSaved(false);
			}, 3000);
			setSavedDelay(delay);
		}
	}, [ isSaving, firstLoad, errorCode, savedDelay ]);

	useEffect(() => {
		triggerLoader();
    	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [ isSaving ]);

	return(
		<div className="relative w-fit">
			<div className="relative z-10 w-fit">
				<Button
					href={ href }
					isDisabled={ isDisabled ? isDisabled : isSaving }
					type={ type }
					uiOptions={ uiOptions }
					variant={ variant }
					onClick={ handleClick }
				>
					{ children }
				</Button>
			</div>
			<ButtonSavingLoader
				displayErrorMessage={ displayErrorMessage }
				errorCode={ errorCode }
				isSaved={ saved }
				isSaving={ isSaving }
				loaderOrientation={ loaderOrientation }
			/>
		</div>
	);
};

export default ButtonWithLoader;
