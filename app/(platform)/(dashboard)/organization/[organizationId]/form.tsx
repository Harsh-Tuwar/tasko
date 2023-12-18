'use client';

import { FormButton } from './form-button';

import { useAction } from '@/hooks/useActions';
import { createBoard } from '@/actions/create-board';
import { FormInput } from '@/components/form/form-input';

export const Form = () => {
	const { execute, fieldErrors } = useAction(createBoard, {
		onSuccess: (data) => {
			console.log(data, 'success');
		},
		onError: (err) => {
			console.error(err);
		}
	});

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string;

		execute({ title });
	}

	return (
		<form action={onSubmit}>
			<div className='flex flex-col space-y-2'>
				<FormInput
					errors={fieldErrors}
					id="title"
					label='Board Title'
				/>
			</div>
			<FormButton />
		</form>
	);
}
