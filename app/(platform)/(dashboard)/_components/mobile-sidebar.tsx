'use client';
import React from 'react';
import { usePathname } from 'next/navigation';

import { useMobileSidebar } from '@/hooks/use-mobile-sidebar';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import Sidebar from './sidebar';

const MobileSidebar = () => {
	const pathname = usePathname();
	const [isMounted, setIsMounted] = React.useState(false);
	const onOpen = useMobileSidebar((state) => state.onOpen);
	const onClose = useMobileSidebar((state) => state.onClose);
	const isOpen = useMobileSidebar((state) => state.isOpen);

	React.useEffect(() => {		
		setIsMounted(true);
	}, []);

	React.useEffect(() => {
		onClose();
	}, [pathname, onClose]);

	if (!isMounted) {
		return null;
	}

	return (
		<div className=''>
			<Button className='block md:hidden mr-2' variant={'ghost'} size={'sm'}>
				<Menu className='h-4 w-4' onClick={onOpen} />
			</Button>
			<Sheet open={isOpen} onOpenChange={onClose}>
				<SheetContent className='p-2 pt-10' side={'left'}>
					<Sidebar storageKey='t-sidebar-mobile-state' />
				</SheetContent>
			</Sheet>
		</div>
	)
}

export default MobileSidebar;
