import { deleteBoard } from '@/actions/delete-board';
import { Button } from '@/components/ui/button';
import React from 'react'
import { FormDelete } from './form-delete';

interface BoardProps {
	title: string;
	id: string;
}

const Board = ({
	title,
	id
}: BoardProps) => {
	const deleteBoardById = deleteBoard.bind(null, id);

	return (
		<form className='flex items-center gap-x-2' action={deleteBoardById}>
			<p>Board Title: {title}</p>
			<FormDelete />
		</form>
	);
}

export default Board;
