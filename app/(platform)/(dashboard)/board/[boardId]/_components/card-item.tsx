'use client';

import { Card } from '@prisma/client';

import { Draggable } from '@hello-pangea/dnd';

import { useCardModal } from '@/hooks/use-card-modal';

interface CardItemProps {
	index: number;
	card: Card;
};

const CardItem = ({
	card,
	index
}: CardItemProps) => {
	const cardModal = useCardModal();
	
	return (
		<Draggable draggableId={card.id} index={index}>
			{(provided) => (
				<div
					{...provided.dragHandleProps}
					{...provided.draggableProps}
					ref={provided.innerRef}
					role='button'
					onClick={() => cardModal.onOpen(card.id)}
					className='truncate border-2 border-transparent hover:border-black py-2 px-3 text-sm bg-white rounded-md shadow-sm'
				>
					{card.title}
				</div>
			)}
		</Draggable>
	)
}

export default CardItem;
