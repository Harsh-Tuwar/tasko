'use client';
import React from 'react';
import Image from 'next/image';
import { Activity, CreditCard, Layout, Settings } from 'lucide-react';

import { cn } from '@/lib/utils';

import { AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export type Organization = {
	id: string;
	imageUrl: string;
	slug: string;
	name: string;
};

interface NavItemProps {
	isActive: boolean;
	isExpanded: boolean;
	organization: Organization;
	onExpand: (id: string) => void;
};

const NavItem = ({
	isActive,
	isExpanded,
	onExpand,
	organization
}: NavItemProps) => {
	const router = useRouter();
	const pathname = usePathname();

	const routes = [
		{ label: 'Boards', icon: <Layout className='h-4 w-4 mr-2' />, href: `/organization/${organization.id}` },
		{ label: 'Activity', icon: <Activity className='h-4 w-4 mr-2' />, href: `/organization/${organization.id}/activity` },
		{ label: 'Settings', icon: <Settings className='h-4 w-4 mr-2' />, href: `/organization/${organization.id}/settings` },
		{ label: 'Billings', icon: <CreditCard className='h-4 w-4 mr-2' />, href: `/organization/billing` },
	];

	const onClick = (href: string) => {
		router.push(href);
	};

	return (
		<AccordionItem value={organization.id} className='border-none'>
			<AccordionTrigger
				onClick={() => onExpand(organization.id)}
				className={cn(
					'flex items-center gap-x-2 p-1.5 text-neutral-700 rounded-md hover:bg-neutral-500/10 transition text-start no-underline hover:no-underline',
					isActive && !isExpanded && 'bg-sky-500/10 text-sky-700'
				)}
			>
				<div className="flex items-center gap-x-2">
					<div className='w-7 h-7 relative'>
						<Image fill src={organization.imageUrl} alt='organization' className='rounded-sm object-cover' />
					</div>
					<span className='font-medium text-sm'>{organization.name}</span>
				</div>
			</AccordionTrigger>
			<AccordionContent className='pt-1 text-neutral-700'>
				{routes.map((rObj) => {
					return <Button
						key={rObj.href}
						size={'sm'}
						onClick={() => onClick(rObj.href)}
						variant={'ghost'}
						className={cn(
							'w-full font-normal justify-start pl-10 mb-1',
							pathname === rObj.href && 'bg-sky-500/10 text-sky-700'
						)}
					>
						{rObj.icon}
						{rObj.label}
					</Button>
				})}
			</AccordionContent>
		</AccordionItem>
	)
}

NavItem.Skeleton = function SkeletonNavItem() {
	return (
		<div className='flex items-center gap-x-2'>
			<div className='w-10 h-10 relative shrink-0'>
				<Skeleton className='h-full w-full absolute' />
			</div>
			<Skeleton className='h-10 w-full' />
		</div>
	)
}

export default NavItem;
