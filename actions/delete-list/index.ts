'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteList } from './schema';
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

		await createAuditLog({
			entityId: list.id,
			entityTitle: list.title,
			action: ACTION.DELETE,
			entityType: ENTITY_TYPE.LIST,
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