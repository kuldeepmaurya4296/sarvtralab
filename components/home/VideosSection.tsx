'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Eye } from 'lucide-react';
import { showcaseVideos, Video } from '@/data/content';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import Image from 'next/image';

const VideosSection = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);

  const categories = ['all', 'Foundation', 'Intermediate', 'Advanced', 'Testimonial'];

  const filteredVideos = selectedCategory === 'all'
    ? showcaseVideos
    : showcaseVideos.filter(v => v.category === selectedCategory);

  return (
    <section id="videos" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="badge-accent mb-4 inline-block"
          >
            Video Library
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="section-heading"
          >
            Learn Through
            <span className="block gradient-text">Engaging Videos</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="section-subheading"
          >
            Watch our curated collection of robotics and coding tutorials.
          </motion.p>
        </div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`filter-tab ${selectedCategory === category ? 'active' : ''}`}
            >
              {category === 'all' ? 'All Videos' : category}
            </button>
          ))}
        </motion.div>

        {/* Video Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="video-thumbnail aspect-video cursor-pointer hover:scale-[1.02] transition-transform relative overflow-hidden"
              onClick={() => setActiveVideo(video)}
            >
              <Image
                src={video.thumbnail}
                alt={video.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover"
              />

              {/* Play Button */}
              <div className="video-play-btn">
                <Play className="w-6 h-6 fill-primary text-primary ml-1" />
              </div>

              {/* Duration Badge */}
              <div className="absolute bottom-4 right-4 z-10 px-2 py-1 rounded bg-black/70 text-white text-xs font-medium">
                {video.duration}
              </div>

              {/* Info Overlay */}
              <div className="absolute bottom-0 left-0 right-0 z-10 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="text-white font-semibold mb-1 line-clamp-1">{video.title}</h4>
                <div className="flex items-center gap-3 text-white/70 text-sm">
                  <span className="px-2 py-0.5 rounded bg-white/20 text-xs">{video.category}</span>
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{(video.views / 1000).toFixed(0)}K views</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <Dialog open={!!activeVideo} onOpenChange={(open) => !open && setActiveVideo(null)}>
        <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-black border-none aspect-video">
          <div className="sr-only">
            <DialogTitle>{activeVideo?.title}</DialogTitle>
          </div>
          {activeVideo && (
            <div className="w-full h-full bg-black">
              <iframe
                src={activeVideo.videoUrl}
                title={activeVideo.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default VideosSection;
