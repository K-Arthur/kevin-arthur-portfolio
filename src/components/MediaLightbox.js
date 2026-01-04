import { useRef, useState, useEffect, useCallback, memo } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw, Download, Maximize2, Minimize2 } from 'lucide-react';
import VideoPlayer from './VideoPlayer';
import PDFViewer from './PDFViewer';
import { MEDIA_TYPES, getARIALabels } from '@/lib/mediaUtils';
import styles from './MediaLightbox.module.css';

const MediaLightbox = memo(({ media, currentIndex, onClose, onNext, onPrev }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [touchStart, setTouchStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState('fit'); // 'fit', 'fill', 'actual'
  const [rotation, setRotation] = useState(0);
  const lightboxRef = useRef(null);
  const imageRef = useRef(null);
  const [portalElement, setPortalElement] = useState(null);

  useEffect(() => {
    let element = document.getElementById('lightbox-portal');
    if (!element) {
      element = document.createElement('div');
      element.id = 'lightbox-portal';
      document.body.appendChild(element);
    }
    setPortalElement(element);
    
    return () => {
      if (element && element.parentNode === document.body) {
        document.body.removeChild(element);
      }
    };
  }, []);

  useEffect(() => {
    setImageLoaded(false);
    setHasError(false);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
    setRotation(0);
    setViewMode('fit');
    
    if (lightboxRef.current) {
      lightboxRef.current.scrollTop = 0;
      lightboxRef.current.scrollLeft = 0;
    }
  }, [currentIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'ArrowRight') onNext();
    if (e.key === 'ArrowLeft') onPrev();
    if (e.key === '=') handleZoomIn();
    if (e.key === '-') handleZoomOut();
    if (e.key === '0') handleResetZoom();
    if (e.key === 'r') handleRotate();
  }, [onClose, onNext, onPrev]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    if (lightboxRef.current) {
      lightboxRef.current.focus();
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  const currentItem = media[currentIndex];
  const isDesktopMockup = currentItem?.type === MEDIA_TYPES.DESKTOP_MOCKUP;
  const isMobileMockup = currentItem?.type === MEDIA_TYPES.MOBILE_MOCKUP;
  const isVideo = currentItem?.type === MEDIA_TYPES.VIDEO;
  const isImage = currentItem?.type === MEDIA_TYPES.IMAGE || currentItem?.type === MEDIA_TYPES.GRAPHIC;

  // Touch and gesture handlers
  const handleTouchStart = useCallback((e) => {
    if (e.touches.length === 1) {
      setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (!touchStart.x || !touchStart.y) return;
    
    const touchEnd = { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    const deltaX = touchStart.x - touchEnd.x;
    const deltaY = touchStart.y - touchEnd.y;
    
    // Swipe detection
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        onNext();
      } else {
        onPrev();
      }
    }
    
    setTouchStart({ x: 0, y: 0 });
  }, [touchStart, onNext, onPrev]);

  // Zoom and pan handlers
  const handleWheel = useCallback((e) => {
    if (!isDesktopMockup && !isImage) return;
    
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.2 : 0.2;
    setZoomLevel(prev => Math.max(0.1, Math.min(prev + delta, 10)));
  }, [isDesktopMockup, isImage]);

  const handleMouseDown = useCallback((e) => {
    if ((!isDesktopMockup && !isImage) || zoomLevel <= 1) return;
    
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  }, [isDesktopMockup, isImage, zoomLevel, panPosition]);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging) return;
    
    e.preventDefault();
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 10));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.1));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  const handleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await lightboxRef.current?.requestFullscreen();
        setIsFullscreen(true);
      } catch (error) {
        console.warn('Fullscreen not supported');
      }
    } else {
      try {
        await document.exitFullscreen();
        setIsFullscreen(false);
      } catch (error) {
        console.warn('Exit fullscreen failed');
      }
    }
  };

  // Remove download functionality
  // const handleDownload = () => {
  //   const link = document.createElement('a');
  //   link.href = currentItem.src;
  //   link.download = currentItem.title || 'media';
  //   link.click();
  // };

  // Add download prevention
  const handleRightClick = (e) => {
    e.preventDefault();
    return false;
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (currentIndex === null || !currentItem || !portalElement) return null;

  const ariaLabels = getARIALabels(currentItem.type, currentIndex, media.length, currentItem.title);

  const getImageStyle = () => {
    let transform = `scale(${zoomLevel})`;
    
    if (panPosition.x !== 0 || panPosition.y !== 0) {
      transform += ` translate(${panPosition.x}px, ${panPosition.y}px)`;
    }
    
    if (rotation !== 0) {
      transform += ` rotate(${rotation}deg)`;
    }

    const style = {
      transform,
      cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default',
      transition: isDragging ? 'none' : 'transform 0.3s ease'
    };

    // View mode specific styles
    if (viewMode === 'fit') {
      style.objectFit = 'contain';
      style.maxWidth = '100%';
      style.maxHeight = '100%';
    } else if (viewMode === 'fill') {
      style.objectFit = 'cover';
      style.width = '100%';
      style.height = '100%';
    } else if (viewMode === 'actual') {
      style.objectFit = 'none';
      style.width = 'auto';
      style.height = 'auto';
    }

    return style;
  };

  const lightboxContent = (
    <div 
      ref={lightboxRef}
      className={`${styles.lightbox} ${styles[`type-${currentItem.type}`]} ${isFullscreen ? styles.fullscreen : ''}`}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onContextMenu={handleRightClick}
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabels.label}
      aria-describedby={ariaLabels.description}
      tabIndex="-1"
    >
      {/* Loading indicator */}
      {!imageLoaded && (isImage || isDesktopMockup || isMobileMockup) && !hasError && (
        <div className={styles.loadingIndicator}>
          <div className={styles.spinner}></div>
          <p>Loading {currentItem.type.replace('_', ' ')}...</p>
        </div>
      )}

      {/* Media content */}
      <div className={`${styles.mediaContainer} ${imageLoaded ? styles.loaded : ''}`}>
        {(isImage || isDesktopMockup || isMobileMockup) && (
          <img
            ref={imageRef}
            src={currentItem.src}
            alt={ariaLabels.label}
            className={`${styles.mediaContent} ${styles[`viewMode-${viewMode}`]}`}
            onLoad={handleImageLoad}
            onError={() => {
              console.warn('Image failed to load:', currentItem.src);
              setHasError(true);
              setImageLoaded(true);
            }}
            loading="eager"
            draggable="false"
            style={getImageStyle()}
          />
        )}
        
        {isVideo && (
          <VideoPlayer 
            src={currentItem.src} 
            poster={currentItem.thumbnail}
            className={styles.mediaContent}
            autoPlay={false}
          />
        )}
        
        {currentItem.type === MEDIA_TYPES.PDF && (
          <div className={styles.mediaContent} style={{ width: '100%', height: '100%' }}>
            <PDFViewer file={currentItem.src} thumbnail={currentItem.thumbnail} />
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className={styles.controlsBar}>
        {/* Zoom controls for images and desktop mockups */}
        {(isDesktopMockup || isImage) && (
          <div className={styles.zoomControls}>
            <button 
              onClick={handleZoomOut}
              className={styles.controlButton}
              aria-label="Zoom out"
              disabled={zoomLevel <= 0.1}
            >
              <ZoomOut size={16} />
            </button>
            <span className={styles.zoomLevel}>{Math.round(zoomLevel * 100)}%</span>
            <button 
              onClick={handleZoomIn}
              className={styles.controlButton}
              aria-label="Zoom in"
              disabled={zoomLevel >= 10}
            >
              <ZoomIn size={16} />
            </button>
            <button 
              onClick={handleResetZoom}
              className={styles.controlButton}
              aria-label="Reset zoom"
            >
              1:1
            </button>
          </div>
        )}

        {/* View mode controls */}
        {(isDesktopMockup || isImage) && (
          <div className={styles.viewModeControls}>
            <button 
              onClick={() => handleViewModeChange('fit')}
              className={`${styles.controlButton} ${viewMode === 'fit' ? styles.active : ''}`}
              aria-label="Fit to screen"
            >
              Fit
            </button>
            <button 
              onClick={() => handleViewModeChange('fill')}
              className={`${styles.controlButton} ${viewMode === 'fill' ? styles.active : ''}`}
              aria-label="Fill screen"
            >
              Fill
            </button>
            <button 
              onClick={() => handleViewModeChange('actual')}
              className={`${styles.controlButton} ${viewMode === 'actual' ? styles.active : ''}`}
              aria-label="Actual size"
            >
              Actual
            </button>
          </div>
        )}

        {/* Rotation control */}
        {(isDesktopMockup || isImage) && (
          <button 
            onClick={handleRotate}
            className={styles.controlButton}
            aria-label="Rotate image"
          >
            <RotateCw size={16} />
          </button>
        )}

        {/* Fullscreen control */}
        <button 
          onClick={handleFullscreen}
          className={styles.controlButton}
          aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
        </button>

        {/* Remove download control */}
        {/* <button 
          onClick={handleDownload}
          className={styles.controlButton}
          aria-label="Download media"
        >
          <Download size={16} />
        </button> */}
      </div>

      {/* Navigation controls */}
      {media.length > 1 && (
        <>
          <button 
            className={`${styles.navButton} ${styles.prevButton}`}
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            aria-label={`Previous media (${currentIndex} of ${media.length})`}
            tabIndex={0}
          >
            <ChevronLeft size={32} />
          </button>
          
          <button 
            className={`${styles.navButton} ${styles.nextButton}`}
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            aria-label={`Next media (${currentIndex + 2} of ${media.length})`}
            tabIndex={0}
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}
      
      {/* Close button */}
      <button 
        className={`${styles.controlButton} ${styles.closeButton}`}
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close lightbox"
        tabIndex={0}
      >
        <X size={24} />
      </button>

      {/* Media counter */}
      {media.length > 1 && (
        <div className={styles.mediaCounter}>
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Media info */}
      <div className={styles.mediaInfo}>
        <h3 className={styles.mediaTitle}>{currentItem.title}</h3>
        {currentItem.metadata && (
          <div className={styles.mediaMetadata}>
            {currentItem.metadata.width && currentItem.metadata.height && (
              <span>{currentItem.metadata.width}×{currentItem.metadata.height}</span>
            )}
            {currentItem.metadata.size && (
              <span>{(currentItem.metadata.size / 1024 / 1024).toFixed(1)} MB</span>
            )}
            {currentItem.metadata.format && (
              <span>{currentItem.metadata.format.toUpperCase()}</span>
            )}
          </div>
        )}
      </div>

      {/* Swipe indicator for mobile */}
      {isMobileMockup && (
        <div className={styles.swipeIndicator}>
          <p>Swipe to navigate</p>
        </div>
      )}
    </div>
  );

  return createPortal(lightboxContent, portalElement);
});

MediaLightbox.displayName = 'MediaLightbox';

export default MediaLightbox;
