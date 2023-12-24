'use client';

import { useEffect, useState } from 'react';

import ProModal from '@/components/modals/pro-modal';
import CardModal from '@/components/modals/card-modal';

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
			<ProModal />
		</>
	);
}

export default ModalProdiver;
