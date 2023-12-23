'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateBoard } from './schema';
import { InputType, ReturnType } from './types';
import { createAuditLog } from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

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

		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			action: ACTION.UPDATE,
			entityType: ENTITY_TYPE.BOARD,
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