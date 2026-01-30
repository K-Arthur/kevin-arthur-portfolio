"use client";
import React, { useState, useCallback, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

// Internal lightbox for the gallery (doesn't rely on global context)
const GalleryLightbox = ({ images, currentIndex, setCurrentIndex, onClose }) => {
    const [scale, setScale] = useState(1);

    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') onClose();
        if (e.key === 'ArrowLeft') {
            setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
            setScale(1);
        }
        if (e.key === 'ArrowRight') {
            setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
            setScale(1);
        }
    }, [images.length, onClose, setCurrentIndex]);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [handleKeyDown]);

    const currentImage = images[currentIndex];
    const toggleZoom = () => setScale(prev => prev === 1 ? 1.5 : 1);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9999] bg-black/95 backdrop-blur-md flex items-center justify-center"
            onClick={onClose}
        >
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                aria-label="Close"
            >
                <X className="w-6 h-6" />
            </button>

            {/* Navigation Arrows */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev > 0 ? prev - 1 : images.length - 1)); setScale(1); }}
                        className="absolute left-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        aria-label="Previous"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); setCurrentIndex(prev => (prev < images.length - 1 ? prev + 1 : 0)); setScale(1); }}
                        className="absolute right-4 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white"
                        aria-label="Next"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>
                </>
            )}

            {/* Image Container */}
            <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative flex items-center justify-center p-4"
                style={{ width: '90vw', height: '80vh', maxWidth: '1400px' }}
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
                        src={currentImage.src}
                        alt={currentImage.alt}
                        fill
                        className="object-contain"
                        sizes="90vw"
                        priority
                        quality={95}
                    />
                </motion.div>
            </motion.div>

            {/* Caption & Counter */}
            <div className="absolute bottom-16 left-0 right-0 text-center pointer-events-none">
                <p className="text-white font-medium text-lg mb-1">{currentImage.alt}</p>
                <p className="text-white/60 text-sm">{currentIndex + 1} / {images.length}</p>
            </div>

            {/* Thumbnail Strip */}
            {images.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 p-2 rounded-lg bg-black/50 backdrop-blur-sm max-w-[90vw] overflow-x-auto">
                    {images.map((img, i) => (
                        <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrentIndex(i); setScale(1); }}
                            className={`relative flex-shrink-0 border-2 rounded overflow-hidden transition-all ${currentIndex === i ? 'border-[#00C9B7] opacity-100' : 'border-transparent opacity-50 hover:opacity-75'
                                }`}
                            style={{ width: '64px', height: '40px' }}
                        >
                            <Image src={img.src} alt="" fill className="object-cover" sizes="64px" />
                        </button>
                    ))}
                </div>
            )}

            {/* Keyboard hint */}
            <div className="absolute bottom-4 right-4 text-white/40 text-xs hidden md:block">
                ESC to close • ← → to navigate • Click to zoom
            </div>
        </motion.div>
    );
};

// Gallery Image Card - Fills the frame
const GalleryImage = ({ src, alt, onClick }) => {
    return (
        <div
            className="relative w-full rounded-lg overflow-hidden group cursor-pointer bg-muted/20 dark:bg-black/40"
            onClick={onClick}
            style={{ aspectRatio: '16/9' }}
        >
            {/* Image fills container completely with object-cover */}
            <Image
                src={src}
                alt={alt}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                style={{ objectPosition: 'center center' }}
                sizes="(max-width: 768px) 90vw, (max-width: 1024px) 45vw, 30vw"
            />

            {/* Subtle hover overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {/* Subtle scanlines */}
                <div
                    className="absolute inset-0 mix-blend-overlay"
                    style={{
                        backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.03) 0px, rgba(0,0,0,0.03) 1px, transparent 1px, transparent 3px)',
                        backgroundSize: '100% 3px',
                    }}
                />
            </div>

            {/* Neon Border Glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-primary/50 group-hover:shadow-[0_0_12px_rgba(var(--primary),0.2)] transition-all duration-300 rounded-lg pointer-events-none" />

            {/* Fullscreen Icon */}
            <div className="absolute top-2 right-2 p-2 rounded-full bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn className="w-4 h-4" />
            </div>
        </div>
    );
};

export default function GlitchGallery({ images }) {
    const [lightboxIndex, setLightboxIndex] = useState(null);

    const defaultImages = [
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725657/Main_Menu_-_Press_Start_llbfhm.png", alt: "Main Menu - Press Start" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725660/Main_Menu_-_New_Game_mpplzh.png", alt: "Main Menu - New Game" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725668/Mission_Select_vcdg2w.png", alt: "Mission Select Screen" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725647/Main_Menu_-_Load_Game_pjadsr.png", alt: "Load Game Screen" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725666/Main_Menu_-_Settings_p1gtc6.png", alt: "Settings Menu" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725665/Option_Screen_cysvfk.png", alt: "Options Screen" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725664/Select_Save_umh4bq.png", alt: "Save Selection" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725643/Main_Menu_-_Gallery_nf3ynk.png", alt: "Gallery Main Menu" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725643/Gallery_Menu_sshzbr.png", alt: "Gallery Selection" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725634/Gallery_View_xqu25c.png", alt: "Gallery View" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725642/Difficulty_Select_nosixm.png", alt: "Difficulty Select" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725657/Map_Loading_Screen_dpobg4.png", alt: "Map Loading" },
        { src: "https://res.cloudinary.com/dov1tv077/image/upload/v1769725624/Loading_Screen_llxrsj.png", alt: "Loading Screen" },
    ];

    const galleryImages = images || defaultImages;

    return (
        <>
            <div className="w-full max-w-5xl mx-auto my-12">
                {/* Header */}
                <div className="flex items-center justify-between mb-6 px-2">
                    <div>
                        <span className="text-xs font-mono text-primary tracking-widest uppercase">// Screen Gallery</span>
                        <h3 className="text-xl font-bold text-foreground mt-1">Figma Design Screens</h3>
                        <p className="text-xs text-muted-foreground mt-1">Click any image to view fullscreen</p>
                    </div>
                </div>

                {/* Responsive Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {galleryImages.map((img, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            viewport={{ once: true }}
                            className="flex flex-col"
                        >
                            <GalleryImage
                                src={img.src}
                                alt={img.alt}
                                onClick={() => setLightboxIndex(i)}
                            />
                            <p className="text-sm text-muted-foreground mt-3 text-center font-medium">{img.alt}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Fullscreen Lightbox */}
            <AnimatePresence>
                {lightboxIndex !== null && (
                    <GalleryLightbox
                        images={galleryImages}
                        currentIndex={lightboxIndex}
                        setCurrentIndex={setLightboxIndex}
                        onClose={() => setLightboxIndex(null)}
                    />
                )}
            </AnimatePresence>
        </>
    );
}
