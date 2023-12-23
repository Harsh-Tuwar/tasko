'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { createSafeAction } from '@/lib/create-safe-action';

import { CopyCard } from './schema';
import { InputType, ReturnType } from './types';

import { createAuditLog } from '@/lib/create-audit-log';

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized'
		}
	};

	let card;
	const { id, boardId } = data;

	try {
		const cardToCopy = await db.card.findUnique({
			where: {
				id,
				list: {
					board: {
						orgId
					}
				}
			}
		});

		if (!cardToCopy) {
			return {
				error: 'Card not found!'
			}
		};

		const lastCard = await db.card.findFirst({
			where: {
				listId: cardToCopy.listId
			},
			orderBy: {
				order: 'desc'
			},
			select: {
				order: true
			}
		});

		const newOrder = lastCard ? lastCard.order + 1 : 1;

		card = await db.card.create({
			data: {
				title: `${cardToCopy.title} - Copy`,
				description: cardToCopy.description,
				order: newOrder,
				listId: cardToCopy.listId
			}
		});

		await createAuditLog({
			entityId: card.id,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.CARD,
			entityTitle: card.title
		});
	} catch (error) {
		return {
			error: 'Failed to copy.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
}

export const copyCard = createSafeAction(CopyCard, handler);