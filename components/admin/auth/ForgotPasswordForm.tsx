import { SendOutlined } from '@ant-design/icons';
import { Button, Form, Input } from 'antd';

export type ForgotPasswordFormValues = {
	email: string;
}

export type ForgotPasswordFormProperties = {
	onSubmit: (values: ForgotPasswordFormValues) => void;
	requestError: string | null;
	isEmailSent: boolean;
}

const ForgotPasswordForm = ({ onSubmit, requestError = null, isEmailSent }: ForgotPasswordFormProperties) => {

    return (
        <Form
            onFinish={ onSubmit }
            layout="vertical"
        >
            <Form.Item
                label='Adresse email'
                name="email"
                rules={
                    [
                        {
                            required: true,
                            message: 'Champ requis.',
                        },
                        {
                            type: 'email',
                            message: 'Merci de saisir une adresse valide.',
                        },
                    ]
                }
            >
                <Input
                    type="email"
                    placeholder="example@example.com"
                />
            </Form.Item>
            <div
                style={ {
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 16,
                } }
            >
                { requestError && <p className='text-sm text-danger-light-default dark:text-danger-dark-default mb-5'>{ requestError }</p> }
                {
                    !isEmailSent &&
					<>
					    <Button
					        type='primary'
					        htmlType='submit'
					        icon={ <SendOutlined /> }
					    >
							Envoyer
					    </Button>
					    <Button
					        type='link'
					        href='/admin/auth/login'
					    >
							Retour au formulaire de connexion
					    </Button>
					</>
                }
            </div>
        </Form>
    );
};

export default ForgotPasswordForm;
