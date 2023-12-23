'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { UpdateList } from './schema';
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

	let list;
	const { title, id, boardId } = data;

	try {
		list = await db.list.update({
			where: {
				id,
				boardId: boardId,
				board: {
					orgId
				}
			},
			data: {
				title
			},
		});

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			action: ACTION.UPDATE,
			entityType: ENTITY_TYPE.LIST,
		});
	} catch (error) {
		return {
			error: 'Failed to update list.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: list };
}

export const updateList = createSafeAction(UpdateList, handler);