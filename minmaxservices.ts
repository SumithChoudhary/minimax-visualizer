import type { TreeNode, VisualizationStep } from '../types';

let nodeIdCounter = 0;

function parseSExpression(tokens: string[]): TreeNode {
    const token = tokens.shift();
    if (!token) throw new Error('Unexpected end of input during parsing.');
    if (token === '(') {
        const name = tokens.shift();
        if (!name) throw new Error('Node name missing after "(".');
        if (name === '(' || name === ')') throw new Error(`Invalid node name: ${name}`);

        const children: TreeNode[] = [];
        while (tokens.length > 0 && tokens[0] !== ')') {
            children.push(parseSExpression(tokens));
        }

        if (tokens.shift() !== ')') {
            throw new Error(`Missing ')' for node ${name}.`);
        }
        
        return { id: `node-${nodeIdCounter++}`, name, children };
    } else if (token === ')') {
        throw new Error('Unexpected ")".');
    } else {
        const value = parseInt(token, 10);
        if (isNaN(value)) {
            throw new Error(`Invalid leaf value: ${token}. Expected a number.`);
        }
        return { id: `node-${nodeIdCounter++}`, name: token, value, children: [] };
    }
}


function tokenize(input: string): string[] {
    return input.replace(/\(/g, ' ( ').replace(/\)/g, ' ) ').trim().split(/\s+/);
}

function minimax(
    node: TreeNode,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizingPlayer: boolean,
    steps: VisualizationStep[]
): number {
    steps.push({
        type: 'VISIT',
        nodeId: node.id,
        message: `Visiting ${isMaximizingPlayer ? 'MAX' : 'MIN'} node ${node.name}. α=${alpha}, β=${beta}`,
        alpha,
        beta,
    });

    if (node.children.length === 0) {
        const value = node.value ?? 0;
        steps.push({
            type: 'LEAF',
            nodeId: node.id,
            message: `Terminal node ${node.name} reached. Value: ${value}.`,
            alpha,
            beta,
            value: value,
        });
        return value;
    }

    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const child of node.children) {
            const evaluation = minimax(child, depth + 1, alpha, beta, false, steps);
            maxEval = Math.max(maxEval, evaluation);
            const oldAlpha = alpha;
            alpha = Math.max(alpha, evaluation);

            steps.push({
                type: 'UPDATE',
                nodeId: node.id,
                message: `MAX node ${node.name} receives ${evaluation} from ${child.name}. New value=${maxEval}. α updated from ${oldAlpha} to ${alpha}.`,
                alpha,
                beta,
                value: maxEval
            });

            if (beta <= alpha) {
                const remainingChildren = node.children.slice(node.children.indexOf(child) + 1);
                steps.push({
                    type: 'PRUNE',
                    nodeId: node.id,
                    message: `PRUNING! β(${beta}) ≤ α(${alpha}) at node ${node.name}. Pruning remaining children.`,
                    alpha,
                    beta,
                    prunedChildren: remainingChildren.map(c => c.id)
                });
                break;
            }
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const child of node.children) {
            const evaluation = minimax(child, depth + 1, alpha, beta, true, steps);
            minEval = Math.min(minEval, evaluation);
            const oldBeta = beta;
            beta = Math.min(beta, evaluation);

             steps.push({
                type: 'UPDATE',
                nodeId: node.id,
                message: `MIN node ${node.name} receives ${evaluation} from ${child.name}. New value=${minEval}. β updated from ${oldBeta} to ${beta}.`,
                alpha,
                beta,
                value: minEval
            });

            if (beta <= alpha) {
                 const remainingChildren = node.children.slice(node.children.indexOf(child) + 1);
                steps.push({
                    type: 'PRUNE',
                    nodeId: node.id,
                    message: `PRUNING! β(${beta}) ≤ α(${alpha}) at node ${node.name}. Pruning remaining children.`,
                    alpha,
                    beta,
                    prunedChildren: remainingChildren.map(c => c.id)
                });
                break;
            }
        }
        return minEval;
    }
}


function findOptimalPath(tree: TreeNode, finalValue: number): string[] {
    const path: string[] = [tree.id];
    let currentNode = tree;
    let isMaximizing = true;

    while (currentNode.children.length > 0) {
        let nextNode: TreeNode | null = null;
        if (isMaximizing) {
            for(const child of currentNode.children) {
                if(child.value === finalValue) {
                    nextNode = child;
                    break;
                }
            }
        } else { // isMinimizing
            for(const child of currentNode.children) {
                if(child.value === finalValue) {
                    nextNode = child;
                    break;
                }
            }
        }
        
        // Fallback if no direct match (due to pruning)
        if (!nextNode) {
             const potentialNodes = currentNode.children.filter(c => c.value !== undefined);
             if (potentialNodes.length > 0) {
                 nextNode = isMaximizing ? 
                    potentialNodes.reduce((a, b) => a.value! > b.value! ? a : b) :
                    potentialNodes.reduce((a, b) => a.value! < b.value! ? a : b);
             } else {
                 break; // No evaluated children, path ends
             }
        }
        
        if (nextNode) {
            path.push(nextNode.id);
            currentNode = nextNode;
            isMaximizing = !isMaximizing;
        } else {
            break;
        }
    }
    return path;
}

function assignValuesToTree(tree: TreeNode, steps: VisualizationStep[]): void {
    const nodeValues = new Map<string, number>();
    for(const step of steps) {
        if(step.type === 'LEAF' || step.type === 'UPDATE') {
             if(step.value !== undefined) {
                 nodeValues.set(step.nodeId, step.value);
             }
        }
    }
    
    function traverse(node: TreeNode) {
        if(nodeValues.has(node.id)) {
            node.value = nodeValues.get(node.id);
        }
        for(const child of node.children) {
            traverse(child);
        }
    }
    traverse(tree);
}


export function parseAndRunMinimax(input: string): { tree: TreeNode; steps: VisualizationStep[] } {
    nodeIdCounter = 0;
    if (!input.trim().startsWith('(') || !input.trim().endsWith(')')) {
        throw new Error('Invalid input format. Must start with "(" and end with ")".');
    }
    const tokens = tokenize(input);
    const tree = parseSExpression(tokens);
    if(tokens.length > 0) {
        throw new Error("Invalid input format. Extra characters found after main expression.");
    }
    
    const steps: VisualizationStep[] = [];
    const finalValue = minimax(tree, 0, -Infinity, Infinity, true, steps);
    
    assignValuesToTree(tree, steps);
    const finalPath = findOptimalPath(tree, finalValue);

    steps.push({
        type: 'FINAL',
        nodeId: tree.id,
        message: `Algorithm complete. The optimal value is ${finalValue}.`,
        alpha: -Infinity,
        beta: Infinity,
        value: finalValue,
        finalPath
    });

    return { tree, steps };
}
