'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { CreateList } from './schema';
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
	const { title, boardId } = data;

	try {
		const board = await db.board.findUnique({
			where: {
				id: boardId,
				orgId
			}
		});

		if (!board) {
			return {
				error: 'Board not found',
			};
		}

		const lastList = await db.list.findFirst({
			where: {
				boardId: boardId
			},
			orderBy: { order: 'desc' },
			select: { order: true }
		});

		const newOrder = lastList ? lastList.order + 1 : 1;

		list = await db.list.create({
			data: {
				title,
				boardId,
				order: newOrder
			},
		});

		await createAuditLog({
			entityId: list.id,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.LIST,
			entityTitle: list.title
		});
	} catch (error) {
		return {
			error: 'Failed to create list.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: list };
}

export const createList = createSafeAction(CreateList, handler);
