'use client';

import { useEffect, useState } from 'react';

import { unsplash } from '@/lib/unsplash';
import { Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { defaultImages } from '@/constants/images';
import Link from 'next/link';

interface FormPickerProps {
	id: string;
	errors?: Record<string, string[] | undefined>;
}

const FormPicker = ({
	id,
	errors
}: FormPickerProps) => {
	const { pending } = useFormStatus();
	const [isLoading, setIsLoading] = useState(true);
	const [selectedImgId, setSelectedImgId] = useState(null);
	const [images, setImages] = useState<Array<Record<string, any>>>(defaultImages);

	useEffect(() => {
		const fetchImages = async () => {
			try {
				const result = await unsplash.photos.getRandom({
					collectionIds: ['317099'],
					count: 9
				});

				if (result && result.response) {
					const returnedImages = result.response as Array<Record<string, any>>;

					setImages(returnedImages);
				} else {
					console.error('Failed to get images from Unsplash.');
				}
			} catch (error) {
				console.log(error);
				setImages(defaultImages);
			} finally {
				setIsLoading(false);
			}
		};

		fetchImages();
	}, [])

	if (isLoading) {
		return (
			<div className='p-6 flex justify-center items-center'>
				<Loader2 className='h-6 w-6 text-sky-700 animate-spin' />
			</div>
		)
	}

	return (
		<div className='relative'>
			<div className='grid grid-cols-3 gap-2 mb-2'>
				{images.map((img) => {
					return (
						<div
							key={img.id}
							className={cn(
								'cursor-pointer aspect-video relative group hover:opacity-75 transition bg-muted',
								pending && 'opacity-50 hover:opacity-50 cursor-auto'
							)}
							onClick={() => {
								if (pending) {
									return;
								}

								setSelectedImgId(img.id);
							}}
						>
							<Image
								src={img.urls.thumb}
								fill
								alt='Unsplash image'
								className='object-cover rounded-sm'
							/>
							<Link
								href={img.links.html}
								target='_blank'
								className='opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/50'
							>{img.user.name}</Link>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default FormPicker;
