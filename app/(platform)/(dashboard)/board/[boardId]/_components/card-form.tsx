'use client';

import { Plus, X } from 'lucide-react';
import { useParams } from 'next/navigation';
import { forwardRef, useRef, ElementRef, KeyboardEventHandler } from 'react';

import { Button } from '@/components/ui/button';
import FormTextArea from '@/components/form/form-textarea';
import { FormSubmit } from '@/components/form/form-submit';

import { useAction } from '@/hooks/useActions';
import { createCard } from '@/actions/create-card';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import { toast } from 'sonner';

interface CardFormProps {
	listId: string;
	enableEditing: () => void;
	disableEditing: () => void;
	isEditing: boolean;
};

const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(({
	disableEditing,
	enableEditing,
	isEditing,
	listId
}, ref) => {
	const params = useParams();
	const formRef = useRef<ElementRef<'form'>>(null);

	const { execute, fieldErrors } = useAction(createCard, {
		onSuccess: (data) => {
			toast.success(`Card "${data.title}" created!`);
		},
		onError: (err) => {
			toast.error(err);
		}
	});

	const onKeyDown = (e: KeyboardEvent) => {
		if (e.key === 'Escape') {
			disableEditing();
		}
	};

	useEventListener('keydown', onKeyDown);
	useOnClickOutside(formRef, disableEditing);

	const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			formRef.current?.requestSubmit();
		}
	};

	const onSubmit = (formData: FormData) => {
		const title = formData.get('title') as string;
		const listId = formData.get('listId') as string;
		const boardId = params.boardId as string;

		console.log({
			title,
			boardId,
			listId
		});

		execute({
			title,
			boardId,
			listId
		});
	};

	if (isEditing) {
		return (
			<form className='m-1 py-0.5 px-1 space-y-4' action={onSubmit}>
				<FormTextArea
					id='title'
					onKeyDown={onTextareaKeyDown}
					ref={ref}
					errors={fieldErrors}
					placeholder='Enter a title for this card... '
				/>
				<input hidden name='listId' id='listId' value={listId}></input>
				<div className="flex items-center gap-x-1">
					<FormSubmit>
						Add card
					</FormSubmit>
					<Button
						onClick={disableEditing}
						size='sm'
						variant={'ghost'}
					>
						<X className='h-5 w-5' />
					</Button>
				</div>
			</form>
		);
	}

	return (
		<div className='pt-2 px-2'>
			<Button
				onClick={enableEditing}
				className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
				size={'sm'}
				variant={'ghost'}
			>
				<Plus className='h-4 w-4 mr-2' />
				Add a card
			</Button>
		</div>
	)
});

CardForm.displayName = 'Card Form';

export default CardForm;
