import { Typography } from 'antd';
import { ReactNode } from 'react';

const { Title } = Typography;

type PageTitleProperties = {
	children: ReactNode;
}

const PageTitle = ({ children = null }: PageTitleProperties) => {

	return (
		<Title
			style={ {
				fontSize: '2rem',
				fontWeight: 400,
				display: 'flex',
				gap: '1rem',
				alignItems: 'center',
			} }
		>
			{ children }
		</Title>
	);
};

export default PageTitle;
