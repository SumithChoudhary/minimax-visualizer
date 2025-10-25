export interface TreeNode {
    id: string;
    name: string;
    value?: number;
    children: TreeNode[];
}

export type VisualizationStepType = 'VISIT' | 'LEAF' | 'UPDATE' | 'PRUNE' | 'FINAL';

export interface VisualizationStep {
    type: VisualizationStepType;
    nodeId: string;
    message: string;
    alpha: number;
    beta: number;
    value?: number;
    prunedChildren?: string[];
    finalPath?: string[];
}
