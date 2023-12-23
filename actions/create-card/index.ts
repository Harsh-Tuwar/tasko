'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { CreateCard } from './schema';
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

	let card;
	const { title, boardId, listId } = data;

	try {
		const list = await db.list.findUnique({
			where: {
				id: listId,
				board: {
					orgId
				}
			}
		});

		if (!list) {
			return {
				error: 'List not found.'
			};
		}

		const lstCard = await db.card.findFirst({
			where: { listId },
			orderBy: { order: 'desc' },
			select: { order: true }
		});

		const newOrder = lstCard ? lstCard.order + 1 : 1;

		card = await db.card.create({
			data: {
				title,
				listId,
				order: newOrder,
			}
		});

		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			entityType: ENTITY_TYPE.CARD,
			action: ACTION.CREATE
		});
	} catch (error) {
		return {
			error: 'Failed to create list.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
}

export const createCard = createSafeAction(CreateCard, handler);
