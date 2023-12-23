import { auth } from '@clerk/nextjs';
import { redirect } from 'next/navigation';

import { db } from '@/lib/db';

import ActivityItem from '@/components/activity-item';
import { Skeleton } from '@/components/ui/skeleton';

const ActivityList = async () => {
	const { orgId } = auth();

	if (!orgId) {
		redirect('/select-org');
	}

	const auditLogs = await db.auditLog.findMany({
		where: {
			orgId
		},
		orderBy: {
			createdAt: 'desc'
		}
	});

	return (
		<ol className='space-y-4 mt-4'>
			<p className='hidden last:block text-xs text-muted-foreground text-center'>
				No activity found inside this organization.	
			</p>
			{auditLogs.map((log) => (
				<ActivityItem key={log.id} data={log} />
			))}
		</ol>
	);
}

ActivityList.Skeleton = function ActivityListSkeleton() {
	return (
		<ol className='space-y-4 mt-4'>
			<Skeleton className='w-[80%] h-14' />
			<Skeleton className='w-[80%] h-14' />
			<Skeleton className='w-[50%] h-14' />
			<Skeleton className='w-[40%] h-14' />
			<Skeleton className='w-[58%] h-14' />
			<Skeleton className='w-[70%] h-14' />
		</ol>
	);
}

export default ActivityList;