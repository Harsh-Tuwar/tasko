import React from 'react';
import { Toaster } from 'sonner';
import { ClerkProvider } from '@clerk/nextjs';

import ModalProdiver from '@/components/providers/modal-provider';
import QueryProvider from '@/components/providers/query-provider';

const PlatformLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<ClerkProvider>
			<QueryProvider>
				<Toaster />
				<ModalProdiver />
				{children}
			</QueryProvider>
		</ClerkProvider>
	);
}

export default PlatformLayout;
