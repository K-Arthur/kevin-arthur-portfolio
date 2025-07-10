'use client';

import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, Download, AlertCircle } from 'lucide-react';

const VideoPlayer = ({ src, poster, className = '', autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showControls, setShowControls] = useState(false);
  const [buffered, setBuffered] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canPlay, setCanPlay] = useState(false);
  const [videoDimensions, setVideoDimensions] = useState({ width: 0, height: 0, aspectRatio: 16/9 });
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });
  const videoRef = useRef(null);
  const controlsTimeoutRef = useRef(null);
  const containerRef = useRef(null);

  // Simplified video sizing - let CSS handle aspect ratio preservation
  const getVideoStyle = () => {
    return {
      width: '100%',
      height: '100%',
      objectFit: 'contain', // Always use contain to prevent cropping
      backgroundColor: 'black'
    };
  };

  // Update container dimensions
  const updateContainerDimensions = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setContainerDimensions({
        width: rect.width,
        height: rect.height
      });
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadStart = () => {
      setIsLoading(true);
      setError(null);
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setCanPlay(true);
      
      // Get actual video dimensions
      setVideoDimensions({
        width: video.videoWidth,
        height: video.videoHeight,
        aspectRatio: video.videoWidth / video.videoHeight
      });
    };

    const handleCanPlay = () => {
      setIsLoading(false);
      setCanPlay(true);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      
      // Update buffered progress
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const bufferedPercent = (bufferedEnd / video.duration) * 100;
        setBuffered(bufferedPercent);
      }
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleVolumeChange = () => {
      setVolume(video.volume);
      setIsMuted(video.muted);
    };

    const handleError = (e) => {
      console.error('Video error:', e);
      setError('Unable to play this video format. Try downloading the file instead.');
      setIsLoading(false);
    };

    const handleWaiting = () => setIsLoading(true);
    const handlePlaying = () => setIsLoading(false);

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    const handleResize = () => {
      updateContainerDimensions();
    };

    // Video event listeners
    video.addEventListener('loadstart', handleLoadStart);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('volumechange', handleVolumeChange);
    video.addEventListener('error', handleError);
    video.addEventListener('waiting', handleWaiting);
    video.addEventListener('playing', handlePlaying);

    // Fullscreen and resize event listeners
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    window.addEventListener('resize', handleResize);

    // Initial container dimensions
    updateContainerDimensions();

    return () => {
      video.removeEventListener('loadstart', handleLoadStart);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('volumechange', handleVolumeChange);
      video.removeEventListener('error', handleError);
      video.removeEventListener('waiting', handleWaiting);
      video.removeEventListener('playing', handlePlaying);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const togglePlay = async () => {
    const video = videoRef.current;
    if (!video || !canPlay) return;

    try {
      if (isPlaying) {
        video.pause();
      } else {
        await video.play();
      }
    } catch (error) {
      console.error('Play error:', error);
      setError('Unable to play video. This may be due to browser restrictions or format compatibility.');
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    // Unmute if volume is increased
    if (newVolume > 0 && video.muted) {
      video.muted = false;
    }
  };

  const handleSeek = (e) => {
    const video = videoRef.current;
    if (!video || !duration) return;

    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if (container.webkitRequestFullscreen) {
          await container.webkitRequestFullscreen();
        } else if (container.msRequestFullscreen) {
          await container.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  const handleRestart = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    if (!isPlaying) {
      togglePlay();
    }
  };

  // Remove download functionality
  // const handleDownload = () => {
  //   const link = document.createElement('a');
  //   link.href = src;
  //   link.download = src.split('/').pop();
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // };

  // Add download prevention
  const handleRightClick = (e) => {
    e.preventDefault();
    return false;
  };

  const handleContextMenu = (e) => {
    e.preventDefault();
    return false;
  };

  const formatTime = (time) => {
    if (!time || !isFinite(time)) return '0:00';
    
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleMouseMove = () => {
    // Only show controls if the video is actually playing
    if (isPlaying) {
      setShowControls(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      setShowControls(false);
    }
  };

  const optimalVideoSize = getVideoStyle();

  // Video format detection and fallback
  const getVideoSources = (src) => {
    const sources = [];
    const baseUrl = src.substring(0, src.lastIndexOf('.'));
    const extension = src.split('.').pop()?.toLowerCase();
    
    // Primary source
    sources.push({ src, type: getMimeType(extension) });
    
    // For MOV files, try to find MP4 alternatives
    if (extension === 'mov') {
      const mp4Alternative = `${baseUrl}.mp4`;
      sources.push({ src: mp4Alternative, type: 'video/mp4' });
    }
    
    return sources;
  };

  const getMimeType = (extension) => {
    switch (extension.toLowerCase()) {
      case 'mp4':
        return 'video/mp4';
      case 'mov':
        return 'video/quicktime';
      case 'webm':
        return 'video/webm';
      case 'ogg':
        return 'video/ogg';
      case 'avi':
        return 'video/x-msvideo';
      default:
        return 'video/mp4';
    }
  };

  // Check if browser supports video format
  const checkVideoSupport = (mimeType) => {
    const video = document.createElement('video');
    return video.canPlayType(mimeType) !== '';
  };

  // Enhanced error handling for different video formats
  const handleVideoError = (e) => {
    console.error('Video error:', e);
    const videoFormat = src.split('.').pop()?.toLowerCase();
    
    if (videoFormat === 'mov') {
      // Check if browser supports MOV
      if (!checkVideoSupport('video/quicktime')) {
        setError('Your browser doesn\'t support MOV files. This video uses codecs that require QuickTime Player or a compatible browser. Try downloading the file or using Safari/Chrome.');
      } else {
        setError('This MOV file may use unsupported codecs (like H.265/HEVC). Try downloading the file or using a different browser.');
      }
    } else {
      setError(`Unable to play this ${videoFormat?.toUpperCase()} video. The file may be corrupted or use unsupported codecs.`);
    }
    setIsLoading(false);
  };

  if (error) {
    return (
      <div className="w-full h-full bg-black flex items-center justify-center text-white">
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Video Playback Error</h3>
          <p className="text-sm text-gray-300 mb-4">{error}</p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={() => window.open(src, '_blank')}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90 transition-colors"
            >
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className={`relative w-full h-full bg-black group ${className} ${isFullscreen ? 'fullscreen-video' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onContextMenu={handleContextMenu}
      onRightClick={handleRightClick}
    >
      {/* Video Container with Download Prevention */}
      <div className="w-full h-full flex items-center justify-center">
        <video
          ref={videoRef}
          poster={poster}
          className="block max-w-full max-h-full"
          style={getVideoStyle()}
          autoPlay={autoPlay}
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onError={handleVideoError}
          onContextMenu={handleContextMenu}
          controlsList="nodownload nofullscreen noremoteplayback"
          disablePictureInPicture
        >
          {/* Multiple source elements for better compatibility */}
          {getVideoSources(src).map((source, index) => (
            <source key={index} src={source.src} type={source.type} />
          ))}
          <p className="text-white text-center p-4">
            Your browser does not support the video tag.
          </p>
        </video>
      </div>

      {/* --- Start: Visual enhancements for video thumbnail --- */}
      {!isPlaying && !isLoading && !error && (
        <div 
          className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/10 group-hover:bg-black/30 transition-colors duration-300"
        >
          <div className="p-3 sm:p-4 bg-white/20 rounded-full backdrop-blur-sm text-white transform group-hover:scale-110 transition-transform duration-300">
            <Play size={48} className="translate-x-1" />
          </div>

          {duration > 0 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs font-semibold px-2 py-1 rounded">
              {formatTime(duration)}
            </div>
          )}
        </div>
      )}
      {/* --- End: Visual enhancements for video thumbnail --- */}

      {/* Loading Spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
            <p className="text-white text-sm">Loading video...</p>
          </div>
        </div>
      )}

      {/* Play Button Overlay */}
      {!isPlaying && !isLoading && canPlay && (
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            onClick={togglePlay}
            className="w-20 h-20 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110"
          >
            <Play className="w-8 h-8 text-white ml-1" />
          </button>
        </div>
      )}

      {/* Video Info Overlay */}
      {videoDimensions.width > 0 && (
        <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          {videoDimensions.width}×{videoDimensions.height} • {videoDimensions.aspectRatio.toFixed(2)}:1
        </div>
      )}

      {/* Controls */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity duration-300 ${showControls ? 'opacity-100' : 'opacity-0'}`}>
        {/* Progress Bar */}
        <div className="mb-4 relative">
          {/* Buffered Progress */}
          <div 
            className="absolute top-0 left-0 h-1 bg-white/30 rounded-full"
            style={{ width: `${buffered}%` }}
          />
          {/* Seek Bar */}
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={togglePlay}
              className="text-white hover:text-primary transition-colors"
              disabled={!canPlay}
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </button>

            <button
              onClick={handleRestart}
              className="text-white hover:text-primary transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-white hover:text-primary transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer slider"
              />
            </div>

            <div className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>

            {/* Playback Speed */}
            {/* Removed playback speed button group */}
          </div>

          <div className="flex items-center space-x-2">
            {/* Remove download button */}
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #000;
        }
        
        .slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          border: 2px solid #000;
        }

        .fullscreen-video {
          position: fixed !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          height: 100vh !important;
          z-index: 9999 !important;
        }
      `}</style>
    </div>
  );
};

export default VideoPlayer;
