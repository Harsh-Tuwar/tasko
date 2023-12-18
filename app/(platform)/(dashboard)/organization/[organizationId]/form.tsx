'use client';

import { create } from '@/actions/create-boards';
import { useFormState } from 'react-dom';
import { FormInput } from './form-input';
import { FormButton } from './form-button';

export const Form = () => {
	const initState = { message: '', errors: {} };
	const [state, dispatch] = useFormState(create, initState);

	return (
		<form action={dispatch}>
			<div className='flex flex-col space-y-2'>
				<FormInput errors={state?.errors} />
			</div>
			<FormButton />
		</form>
	);
}
