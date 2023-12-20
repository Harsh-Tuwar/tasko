'use client';


import { useAction } from '@/hooks/useActions';
import { createBoard } from '@/actions/create-board';
import { 
	Popover,
	PopoverContent,
	PopoverTrigger
} from '@/components/ui/popover';

import { FormInput } from './form-input';
import { FormSubmit } from './form-submit';


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
			</PopoverContent>
		</Popover>
	)
}

export default FormPopover;
