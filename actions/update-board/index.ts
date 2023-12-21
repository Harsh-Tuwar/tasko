'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateBoard } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized'
		}
	};

	let board;
	const { title, id } = data;

	try {
		board = await db.board.update({
			where: {
				id,
				orgId
			},
			data: {
				title
			},
		});
	} catch (error) {
		return {
			error: 'Failed to update.'
		}
	}

	revalidatePath(`/board/${id}`);
	return { data: board };
}

export const updateBoard = createSafeAction(UpdateBoard, handler);