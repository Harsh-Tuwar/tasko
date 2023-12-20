'use server';

import { auth } from '@clerk/nextjs';
import { revalidatePath } from 'next/cache';

import { CreateBoard } from './schema';
import { InputType, ReturnType } from './types';

import { db } from '@/lib/db';
import { createSafeAction } from '@/lib/create-safe-action';

const handler = async (data: InputType): Promise<ReturnType> => {
	const { userId, orgId } = auth();

	if (!userId || !orgId) {
		return {
			error: 'Unauthorized!!',
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
	} catch (err) {
		return {
			error: 'Internal Error!'
		}
	}

	revalidatePath(`/board/${board.id}`);

	return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
