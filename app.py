import streamlit as st
import streamlit.components.v1 as components

# Page configuration
st.set_page_config(
    page_title="Minimax Alpha-Beta Visualizer",
    page_icon="🎮",
    layout="wide"
)

# Title and description
st.title("🎮 Minimax with Alpha-Beta Pruning Visualizer")
st.markdown("Interactive visualization of game tree search algorithms")

# Sidebar information
with st.sidebar:
    st.header("About")
    st.markdown("""
    This application visualizes:
    - **Minimax Algorithm**: Decision-making for two-player games
    - **Alpha-Beta Pruning**: Optimization technique that reduces search space
    
    ### How to Use:
    1. Click "Run Minimax" or "Run Alpha-Beta Pruning"
    2. Watch the animation
    3. Compare the statistics
    4. Try "Generate Random Tree" for different scenarios
    """)
    
    st.header("Algorithm Info")
    st.markdown("""
    **Minimax**: Assumes both players play optimally. MAX maximizes score, MIN minimizes it.
    
    **Alpha-Beta Pruning**: Eliminates branches that won't affect the final decision. 
    When β ≤ α, we can prune that branch.
    """)

# The HTML code for the visualization
html_code = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        :root {
            --color-white: rgba(255, 255, 255, 1);
            --color-cream-50: rgba(252, 252, 249, 1);
            --color-cream-100: rgba(255, 255, 253, 1);
            --color-gray-200: rgba(245, 245, 245, 1);
            --color-gray-300: rgba(167, 169, 169, 1);
            --color-slate-500: rgba(98, 108, 113, 1);
            --color-brown-600: rgba(94, 82, 64, 1);
            --color-charcoal-700: rgba(31, 33, 33, 1);
            --color-charcoal-800: rgba(38, 40, 40, 1);
            --color-slate-900: rgba(19, 52, 59, 1);
            --color-teal-300: rgba(50, 184, 198, 1);
            --color-teal-500: rgba(33, 128, 141, 1);
            --color-teal-600: rgba(29, 116, 128, 1);
            --color-red-400: rgba(255, 84, 89, 1);
            --color-red-500: rgba(192, 21, 47, 1);
            --color-orange-400: rgba(230, 129, 97, 1);
            
            --color-brown-600-rgb: 94, 82, 64;
            --color-teal-500-rgb: 33, 128, 141;
            --color-slate-900-rgb: 19, 52, 59;
            
            --color-background: var(--color-cream-50);
            --color-surface: var(--color-cream-100);
            --color-text: var(--color-slate-900);
            --color-text-secondary: var(--color-slate-500);
            --color-primary: var(--color-teal-500);
            --color-primary-hover: var(--color-teal-600);
            --color-border: rgba(var(--color-brown-600-rgb), 0.2);
            --color-card-border: rgba(var(--color-brown-600-rgb), 0.12);
            --color-error: var(--color-red-500);
            
            --font-family-base: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            --font-size-sm: 12px;
            --font-size-base: 14px;
            --font-size-lg: 16px;
            --font-size-xl: 18px;
            --font-size-2xl: 20px;
            --font-size-3xl: 24px;
            --space-8: 8px;
            --space-12: 12px;
            --space-16: 16px;
            --space-20: 20px;
            --space-24: 24px;
            --radius-base: 8px;
            --radius-lg: 12px;
            --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-family-base);
            background-color: transparent;
            color: var(--color-text);
            padding: var(--space-16);
            line-height: 1.5;
        }

        .controls {
            background: var(--color-surface);
            border: 1px solid var(--color-card-border);
            border-radius: var(--radius-lg);
            padding: var(--space-20);
            margin-bottom: var(--space-24);
            box-shadow: var(--shadow-sm);
        }

        .button-group {
            display: flex;
            gap: var(--space-12);
            flex-wrap: wrap;
            margin-bottom: var(--space-16);
        }

        button {
            padding: var(--space-12) var(--space-20);
            background: var(--color-primary);
            color: white;
            border: none;
            border-radius: var(--radius-base);
            font-size: var(--font-size-base);
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
        }

        button:hover {
            background: var(--color-primary-hover);
            transform: translateY(-1px);
        }

        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
        }

        button.secondary {
            background: rgba(var(--color-brown-600-rgb), 0.12);
            color: var(--color-text);
        }

        button.secondary:hover {
            background: rgba(var(--color-brown-600-rgb), 0.2);
        }

        .input-group {
            display: flex;
            gap: var(--space-16);
            align-items: center;
            flex-wrap: wrap;
        }

        label {
            font-size: var(--font-size-sm);
            font-weight: 500;
            color: var(--color-text-secondary);
        }

        input[type="text"] {
            padding: var(--space-8) var(--space-12);
            border: 1px solid var(--color-border);
            border-radius: var(--radius-base);
            font-size: var(--font-size-base);
            background: white;
            color: var(--color-text);
            font-family: monospace;
            min-width: 300px;
        }

        .canvas-container {
            background: var(--color-surface);
            border: 1px solid var(--color-card-border);
            border-radius: var(--radius-lg);
            padding: var(--space-20);
            box-shadow: var(--shadow-sm);
            overflow: auto;
        }

        canvas {
            display: block;
            margin: 0 auto;
        }

        .legend {
            display: flex;
            gap: var(--space-24);
            justify-content: center;
            margin-top: var(--space-20);
            flex-wrap: wrap;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: var(--space-8);
            font-size: var(--font-size-sm);
        }

        .legend-box {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 2px solid var(--color-border);
        }

        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: var(--space-16);
            margin-top: var(--space-16);
            background: var(--color-surface);
            padding: var(--space-20);
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-card-border);
        }

        .stat-item {
            background: white;
            padding: var(--space-16);
            border-radius: var(--radius-base);
            border: 1px solid var(--color-border);
            text-align: center;
        }

        .stat-value {
            font-size: var(--font-size-2xl);
            font-weight: 600;
            color: var(--color-primary);
        }

        .stat-label {
            font-size: var(--font-size-sm);
            color: var(--color-text-secondary);
            margin-top: var(--space-8);
        }
    </style>
</head>
<body>
    <div class="controls">
        <div class="button-group">
            <button id="runMinimax">Run Minimax</button>
            <button id="runAlphaBeta">Run Alpha-Beta Pruning</button>
            <button id="stepBtn" disabled>Step Forward</button>
            <button id="resetBtn" class="secondary">Reset</button>
            <button id="generateTree" class="secondary">Generate Random Tree</button>
        </div>
        <div class="input-group">
            <label for="treeValues">Leaf Values (comma-separated):</label>
            <input type="text" id="treeValues" value="3, 12, 8, 2, 4, 6, 14, 5, 2, 1, 9, 11, 7, 10, 4, 13">
        </div>
    </div>

    <div class="canvas-container">
        <canvas id="treeCanvas"></canvas>
    </div>

    <div class="legend">
        <div class="legend-item">
            <div class="legend-box" style="background: #e3f2fd;"></div>
            <span>Current Node</span>
        </div>
        <div class="legend-item">
            <div class="legend-box" style="background: #c8e6c9;"></div>
            <span>MAX Node</span>
        </div>
        <div class="legend-item">
            <div class="legend-box" style="background: #ffcdd2;"></div>
            <span>MIN Node</span>
        </div>
        <div class="legend-item">
            <div class="legend-box" style="background: #ffeb3b;"></div>
            <span>Best Path</span>
        </div>
        <div class="legend-item">
            <div class="legend-box" style="background: #bdbdbd; opacity: 0.5;"></div>
            <span>Pruned</span>
        </div>
    </div>

    <div class="stats">
        <div class="stat-item">
            <div class="stat-value" id="nodesEvaluated">0</div>
            <div class="stat-label">Nodes Evaluated</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" id="nodesPruned">0</div>
            <div class="stat-label">Nodes Pruned</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" id="bestValue">-</div>
            <div class="stat-label">Best Value</div>
        </div>
        <div class="stat-item">
            <div class="stat-value" id="efficiency">-</div>
            <div class="stat-label">Efficiency Gain</div>
        </div>
    </div>

    <script>
        const canvas = document.getElementById('treeCanvas');
        const ctx = canvas.getContext('2d');
        const treeValuesInput = document.getElementById('treeValues');
        
        let tree = null;
        let animationSteps = [];
        let currentStep = 0;
        let isAnimating = false;

        class TreeNode {
            constructor(value = null, isLeaf = false) {
                this.value = value;
                this.isLeaf = isLeaf;
                this.children = [];
                this.alpha = -Infinity;
                this.beta = Infinity;
                this.visited = false;
                this.pruned = false;
                this.isBestPath = false;
                this.x = 0;
                this.y = 0;
                this.depth = 0;
            }
        }

        function buildTree(values) {
            const leafCount = values.length;
            const root = new TreeNode();
            root.depth = 0;
            
            const queue = [root];
            const levels = Math.ceil(Math.log2(leafCount)) + 1;
            let leafIndex = 0;
            
            while (queue.length > 0 && leafIndex < leafCount) {
                const node = queue.shift();
                
                if (node.depth === levels - 2) {
                    for (let i = 0; i < 2 && leafIndex < leafCount; i++) {
                        const leaf = new TreeNode(values[leafIndex], true);
                        leaf.depth = node.depth + 1;
                        node.children.push(leaf);
                        leafIndex++;
                    }
                } else {
                    for (let i = 0; i < 2; i++) {
                        const child = new TreeNode();
                        child.depth = node.depth + 1;
                        node.children.push(child);
                        queue.push(child);
                    }
                }
            }
            
            return root;
        }

        function minimax(node, depth, isMaximizing, steps) {
            steps.push({
                node: node,
                type: 'visit',
                isMaximizing: isMaximizing,
                alpha: node.alpha,
                beta: node.beta
            });
            
            if (node.isLeaf) {
                node.visited = true;
                return node.value;
            }
            
            if (isMaximizing) {
                let maxVal = -Infinity;
                for (let child of node.children) {
                    const val = minimax(child, depth + 1, false, steps);
                    maxVal = Math.max(maxVal, val);
                }
                node.value = maxVal;
                node.visited = true;
                steps.push({
                    node: node,
                    type: 'backtrack',
                    value: maxVal
                });
                return maxVal;
            } else {
                let minVal = Infinity;
                for (let child of node.children) {
                    const val = minimax(child, depth + 1, true, steps);
                    minVal = Math.min(minVal, val);
                }
                node.value = minVal;
                node.visited = true;
                steps.push({
                    node: node,
                    type: 'backtrack',
                    value: minVal
                });
                return minVal;
            }
        }

        function alphaBeta(node, depth, alpha, beta, isMaximizing, steps) {
            node.alpha = alpha;
            node.beta = beta;
            
            steps.push({
                node: node,
                type: 'visit',
                isMaximizing: isMaximizing,
                alpha: alpha,
                beta: beta
            });
            
            if (node.isLeaf) {
                node.visited = true;
                return node.value;
            }
            
            if (isMaximizing) {
                let maxVal = -Infinity;
                for (let child of node.children) {
                    const val = alphaBeta(child, depth + 1, alpha, beta, false, steps);
                    maxVal = Math.max(maxVal, val);
                    alpha = Math.max(alpha, val);
                    
                    if (beta <= alpha) {
                        for (let i = node.children.indexOf(child) + 1; i < node.children.length; i++) {
                            markPruned(node.children[i]);
                            steps.push({
                                node: node.children[i],
                                type: 'prune',
                                alpha: alpha,
                                beta: beta
                            });
                        }
                        break;
                    }
                }
                node.value = maxVal;
                node.visited = true;
                steps.push({
                    node: node,
                    type: 'backtrack',
                    value: maxVal,
                    alpha: alpha,
                    beta: beta
                });
                return maxVal;
            } else {
                let minVal = Infinity;
                for (let child of node.children) {
                    const val = alphaBeta(child, depth + 1, alpha, beta, true, steps);
                    minVal = Math.min(minVal, val);
                    beta = Math.min(beta, val);
                    
                    if (beta <= alpha) {
                        for (let i = node.children.indexOf(child) + 1; i < node.children.length; i++) {
                            markPruned(node.children[i]);
                            steps.push({
                                node: node.children[i],
                                type: 'prune',
                                alpha: alpha,
                                beta: beta
                            });
                        }
                        break;
                    }
                }
                node.value = minVal;
                node.visited = true;
                steps.push({
                    node: node,
                    type: 'backtrack',
                    value: minVal,
                    alpha: alpha,
                    beta: beta
                });
                return minVal;
            }
        }

        function markPruned(node) {
            node.pruned = true;
            for (let child of node.children) {
                markPruned(child);
            }
        }

        function calculatePositions(node, x, y, horizontalSpacing, level = 0) {
            node.x = x;
            node.y = y;
            
            if (node.children.length === 0) return;
            
            const totalWidth = (node.children.length - 1) * horizontalSpacing;
            let startX = x - totalWidth / 2;
            
            for (let i = 0; i < node.children.length; i++) {
                calculatePositions(
                    node.children[i],
                    startX + i * horizontalSpacing,
                    y + 100,
                    horizontalSpacing / 2,
                    level + 1
                );
            }
        }

        function drawTree(highlightNode = null) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            function draw(node) {
                for (let child of node.children) {
                    ctx.strokeStyle = child.pruned ? '#bdbdbd' : '#626f78';
                    ctx.lineWidth = child.isBestPath ? 3 : 1;
                    ctx.globalAlpha = child.pruned ? 0.3 : 1;
                    ctx.beginPath();
                    ctx.moveTo(node.x, node.y);
                    ctx.lineTo(child.x, child.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;
                    draw(child);
                }
                
                const isMax = node.depth % 2 === 0;
                let fillColor = isMax ? '#c8e6c9' : '#ffcdd2';
                
                if (node === highlightNode) {
                    fillColor = '#e3f2fd';
                }
                if (node.isBestPath) {
                    fillColor = '#ffeb3b';
                }
                if (node.pruned) {
                    fillColor = '#bdbdbd';
                    ctx.globalAlpha = 0.3;
                }
                
                ctx.fillStyle = fillColor;
                ctx.beginPath();
                ctx.arc(node.x, node.y, 25, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = '#134252';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.fillStyle = '#134252';
                ctx.font = 'bold 14px sans-serif';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                
                if (node.value !== null && node.visited) {
                    ctx.fillText(node.value, node.x, node.y);
                }
                
                if (!node.isLeaf && (node.alpha !== -Infinity || node.beta !== Infinity)) {
                    ctx.font = '10px monospace';
                    ctx.fillStyle = '#626f78';
                    const alphaText = node.alpha === -Infinity ? '-∞' : node.alpha;
                    const betaText = node.beta === Infinity ? '∞' : node.beta;
                    ctx.fillText(`α:${alphaText}`, node.x, node.y - 35);
                    ctx.fillText(`β:${betaText}`, node.x, node.y + 35);
                }
                
                ctx.globalAlpha = 1;
            }
            
            if (tree) {
                draw(tree);
            }
        }

        function countNodes(node) {
            let count = node.visited ? 1 : 0;
            for (let child of node.children) {
                count += countNodes(child);
            }
            return count;
        }

        function countPruned(node) {
            let count = node.pruned ? 1 : 0;
            for (let child of node.children) {
                count += countPruned(child);
            }
            return count;
        }

        function initializeTree() {
            const values = treeValuesInput.value.split(',').map(v => parseInt(v.trim()));
            tree = buildTree(values);
            
            canvas.width = 1200;
            canvas.height = 400;
            
            calculatePositions(tree, canvas.width / 2, 50, 600);
            drawTree();
            
            currentStep = 0;
            animationSteps = [];
            
            document.getElementById('nodesEvaluated').textContent = '0';
            document.getElementById('nodesPruned').textContent = '0';
            document.getElementById('bestValue').textContent = '-';
            document.getElementById('efficiency').textContent = '-';
        }

        function updateStats(isAlphaBeta = false) {
            const evaluated = countNodes(tree);
            const pruned = countPruned(tree);
            
            document.getElementById('nodesEvaluated').textContent = evaluated;
            document.getElementById('nodesPruned').textContent = pruned;
            document.getElementById('bestValue').textContent = tree.value !== null ? tree.value : '-';
            
            if (isAlphaBeta && pruned > 0) {
                const totalNodes = evaluated + pruned;
                const efficiency = ((pruned / totalNodes) * 100).toFixed(1) + '%';
                document.getElementById('efficiency').textContent = efficiency;
            }
        }

        document.getElementById('runMinimax').addEventListener('click', () => {
            initializeTree();
            animationSteps = [];
            minimax(tree, 0, true, animationSteps);
            currentStep = 0;
            isAnimating = true;
            document.getElementById('stepBtn').disabled = false;
            playAnimation(false);
        });

        document.getElementById('runAlphaBeta').addEventListener('click', () => {
            initializeTree();
            animationSteps = [];
            alphaBeta(tree, 0, -Infinity, Infinity, true, animationSteps);
            currentStep = 0;
            isAnimating = true;
            document.getElementById('stepBtn').disabled = false;
            playAnimation(true);
        });

        document.getElementById('stepBtn').addEventListener('click', () => {
            if (currentStep < animationSteps.length) {
                executeStep(animationSteps[currentStep]);
                currentStep++;
                drawTree(animationSteps[currentStep - 1].node);
                
                if (currentStep >= animationSteps.length) {
                    document.getElementById('stepBtn').disabled = true;
                }
            }
        });

        document.getElementById('resetBtn').addEventListener('click', () => {
            initializeTree();
            document.getElementById('stepBtn').disabled = true;
        });

        document.getElementById('generateTree').addEventListener('click', () => {
            const size = 16;
            const values = Array.from({length: size}, () => Math.floor(Math.random() * 15) + 1);
            treeValuesInput.value = values.join(', ');
            initializeTree();
        });

        function executeStep(step) {
            // Step execution is already handled by the algorithm
        }

        function playAnimation(isAlphaBeta) {
            let stepIndex = 0;
            const interval = setInterval(() => {
                if (stepIndex >= animationSteps.length) {
                    clearInterval(interval);
                    updateStats(isAlphaBeta);
                    document.getElementById('stepBtn').disabled = true;
                    return;
                }
                
                drawTree(animationSteps[stepIndex].node);
                updateStats(isAlphaBeta);
                stepIndex++;
                currentStep = stepIndex;
            }, 500);
        }

        initializeTree();
    </script>
</body>
</html>
"""

# Embed the HTML visualization
components.html(html_code, height=800, scrolling=True)

# Footer
st.markdown("---")
st.markdown("### 📚 Learn More")
col1, col2 = st.columns(2)

with col1:
    st.markdown("""
    **Minimax Algorithm:**
    - Used in two-player games
    - Assumes optimal play from both sides
    - Explores entire game tree
    - Time complexity: O(b^d)
    """)

with col2:
    st.markdown("""
    **Alpha-Beta Pruning:**
    - Optimization of Minimax
    - Reduces nodes evaluated
    - Same result as Minimax
    - Can reduce to O(b^(d/2)) in best case
    """)
