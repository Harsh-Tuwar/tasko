'use server';

import { revalidatePath } from 'next/cache';

import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs';
import { createSafeAction } from '@/lib/create-safe-action';

import { DeleteBoard } from './schema';
import { InputType, ReturnType } from './types';
import { redirect } from 'next/navigation';
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
	const { id } = data;

	try {
		board = await db.board.delete({
			where: {
				id,
				orgId
			}
		});

		await createAuditLog({
			entityId: board.id,
			entityTitle: board.title,
			action: ACTION.DELETE,
			entityType: ENTITY_TYPE.BOARD,
		});
	} catch (error) {
		return {
			error: 'Failed to delete.'
		}
	}

	revalidatePath(`/organization/${orgId}`);
	redirect(`/organization/${orgId}`);
}

export const deleteBoard = createSafeAction(DeleteBoard, handler);