'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteList } from './schema';
import { InputType, ReturnType } from './types';

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized'
		}
	};

	let list;
	const { id, boardId } = data;

	try {
		list = await db.list.delete({
			where: {
				id,
				boardId,
				board: {
					orgId
				}
			}
		});
	} catch (error) {
		console.log(error);
		return {
			error: 'Failed to delete.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: list };
}

export const deleteList = createSafeAction(DeleteList, handler);