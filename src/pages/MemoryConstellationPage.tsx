import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ZoomIn, ZoomOut, Maximize2, Minimize2 } from 'lucide-react';
import { ForceGraph2D } from 'react-force-graph';
import Layout from '../components/layout/Layout';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useDiary } from '../context/DiaryContext';

interface Node {
  id: string;
  name: string;
  val: number;
  type: 'entry' | 'tag';
  color?: string;
}

interface Link {
  source: string;
  target: string;
  value: number;
}

const MemoryConstellationPage: React.FC = () => {
  const { entries } = useDiary();
  const navigate = useNavigate();
  const [graphData, setGraphData] = useState<{ nodes: Node[]; links: Link[] }>({ nodes: [], links: [] });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    // Create nodes and links from entries and tags
    const nodes: Node[] = [];
    const links: Link[] = [];
    const tagMap = new Map<string, string[]>();

    // Add entry nodes
    entries.forEach(entry => {
      nodes.push({
        id: entry.id,
        name: entry.title,
        val: 5,
        type: 'entry',
        color: '#3b82f6' // primary-500
      });

      // Track tags for each entry
      entry.tags.forEach(tag => {
        if (!tagMap.has(tag)) {
          tagMap.set(tag, []);
        }
        tagMap.get(tag)?.push(entry.id);
      });
    });

    // Add tag nodes and create links
    tagMap.forEach((entryIds, tag) => {
      const tagId = `tag-${tag}`;
      nodes.push({
        id: tagId,
        name: `#${tag}`,
        val: 3,
        type: 'tag',
        color: '#8b5cf6' // accent-500
      });

      // Create links between tag and entries
      entryIds.forEach(entryId => {
        links.push({
          source: tagId,
          target: entryId,
          value: 1
        });
      });
    });

    setGraphData({ nodes, links });
  }, [entries]);

  const handleNodeClick = useCallback((node: Node) => {
    if (node.type === 'entry') {
      navigate(`/journal/${node.id}`);
    }
  }, [navigate]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const handleZoomIn = () => setZoom(z => Math.min(z * 1.2, 2.5));
  const handleZoomOut = () => setZoom(z => Math.max(z * 0.8, 0.5));

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Memory Constellation</h1>
          <p className="text-gray-600 mt-2">
            Explore the connections between your memories and experiences
          </p>
        </div>

        {entries.length === 0 ? (
          <Card>
            <div className="p-8 text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-4">No Memories Yet</h2>
              <p className="text-gray-600 mb-6">
                Start writing journal entries to see them visualized in your memory constellation.
              </p>
              <Link to="/journal/new">
                <Button>Create Your First Entry</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="relative bg-white rounded-lg shadow-sm">
            <div className="absolute top-4 right-4 z-10 flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                icon={<ZoomOut className="h-4 w-4" />}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomIn}
                icon={<ZoomIn className="h-4 w-4" />}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={toggleFullscreen}
                icon={isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              />
            </div>
            
            <div className="h-[600px] w-full">
              <ForceGraph2D
                graphData={graphData}
                nodeLabel="name"
                nodeColor={node => (node as Node).color || '#000000'}
                nodeRelSize={6}
                linkWidth={1}
                linkColor={() => '#e5e7eb'} // gray-200
                onNodeClick={handleNodeClick}
                zoom={zoom}
                cooldownTicks={100}
                nodeCanvasObject={(node, ctx, globalScale) => {
                  const label = (node as Node).name;
                  const fontSize = 12/globalScale;
                  ctx.font = `${fontSize}px Inter`;
                  ctx.textAlign = 'center';
                  ctx.textBaseline = 'middle';
                  ctx.fillStyle = (node as Node).type === 'tag' ? '#6d28d9' : '#1e40af';
                  ctx.fillText(label, node.x!, node.y!);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MemoryConstellationPage;