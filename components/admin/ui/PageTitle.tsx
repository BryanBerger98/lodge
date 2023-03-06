import { Typography } from 'antd';
import { CSSProperties, ReactNode } from 'react';

const { Title } = Typography;

type PageTitleProperties = {
	children: ReactNode;
	style?: CSSProperties;
}

const PageTitle = ({ children = null, style = {} }: PageTitleProperties) => {

	return (
		<Title
			style={ {
				fontSize: '2rem',
				fontWeight: 400,
				display: 'flex',
				gap: '1rem',
				alignItems: 'center',
				...style,
			} }
		>
			{ children }
		</Title>
	);
};

export default PageTitle;
