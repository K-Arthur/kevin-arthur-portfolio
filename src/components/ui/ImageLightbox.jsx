"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn } from 'lucide-react';
import { CloudinaryImage } from '@/components/OptimizedImage';

// Simple global event-based lightbox (avoids context in server components)
const lightboxEvents = {
    listeners: [],
    emit(src, alt) {
        this.listeners.forEach(fn => fn(src, alt));
    },
    subscribe(fn) {
        this.listeners.push(fn);
        return () => {
            this.listeners = this.listeners.filter(l => l !== fn);
        };
    }
};

export const openLightbox = (src, alt) => lightboxEvents.emit(src, alt);

// Clickable Image component - client side
export function ClickableImage({ src, alt, width, height, className, sizes, quality, priority, ...rest }) {
    const [isHovered, setIsHovered] = useState(false);
    const isCloudinary = src && typeof src === 'string' && src.includes('res.cloudinary.com');

    const imageProps = {
        src,
        alt: alt || '',
        width: width || 850,
        height: height || 550,
        sizes: sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 85vw, 850px",
        style: { width: '100%', height: 'auto' },
        priority,
        className: `rounded-lg shadow-lg mx-auto transition-transform duration-300 group-hover:scale-[1.01] ${className || ''}`,
        ...rest
    };

    return (
        <span
            className="block my-8 relative cursor-zoom-in group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => openLightbox(src, alt)}
        >
            {isCloudinary ? (
                <CloudinaryImage {...imageProps} preset="gallery" />
            ) : (
                <Image {...imageProps} quality={quality || 90} />
            )}
            {/* Zoom indicator */}
            <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white/80 pointer-events-none inline-block"
            >
                <ZoomIn className="w-5 h-5" />
            </motion.span>
        </span>
    );
}

// The global lightbox modal that listens for events
export function GlobalLightboxModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [image, setImage] = useState({ src: '', alt: '' });
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const unsubscribe = lightboxEvents.subscribe((src, alt) => {
            setImage({ src, alt });
            setScale(1);
            setIsOpen(true);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && isOpen) setIsOpen(false);
        };
        if (isOpen) {
            window.addEventListener('keydown', handleKey);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleKey);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => setIsOpen(false);
    const toggleZoom = () => setScale(prev => prev === 1 ? 1.5 : 1);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
                    onClick={handleClose}
                >
                    {/* Close */}
                    <button
                        onClick={handleClose}
                        className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        aria-label="Close"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative flex items-center justify-center p-4"
                        style={{ width: '90vw', height: '85vh', maxWidth: '1400px' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.div
                            animate={{ scale }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="relative w-full h-full"
                            style={{ cursor: scale > 1 ? 'zoom-out' : 'zoom-in' }}
                            onClick={(e) => { e.stopPropagation(); toggleZoom(); }}
                        >
                            <Image
                                src={image.src}
                                alt={image.alt}
                                fill
                                className="object-contain"
                                sizes="90vw"
                                priority
                                quality={95}
                            />
                        </motion.div>
                    </motion.div>

                    {/* Caption */}
                    {image.alt && (
                        <p className="absolute bottom-4 left-0 right-0 text-center text-white/80 font-medium">
                            {image.alt}
                        </p>
                    )}

                    {/* Hint */}
                    <div className="absolute bottom-4 right-4 text-white/40 text-xs hidden md:block">
                        ESC to close • Click to zoom
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
