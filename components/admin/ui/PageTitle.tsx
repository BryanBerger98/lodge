import { ReactNode } from 'react';

type PageTitleProperties = {
	children: ReactNode;
}

const PageTitle = ({ children = null }: PageTitleProperties) => {

    return (
        <h1 className="flex items-center gap-2 text-xl mb-5 dark:text-secondary-light-shade">{ children }</h1>
    );
};

export default PageTitle;
