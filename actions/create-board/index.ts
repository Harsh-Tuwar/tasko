'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';
import { ACTION, ENTITY_TYPE } from '@prisma/client';

import { CreateBoard } from './schema';
import { InputType, ReturnType } from './types';

import { db } from '@/lib/db';

import { createSafeAction } from '@/lib/create-safe-action';
import { createAuditLog } from '@/lib/create-audit-log';
import { hasAvailableFreeBoard, incrementAvailableCount } from '@/lib/org-limit';

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized!!',
		}
	}
	
	const canCreate = await hasAvailableFreeBoard();

	if (!canCreate) {
		return {
			error: 'You have reached your limit of free boards. Please upgrade to create more.'
		}
	}

	const { title, image } = data;
	const [
		imageId,
		imageThumbUrl,
		imageFullUrl,
		imageLinkHtml,
		imageUserName,
	] = image.split('|');

	if (!imageId || !imageFullUrl || !imageThumbUrl || !imageLinkHtml || !imageUserName) {
		return {
			error: 'Missing fields. Failed to create board.'
		};
	}

	let board;

	try {
		board = await db.board.create({
			data: {
				title,
				imageFullUrl,
				imageId,
				imageLinkHTML: imageLinkHtml,
				imageThumbUrl,
				imageUserName,
				orgId,
			}
		});

		await incrementAvailableCount();

		await createAuditLog({
			entityId: board.id,
			action: ACTION.CREATE,
			entityType: ENTITY_TYPE.BOARD,
			entityTitle: board.title
		});
	} catch (err) {
		return {
			error: 'Internal Error!'
		}
	}

	revalidatePath(`/board/${board.id}`);

	return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
