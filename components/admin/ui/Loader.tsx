import { Spin } from 'antd';

type LoaderProperties = {
	isLoading: boolean;
};

const Loader = ({ isLoading = false }: LoaderProperties) => (
	isLoading ?
		<div
			style={ {
				position: 'absolute',
				inset: 0,
				zIndex: 50,
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'white',
			} }
		>
			<div
				style={ { width: 200 } }
			>
				<Spin
					size="large"
					tip="Chargement..."
				>
					<div className="content" />
				</Spin>
			</div>
		</div>
		: null
);

export default Loader;
