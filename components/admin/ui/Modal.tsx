import { Dialog, Transition } from '@headlessui/react';
import { Fragment, ReactNode } from 'react';

type ModalProperties = {
	isOpen: boolean;
	closeModal: () => void;
	title: {
		text: ReactNode,
        color: string,
	};
	children: ReactNode;
};

const Modal = ({ isOpen, closeModal: handleCloseModal, title, children }: ModalProperties) => {

	return (
		<Transition
			as={ Fragment }
			show={ isOpen }
			appear
		>
			<Dialog
				as="div"
				className="fixed inset-0 z-[9999] overflow-y-auto"
				onClose={ handleCloseModal }
			>
				<div className="min-h-screen px-4 text-center bg-light-800/30 dark:bg-light-600/50">
					<Transition.Child
						as={ Fragment }
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<Dialog.Overlay className="fixed inset-0" />
					</Transition.Child>
					<span
						aria-hidden="true"
						className="inline-block h-screen align-middle"
					>
						&#8203;
					</span>
					<Transition.Child
						as={ Fragment }
						enter="ease-out duration-300"
						enterFrom="opacity-0 scale-95"
						enterTo="opacity-100 scale-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100 scale-100"
						leaveTo="opacity-0 scale-95"
					>
						<div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-light-50 dark:bg-light-900 shadow-xl rounded-lg">
							<Dialog.Title
								as="h3"
								className={ `text-lg font-medium leading-6 ${ title && title.color && title.color !== '' ? title.color : 'text-light-900' }` }
							>
								{ title.text }
							</Dialog.Title>
							{ children }
						</div>
					</Transition.Child>
				</div>
			</Dialog>
		</Transition>
	);
};

export default Modal;
