'use client';

import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { ListWithCards } from '@/types/types';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

import ListForm from './list-form';
import ListItem from './list-item';

import { useAction } from '@/hooks/useActions';
import { updateListOrder } from '@/actions/update-list-order';
import { updateCardOrder } from '@/actions/update-card-order';

interface ListContainerProps {
	data: ListWithCards[];
	boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
	const result = Array.from(list);
	const [removed] = result.splice(startIndex, 1);
	result.splice(endIndex, 0, removed);

	return result;
}

const ListContainer = ({ data, boardId }: ListContainerProps) => {
	const [orderedData, setOrderedData] = useState(data);

	const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
		onSuccess: (data) => {
			toast.success('List reordered!');
		},
		onError: (err) => {
			toast.error(err);
		}
	});

	const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
		onSuccess: (data) => {
			toast.success('Card reordered!');
		},
		onError: (err) => {
			toast.error(err);
		}
	})

	// optimistic updates
	useEffect(() => {
		setOrderedData(data);
	}, [data]);

	const onDragEnd = (result: any) => {
		const { destination, source, type } = result;

		if (!destination) {
			return;
		}

		// if dropped on the same place
		if (
			destination.droppableId === source.droppableId &&
			destination.index === source.index
		) {
			return;
		}

		// user moves a list
		if (type === 'list') {
			const items = reorder(
				orderedData,
				source.index,
				destination.index
			).map((item, index) => ({ ...item, order: index }));

			setOrderedData(items);
			executeUpdateListOrder({
				items: items,
				boardId: boardId
			});
		}

		if (type === 'card') {
			let newOrderedData = [...orderedData];

			const sourceList = newOrderedData.find((list) => list.id === source.droppableId);
			const destList = newOrderedData.find((list) => list.id === destination.droppableId);

			if (!sourceList || !destList) {
				return;
			}

			// check if card already exists on the source list
			if (!sourceList.cards) {
				sourceList.cards = [];
			}

			// check if card already exists on the dest list
			if (!destList.cards) {
				destList.cards = [];
			}

			// moving the card in the same list
			if (source.droppableId === destination.droppableId) {
				const reorderedCards = reorder(
					sourceList.cards,
					source.index,
					destination.index
				);

				reorderedCards.forEach((card, idx) => card.order = idx);

				sourceList.cards = reorderedCards;

				setOrderedData(newOrderedData);

				executeUpdateCardOrder({
					boardId,
					items: reorderedCards
				});
			} else {
				// moves to another list
				const [movedCard] = sourceList.cards.splice(source.index, 1);

				// assign the new listId to the moved card
				movedCard.listId = destination.droppableId;

				// add card to destination list
				destList.cards.splice(destination.index, 0, movedCard);

				sourceList.cards.forEach((card, indx) => card.order = indx);

				destList.cards.forEach((card, indx) => card.order = indx);
				
				setOrderedData(newOrderedData);
				executeUpdateCardOrder({
					boardId,
					items: destList.cards
				});
			}
		}
	};

	return (
		<DragDropContext onDragEnd={onDragEnd}>
			<Droppable droppableId='lists' type='list' direction='horizontal'>
				{(provided) => (
					<ol
						{...provided.droppableProps}
						ref={provided.innerRef}
						className='flex gap-x-3 h-full'
					>
						{orderedData.map((list, index) => {
							return (
								<ListItem
									key={list.id}
									index={index}
									data={list}
								/>
							)
						})}
						{provided.placeholder}
						<ListForm />
						<div className='flex-shrink-0 w-1' />
					</ol>
				)}
			</Droppable>
		</DragDropContext>
	)
}

export default ListContainer;
