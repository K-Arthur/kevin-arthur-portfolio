'use client';

import { useState, useEffect } from 'react';
import { FileText, Download, ExternalLink, AlertCircle } from 'lucide-react';

const PDFViewer = ({ file, thumbnail, className = '' }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (file) {
      // For PDFs, we'll use the file URL directly
      const url = file.startsWith('/api/media') ? file : `/api/media?path=${encodeURIComponent(file)}`;
      setPdfUrl(url);
      setIsLoading(false);
    }
  }, [file]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = file.split('/').pop() || 'document.pdf';
      link.click();
    }
  };

  const handleOpenExternal = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-100 ${className}`}>
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading PDF...</p>
        </div>
      </div>
    );
  }

  if (hasError || !pdfUrl) {
    return (
      <div className={`flex items-center justify-center min-h-[400px] bg-gray-100 ${className}`}>
        <div className="text-center max-w-md p-6">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Cannot Display PDF</h3>
          <p className="text-gray-600 mb-4">
            This PDF cannot be displayed in the browser. You can download it to view.
          </p>
          <div className="flex gap-2 justify-center">
            <button 
              onClick={handleDownload}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
              aria-label="Download PDF document"
            >
              <Download className="w-4 h-4" aria-hidden="true" />
              Download PDF
            </button>
            <button 
              onClick={handleOpenExternal}
              className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              aria-label="Open PDF in new browser tab"
            >
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full min-h-[400px] bg-gray-100 ${className}`}>
      {/* PDF Embed */}
      <div className="w-full h-full relative">
        <iframe
          src={pdfUrl}
          className="w-full h-full border-0"
          title={`PDF Document Viewer - ${file?.split('/').pop() || 'Document'}`}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
        />
        
        {/* Fallback overlay with controls */}
        <div className="absolute top-4 right-4 flex gap-2">
          <button
            onClick={handleDownload}
            className="p-2 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-colors"
            title="Download PDF"
            aria-label="Download PDF document"
          >
            <Download className="w-4 h-4" aria-hidden="true" />
          </button>
          <button
            onClick={handleOpenExternal}
            className="p-2 bg-black bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-colors"
            title="Open in new tab"
            aria-label="Open PDF in new browser tab"
          >
            <ExternalLink className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PDFViewer;
