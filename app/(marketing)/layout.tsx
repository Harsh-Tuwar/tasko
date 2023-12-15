import React from 'react'

const MarketingLayout = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className='bg-slate-100 h-full'>
			<main className='pt-40 bg-slate-100 pb-20'>
				{children}
			</main>
		</div>
	)
}

export default MarketingLayout