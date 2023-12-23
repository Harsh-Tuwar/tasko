'use client';

import CardModal from '@/components/modals/card-modal';
import { useEffect, useState } from 'react';

const ModalProdiver = () => {
	const [isMounted, setIsMounted] = useState(false);

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	};

	return (
		<>
			<CardModal />
		</>
	);
}

export default ModalProdiver;
