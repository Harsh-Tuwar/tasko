'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { CopyList } from './schema';
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
		const listToCopy = await db.list.findUnique({
			where: {
				id,
				boardId,
				board: {
					orgId
				}
			},
			include: {
				cards: true
			}
		});

		if (!listToCopy) {
			return {
				error: 'List not found!'
			}
		};

		const lastList = await db.list.findFirst({
			where: { boardId },
			orderBy: { order: 'desc' },
			select: { order: true }
		});

		const newOrder = lastList ? lastList.order + 1 : 1;

		list = await db.list.create({
			data: {
				boardId: listToCopy.boardId,
				title: `${listToCopy.title} - Copy`,
				order: newOrder,
				cards: {
					createMany: {
						data: listToCopy.cards.map((card) => ({
							title: card.title,
							description: card.description,
							order: card.order
						})),
					}
				},
			},
			include: {
				cards: true
			}
		});

		await createAuditLog({
			entityId: list.id,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.LIST,
			entityTitle: list.title
		});
	} catch (error) {
		return {
			error: 'Failed to copy.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: list };
}

export const copyList = createSafeAction(CopyList, handler);