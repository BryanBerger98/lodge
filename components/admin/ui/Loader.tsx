import { AiOutlineLoading3Quarters } from 'react-icons/ai';

type LoaderProperties = {
	isLoading: boolean;
};

const Loader = ({ isLoading = false }: LoaderProperties) => (
    isLoading ?
        <div className="absolute inset-0 z-50 bg-light-50/30 dark:bg-secondary-dark-tint/60 flex items-center justify-center">
	    	<AiOutlineLoading3Quarters className={ `text-6xl text-primary-light-default dark:text-primary-dark-shade ${ isLoading && 'animate-spin' }` } />
        </div>
        : null
);

export default Loader;
