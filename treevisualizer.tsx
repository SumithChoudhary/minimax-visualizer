import React, { useMemo } from 'react';
import * as d3 from 'd3';
import type { TreeNode, VisualizationStep } from '../types';

interface TreeVisualizerProps {
    tree: TreeNode;
    currentStep: VisualizationStep;
}

const TreeVisualizer: React.FC<TreeVisualizerProps> = ({ tree, currentStep }) => {
    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    const { nodes, links } = useMemo(() => {
        const root = d3.hierarchy(tree);
        const treeLayout = d3.tree<TreeNode>().size([
            width - margin.left - margin.right,
            height - margin.top - margin.bottom,
        ]);
        const treeRoot = treeLayout(root);
        
        const nodes = treeRoot.descendants().map(d => ({
            ...d.data,
            x: d.x + margin.left,
            y: d.y + margin.top,
        }));
        
        const links = treeRoot.links().map(l => ({
            source: { ...l.source.data, x: l.source.x + margin.left, y: l.source.y + margin.top },
            target: { ...l.target.data, x: l.target.x + margin.left, y: l.target.y + margin.top },
        }));
        return { nodes, links };
    }, [tree, width, height, margin]);

    const allPrunedIds = useMemo(() => {
        const prunedSet = new Set<string>();
        if (currentStep.prunedChildren) {
             currentStep.prunedChildren.forEach(id => prunedSet.add(id));
        }
        function findChildren(nodeId: string) {
            const node = nodes.find(n => n.id === nodeId);
            if(node && node.children) {
                node.children.forEach(child => {
                    prunedSet.add(child.id);
                    findChildren(child.id);
                });
            }
        }
        if (currentStep.prunedChildren) {
            currentStep.prunedChildren.forEach(id => findChildren(id));
        }

        return prunedSet;
    }, [currentStep, nodes]);


    const isNodePruned = (nodeId: string) => allPrunedIds.has(nodeId);

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
            <g>
                {links.map((link, i) => {
                     const isSourceOnPath = currentStep.finalPath?.includes(link.source.id);
                     const isTargetOnPath = currentStep.finalPath?.includes(link.target.id);
                     const onPath = isSourceOnPath && isTargetOnPath;
                     const isPruned = isNodePruned(link.target.id);

                     return (
                        <line
                            key={i}
                            x1={link.source.x}
                            y1={link.source.y}
                            x2={link.target.x}
                            y2={link.target.y}
                            stroke={onPath ? '#06b6d4' : (isPruned ? '#4b5563' : '#6b7280')}
                            strokeWidth={onPath ? 3 : 1.5}
                            className="transition-all duration-300"
                        />
                     );
                })}
            </g>
            <g>
                {nodes.map((node) => {
                    const isCurrent = node.id === currentStep.nodeId;
                    const isLeaf = !node.children || node.children.length === 0;
                    const isPruned = isNodePruned(node.id);
                    const onPath = currentStep.finalPath?.includes(node.id);

                    let fill = '#1f2937';
                    let stroke = '#4b5563';
                    if (onPath) {
                        stroke = '#06b6d4';
                        fill = '#164e63';
                    }
                    if (isCurrent) {
                        stroke = '#67e8f9';
                        fill = '#0e7490';
                    }
                    if (isPruned) {
                        fill = '#374151';
                        stroke = '#4b5563';
                    }
                    
                    return (
                        <g key={node.id} transform={`translate(${node.x},${node.y})`} className="transition-transform duration-300">
                            <circle
                                r={isLeaf ? 20 : 25}
                                fill={fill}
                                stroke={stroke}
                                strokeWidth={isCurrent || onPath ? 3 : 2}
                                className="transition-all duration-300"
                            />
                            <text
                                textAnchor="middle"
                                dy=".35em"
                                fill={isPruned ? '#9ca3af' : '#e5e7eb'}
                                fontSize="14px"
                                fontWeight="bold"
                            >
                                {node.name}
                            </text>
                            {isLeaf && (
                                <text textAnchor="middle" y={35} fill="#a5f3fc" fontSize="12px">
                                    {node.value}
                                </text>
                            )}
                            {!isLeaf && node.value !== undefined && (
                                <text textAnchor="middle" y={40} fill="#a5f3fc" fontSize="14px" fontWeight="bold">
                                    v={node.value}
                                </text>
                            )}
                            {node.id === currentStep.nodeId && !isLeaf && (
                                <>
                                    <text textAnchor="end" x={-30} y={0} fill="#f472b6" fontSize="12px">
                                        α: {currentStep.alpha === -Infinity ? '-∞' : currentStep.alpha}
                                    </text>
                                     <text textAnchor="start" x={30} y={0} fill="#818cf8" fontSize="12px">
                                        β: {currentStep.beta === Infinity ? '+∞' : currentStep.beta}
                                    </text>
                                </>
                            )}
                        </g>
                    );
                })}
            </g>
        </svg>
    );
};

export default TreeVisualizer;
