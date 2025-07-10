'use client';

import { Tag } from 'lucide-react';

const VideoDetails = ({ video }) => (
  <div className="bg-card/40 rounded-lg p-3 sm:p-4 border border-border/30 h-full flex flex-col">
    <h4 className="font-semibold text-foreground mb-2 truncate text-sm sm:text-base" title={video.title}>
      {video.title}
    </h4>
    <div className="space-y-2 text-xs sm:text-sm text-muted-foreground mt-auto">
      <div className="flex items-center gap-2">
        <Tag className="w-3 h-3 text-primary" />
        <span>{video.metadata?.category || 'Video'}</span>
      </div>
    </div>
  </div>
);

export default VideoDetails; 