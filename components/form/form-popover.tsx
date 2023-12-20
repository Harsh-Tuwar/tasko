'use client';


import { useAction } from '@/hooks/useActions';
import { Button } from '@/components/ui/button';
import { createBoard } from '@/actions/create-board';
import { 
	Popover,
	PopoverClose,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';

import { FormInput } from './form-input';
import { FormSubmit } from './form-submit';

import { toast } from 'sonner';
import { X } from 'lucide-react';


interface FormPopoverProps {
	children: React.ReactNode;
	side?: 'left' | 'right' | 'top' | 'bottom';
	align?: 'start' | 'end' | 'center';
	sideOffset?: number;
};

const FormPopover = ({
	children,
	align,
	side = 'bottom',
	sideOffset = 0
}: FormPopoverProps) => {
	const { execute, fieldErrors } = useAction(createBoard, {
		onSuccess: (data) => {
			console.log({ data });
			toast.success('Board created');
		},
		onError: (err) => {
			console.error({ err });
			toast.error(err);
		}
	});

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string;

		execute({ title });
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				{children}
			</PopoverTrigger>
			<PopoverContent
				className='w-80 pt-3'
				side={side}
				align={align}
				sideOffset={sideOffset}
			>
				<div className='text-sm font-medium text-center text-neutral-600 pb-4'>
					Create board
				</div>
				<PopoverClose asChild>
					<Button
						className='h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600'
						variant={'ghost'}
					>
						<X  className='h-4 w-4 '/>
					</Button>
				</PopoverClose>
				<form className='space-y-4' action={onSubmit}>
					<div className='space-y-4'>
						<FormInput
							id='title'
							label='Board title'
							type='text'
							errors={fieldErrors}
						/> 
					</div>
					<FormSubmit className='w-full'>Create</FormSubmit>
				</form>
			</PopoverContent>
		</Popover>
	)
}

export default FormPopover;
