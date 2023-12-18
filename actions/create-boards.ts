'use server';

import { db } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CreateBoard = z.object({
	title: z.string(),
});

export const create = async (formData: FormData) => {
	const { title } = CreateBoard.parse({
		title: formData.get('title')
	});

	await db.board.create({
		data: {
			title
		}
	});

	// real time
	revalidatePath("/organization/org_2ZZgp32Us8B3LGrdmjfILu00InB");
};
