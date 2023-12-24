'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteCard } from './schema';
import { InputType, ReturnType } from './types';
import { createAuditLog } from '@/lib/create-audit-log';
import { ACTION, ENTITY_TYPE } from '@prisma/client';
import { decreaseAvailableCount } from '@/lib/org-limit';

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
		card = await db.card.delete({
			where: {
				id,
				list: {
					board: {
						orgId
					}
				}
			}
		});

		await decreaseAvailableCount();
		
		await createAuditLog({
			entityId: card.id,
			entityTitle: card.title,
			action: ACTION.DELETE,
			entityType: ENTITY_TYPE.CARD,
		});
	} catch (error) {
		return {
			error: 'Failed to delete.'
		}
	}

	revalidatePath(`/board/${boardId}`);
	return { data: card };
}

export const deleteCard = createSafeAction(DeleteCard, handler);