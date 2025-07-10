'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Play, FileText, ExternalLink, Video, Smartphone, Monitor } from 'lucide-react';
import MediaLightbox from './MediaLightbox';
import VideoPlayer from './VideoPlayer';
import { getOptimalGridLayout, getARIALabels, MEDIA_TYPES } from '@/lib/mediaUtils';
import styles from './MediaGrid.module.css';

const MediaGrid = ({ 
  media = [], 
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  aspectRatio = '16/9',
  spacing = 'md',
  enableLazyLoading = true,
  showMetadata = true,
  className = '',
  adaptiveLayout = true
}) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [loadedItems, setLoadedItems] = useState(new Set());
  const observerRef = useRef(null);
  const itemRefs = useRef(new Map());

  // Get optimal layout if adaptive layout is enabled
  const optimalLayout = adaptiveLayout ? getOptimalGridLayout(media) : null;
  const gridConfig = optimalLayout || { columns, aspectRatio, spacing, layout: 'default' };

  // Intersection Observer for lazy loading
  const observeItem = useCallback((node, index) => {
    if (!enableLazyLoading) return;
    
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index);
            setLoadedItems(prev => new Set([...prev, index]));
            observerRef.current.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.1,
        rootMargin: '100px'
      });
    }
    
    if (node) {
      itemRefs.current.set(index, node);
      observerRef.current.observe(node);
    }
  }, [enableLazyLoading]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Initialize loading state
  useEffect(() => {
    if (!enableLazyLoading) {
      setLoadedItems(new Set(media.map((_, index) => index)));
    } else {
      // Load first 6 items immediately
      setLoadedItems(new Set([0, 1, 2, 3, 4, 5]));
    }
  }, [media, enableLazyLoading]);

  const openLightbox = (index) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextMedia = () => {
    setLightboxIndex((prev) => (prev + 1) % media.length);
  };

  const prevMedia = () => {
    setLightboxIndex((prev) => (prev - 1 + media.length) % media.length);
  };

  const getMediaIcon = (item) => {
    switch (item.type) {
      case MEDIA_TYPES.PDF:
        return <FileText size={24} className={styles.mediaIcon} />;
      case MEDIA_TYPES.MOBILE_MOCKUP:
        return <Smartphone size={24} className={styles.mediaIcon} />;
      case MEDIA_TYPES.DESKTOP_MOCKUP:
        return <Monitor size={24} className={styles.mediaIcon} />;
      default:
        return null;
    }
  };

  const getMediaTypeLabel = (type) => {
    switch (type) {
      case MEDIA_TYPES.VIDEO:
        return 'VIDEO';
      case MEDIA_TYPES.PDF:
        return 'PDF';
      case MEDIA_TYPES.MOBILE_MOCKUP:
        return 'MOBILE';
      case MEDIA_TYPES.DESKTOP_MOCKUP:
        return 'DESKTOP';
      case MEDIA_TYPES.GRAPHIC:
        return 'GRAPHIC';
      default:
        return 'IMAGE';
    }
  };

  const getThumbnailSrc = (item) => {
    // For images, use the src directly
    if (item.type === MEDIA_TYPES.IMAGE || 
        item.type === MEDIA_TYPES.GRAPHIC || 
        item.type === MEDIA_TYPES.MOBILE_MOCKUP || 
        item.type === MEDIA_TYPES.DESKTOP_MOCKUP) {
      return item.src;
    }
    
    // For videos and PDFs, use thumbnail if available
    if (item.thumbnail) {
      return item.thumbnail;
    }
    
    // Fallback placeholders
    if (item.type === MEDIA_TYPES.VIDEO) {
      return '/images/video-placeholder.svg';
    }
    
    return '/images/placeholder.png';
  };

  const getItemClassName = (item) => {
    const baseClass = `${styles.mediaItem}`;
    
    // Add media type class
    if (item.type) {
      const typeClass = `type${item.type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`;
      return `${baseClass} ${styles[typeClass]}`;
    }
    
    return baseClass;
  };

  const renderThumbnailContent = (item, isLoaded, index) => {
    const ariaLabels = getARIALabels(item.type, index, media.length, item.title);
    
    if (!isLoaded) {
      return (
        <div className={styles.placeholder} aria-label="Loading media item">
          <div className={styles.placeholderContent} />
        </div>
      );
    }

    // Video player for videos
    if (item.type === MEDIA_TYPES.VIDEO) {
      return (
        <VideoPlayer 
          src={item.src}
          poster={getThumbnailSrc(item)}
          className={styles.videoPlayerInGrid}
          aria-label={ariaLabels.label}
        />
      );
    }

    // PDF preview
    if (item.type === MEDIA_TYPES.PDF && !item.thumbnail) {
      return (
        <div className={styles.pdfPreview} role={ariaLabels.role} aria-label={ariaLabels.label}>
          <FileText size={48} className={styles.pdfIcon} />
          <p className={styles.pdfLabel}>PDF Document</p>
        </div>
      );
    }

    // Video placeholder
    if (item.type === MEDIA_TYPES.VIDEO && !item.thumbnail) {
      return (
        <div className={styles.videoPreview} role={ariaLabels.role} aria-label={ariaLabels.label}>
          <Video size={48} className={styles.videoIcon} />
          <p className={styles.videoLabel}>Video File</p>
          <p className={styles.videoName}>{item.title || 'Video'}</p>
        </div>
      );
    }

    // Image with blur placeholder
    const imageProps = {
      src: getThumbnailSrc(item),
      alt: ariaLabels.label,
      fill: true,
      className: styles.image,
      'aria-describedby': ariaLabels.description
    };

    // Add responsive sizes based on grid layout
    if (gridConfig.layout === 'mobile-focus') {
      imageProps.sizes = '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw';
    } else if (gridConfig.layout === 'desktop-focus') {
      imageProps.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    } else {
      imageProps.sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw';
    }

    // Add blur placeholder if available
    if (item.blurPlaceholder) {
      imageProps.placeholder = 'blur';
      imageProps.blurDataURL = item.blurPlaceholder;
    }

    // Set object-fit based on media type
    if (item.type === MEDIA_TYPES.MOBILE_MOCKUP) {
      imageProps.style = { objectFit: 'contain' };
    } else if (item.type === MEDIA_TYPES.DESKTOP_MOCKUP) {
      imageProps.style = { objectFit: 'cover', objectPosition: 'top' };
    } else {
      imageProps.style = { objectFit: 'cover' };
    }

    return (
      <Image
        {...imageProps}
        onError={(e) => {
          // Fallback for broken images
          if (item.type === MEDIA_TYPES.VIDEO) {
            e.target.src = '/images/video-placeholder.svg';
          } else {
            e.target.src = '/images/placeholder.png';
          }
        }}
      />
    );
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!media || media.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>No media items to display</p>
      </div>
    );
  }

  return (
    <>
      <div 
        className={`${styles.mediaGrid} ${gridConfig.spacing ? styles[`spacing${gridConfig.spacing.charAt(0).toUpperCase() + gridConfig.spacing.slice(1)}`] : ''} ${gridConfig.layout ? styles[`layout${gridConfig.layout.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('')}`] : ''} ${className}`}
        style={{
          '--columns-mobile': gridConfig.columns.mobile,
          '--columns-tablet': gridConfig.columns.tablet,
          '--columns-desktop': gridConfig.columns.desktop,
          '--aspect-ratio': gridConfig.aspectRatio
        }}
        role="grid"
        aria-label={`Media gallery with ${media.length} items`}
      >
        {media.map((item, index) => {
          const isLoaded = loadedItems.has(index);
          const ariaLabels = getARIALabels(item.type, index, media.length, item.title);
          
          return (
            <div
              key={`${item.src}-${index}`}
              ref={(node) => {
                if (!isLoaded && enableLazyLoading) {
                  observeItem(node, index);
                }
              }}
              data-index={index}
              className={`${getItemClassName(item)} ${isLoaded ? styles.loaded : ''}`}
              role="gridcell"
              aria-label={ariaLabels.label}
              aria-describedby={ariaLabels.description}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  openLightbox(index);
                }
              }}
              onClick={(e) => {
                // Prevent opening lightbox if a control inside the video player was clicked
                if (e.target.closest('button, input, select, a')) {
                  return;
                }
                openLightbox(index);
              }}
            >
              <div className={styles.mediaContainer}>
                {/* Thumbnail/Preview */}
                <div className={styles.imageWrapper}>
                  {renderThumbnailContent(item, isLoaded, index)}
                </div>

                {/* Media Type Overlay - Exclude for videos */}
                {item.type !== MEDIA_TYPES.IMAGE && item.type !== MEDIA_TYPES.VIDEO && (
                  <div className={styles.mediaOverlay}>
                    {getMediaIcon(item)}
                    <span className={styles.mediaTypeLabel}>
                      {getMediaTypeLabel(item.type)}
                    </span>
                  </div>
                )}

                {/* Hover Overlay */}
                <div 
                  className={styles.hoverOverlay}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent grid click from firing
                    if (item.externalLink) {
                      window.open(item.externalLink, '_blank', 'noopener,noreferrer');
                    } else if (item.type !== MEDIA_TYPES.VIDEO) {
                      openLightbox(index);
                    }
                  }}
                >
                  <div className={styles.hoverContent}>
                    <ExternalLink size={20} />
                    <span>View {item.type === MEDIA_TYPES.VIDEO ? 'in Lightbox' : getMediaTypeLabel(item.type).toLowerCase()}</span>
                  </div>
                </div>

                {/* Metadata */}
                {showMetadata && (item.title || item.description || item.metadata) && (
                  <div className={styles.metadata}>
                    {item.title && (
                      <h4 className={styles.mediaTitle}>{item.title}</h4>
                    )}
                    {item.description && (
                      <p className={styles.mediaDescription}>{item.description}</p>
                    )}
                    {item.metadata && (
                      <div className={styles.mediaMetadata}>
                        {item.metadata.format && (
                          <span className={styles.formatBadge}>
                            {item.metadata.format}
                          </span>
                        )}
                        {item.metadata.size && (
                          <span className={styles.sizeBadge}>
                            {formatFileSize(item.metadata.size)}
                          </span>
                        )}
                        {item.metadata.width && item.metadata.height && (
                          <span className={styles.dimensionBadge}>
                            {item.metadata.width}×{item.metadata.height}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Video Duration Overlay */}
                {item.type === MEDIA_TYPES.VIDEO && item.metadata?.duration && (
                  <div className={styles.durationOverlay}>
                    {formatDuration(item.metadata.duration)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <MediaLightbox
          media={media}
          currentIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextMedia}
          onPrev={prevMedia}
        />
      )}
    </>
  );
};

export default MediaGrid;
