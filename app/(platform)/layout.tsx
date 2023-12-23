import React from 'react';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';

import ModalProdiver from '@/components/providers/modal-provider';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<Toaster />
			<ModalProdiver />
			{children}
		</ClerkProvider>
	);
}

export default PlatformLayout;
