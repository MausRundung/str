// parser.js
/**
 * Logic to parse the Str Analysis raw text format
 */
function parseToGraph(text) {
    let projectPath = null;
    let localRegistry = [];
    const root = { name: "ROOT", type: "dir", children: {}, path: "ROOT" };
    let activeFile = null;
    const lines = text.split('\n');

    // 1. Identify base path
    for (const line of lines) {
        const raw = line.trim();
        const basePathMatch = raw.match(/=== ANALYZING ARCHITECTURE: (.*) ===/);
        if (basePathMatch && basePathMatch[1]) {
            projectPath = basePathMatch[1].trim().replace(/\\/g, '/');
            break;
        }
    }

    // 2. Build Tree
    lines.forEach(line => {
        const raw = line.trim();
        if (!raw || raw.startsWith('===') || raw.startsWith('[MODELS]') || (raw.startsWith('[STATE ]') && raw.includes("DbContext"))) return;

        if (raw.startsWith('FILE:')) {
            const match = raw.match(/FILE: \\(.*) \((\d+) lines\)/);
            if (match) {
                const pathStr = "ROOT\\" + match[1];
                const lineCount = match[2];
                const parts = pathStr.split('\\');
                let curr = root;
                
                parts.forEach((part, i) => {
                    if (i === parts.length - 1) {
                        const fileObj = { 
                            id: pathStr, name: part, lines: lineCount, 
                            routes: [], sockets: { emits: [], ons: [] }, imports: [], 
                            tables: [], state: [], exports: [], types: [] 
                        };
                        curr.children[part] = fileObj;
                        localRegistry.push(fileObj);
                        activeFile = fileObj;
                    } else {
                        if (!curr.children[part]) curr.children[part] = { name: part, type: "dir", children: {} };
                        curr = curr.children[part];
                    }
                });
            }
        } else if (raw.startsWith('[DIR]')) {
            activeFile = null;
        } else if (activeFile) {
            const tagMatch = raw.match(/^\s*\[\s*([A-Z]+)\s*\]/);
            if (!tagMatch) return;
            
            const tag = tagMatch[1];
            const content = raw.substring(raw.indexOf(']') + 1).trim();
            const items = content.split(',').map(s => s.trim()).filter(Boolean);

            switch (tag) {
                case 'ROUTES':
                    const routeMatches = content.match(/\[(.*?)\] (.*?) -> (.*?)(?=\s*\[|$)/g);
                    if (routeMatches) {
                        activeFile.routes = routeMatches.map(m => {
                            const parts = m.match(/\[(.*?)\] (.*?) -> (.*)/);
                            return parts ? { method: parts[1], path: parts[2] } : null;
                        }).filter(Boolean);
                    }
                    break;
                case 'SOCKET':
                    items.forEach(item => {
                        if (item.startsWith('emit:')) activeFile.sockets.emits.push(item.replace('emit:', '').trim());
                        if (item.startsWith('on:')) activeFile.sockets.ons.push(item.replace('on:', '').trim());
                    });
                    break;
                case 'TABLES': activeFile.tables = items; break;
                case 'STATE': activeFile.state = items; break;
                case 'IMPORTS': activeFile.imports = items; break;
                case 'EXPORTS': activeFile.exports = items; break;
                case 'TYPES': activeFile.types = items; break;
            }
        }
    });

    return { root, projectPath, registry: localRegistry };
}