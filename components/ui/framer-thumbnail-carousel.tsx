'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  animate,
} from 'framer-motion';

interface CarouselItem {
  id: number | string;
  url: string;
  title?: string;
}

interface FramerThumbnailCarouselProps {
  items: CarouselItem[];
}

const FULL_WIDTH_PX = 120;
const COLLAPSED_WIDTH_PX = 35;
const GAP_PX = 4;
const MARGIN_PX = 4;

export function FramerThumbnailCarousel({ items }: FramerThumbnailCarouselProps) {
  const [index, setIndex] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const x = useMotionValue(0);

  useEffect(() => {
    if (!isDragging && containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth || 1;
      const targetX = -index * containerWidth;

      animate(x, targetX, {
        type: 'spring',
        stiffness: 300,
        damping: 30,
      });
    }
  }, [index, x, isDragging]);

  return (
    <div className='w-full max-w-5xl mx-auto'>
      <div className='flex flex-col gap-6'>
        {/* Main Carousel */}
        <div className='relative overflow-hidden rounded-3xl shadow-2xl' ref={containerRef} style={{ background: '#000' }}>
          <motion.div
            className='flex'
            drag='x'
            dragElastic={0.2}
            dragMomentum={false}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={(e, info) => {
              setIsDragging(false);
              const containerWidth = containerRef.current?.offsetWidth || 1;
              const offset = info.offset.x;
              const velocity = info.velocity.x;

              let newIndex = index;

              if (Math.abs(velocity) > 500) {
                newIndex = velocity > 0 ? index - 1 : index + 1;
              }
              else if (Math.abs(offset) > containerWidth * 0.3) {
                newIndex = offset > 0 ? index - 1 : index + 1;
              }

              newIndex = Math.max(0, Math.min(items.length - 1, newIndex));
              setIndex(newIndex);
            }}
            style={{ x }}
          >
            {items.map((item, i) => (
              <div key={item.id} className='shrink-0 w-full h-[350px] md:h-[450px] lg:h-[500px] relative overflow-hidden'>
                {/* Blurred Background */}
                <img
                  src={item.url}
                  alt=""
                  className='absolute inset-0 w-full h-full object-cover blur-2xl opacity-40 scale-110 pointer-events-none'
                />
                
                <img
                  src={item.url}
                  alt={item.title || `Gallery image ${i}`}
                  className='relative w-full h-full object-contain select-none pointer-events-none z-10'
                  draggable={false}
                />
              </div>
            ))}
          </motion.div>

          {/* Navigation Buttons */}
          <motion.button
            disabled={index === 0}
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className={`absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all z-10
              ${
                index === 0
                  ? 'opacity-0 scale-50 pointer-events-none'
                  : 'bg-white/90 backdrop-blur-md text-black hover:scale-110 opacity-70 hover:opacity-100'
              }`}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
            </svg>
          </motion.button>

          <motion.button
            disabled={index === items.length - 1}
            onClick={() => setIndex((i) => Math.min(items.length - 1, i + 1))}
            className={`absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-2xl transition-all z-10
              ${
                index === items.length - 1
                  ? 'opacity-0 scale-50 pointer-events-none'
                  : 'bg-white/90 backdrop-blur-md text-black hover:scale-110 opacity-70 hover:opacity-100'
              }`}
          >
            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
            </svg>
          </motion.button>

          {/* Title Overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '60px 40px 30px', background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)', pointerEvents: 'none', zIndex: 20 }}>
             <motion.h4 
               key={index}
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               style={{ fontFamily: 'var(--font-playfair)', color: '#fff', fontSize: '1.5rem', fontWeight: 700 }}
             >
               {items[index].title}
             </motion.h4>
          </div>
        </div>

        <Thumbnails index={index} setIndex={setIndex} items={items} />
      </div>
    </div>
  );
}

function Thumbnails({
  index,
  setIndex,
  items,
}: {
  index: number;
  setIndex: (index: number) => void;
  items: CarouselItem[];
}) {
  const thumbnailsRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (thumbnailsRef.current) {
      let scrollPosition = 0;
      for (let i = 0; i < index; i++) {
        scrollPosition += COLLAPSED_WIDTH_PX + GAP_PX;
      }

      scrollPosition += MARGIN_PX;

      const containerWidth = thumbnailsRef.current.offsetWidth;
      const centerOffset = containerWidth / 2 - FULL_WIDTH_PX / 2;
      scrollPosition -= centerOffset;

      thumbnailsRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth',
      });
    }
  }, [index]);

  return (
    <div
      ref={thumbnailsRef}
      className='overflow-x-auto scrollbar-hide px-4 pb-4'
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      <div className='flex gap-2 h-24' style={{ width: 'fit-content', margin: '0 auto' }}>
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            onClick={() => setIndex(i)}
            initial={false}
            animate={i === index ? 'active' : 'inactive'}
            variants={{
              active: {
                width: FULL_WIDTH_PX,
                scale: 1.1,
                opacity: 1,
                borderRadius: '16px',
              },
              inactive: {
                width: COLLAPSED_WIDTH_PX,
                scale: 1,
                opacity: 0.5,
                borderRadius: '12px',
              },
            }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className='relative shrink-0 h-full overflow-hidden shadow-lg'
          >
            <img
              src={item.url}
              alt={item.title || `Thumbnail ${i}`}
              className='w-full h-full object-cover pointer-events-none select-none'
            />
            {i === index && (
              <motion.div 
                layoutId="active-thumb"
                className="absolute inset-0 border-2 border-[#FF6B4A]"
                style={{ borderRadius: 'inherit' }}
              />
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
