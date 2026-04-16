/**
 * Logic to parse the Str v4.1 Analysis raw text format
 */
function parseToGraph(text) {
    let projectPath = null;
    let localRegistry =[];
    
    const root = { name: "ROOT", type: "dir", children: {}, path: "ROOT" };
    let activeFile = null;
    const lines = text.split('\n');

    for (const line of lines) {
        const raw = line.trim();
        const basePathMatch = raw.match(/=== ADVANCED ARCHITECTURE SCAN: (.*) ===/);
        if (basePathMatch && basePathMatch[1]) {
            projectPath = basePathMatch[1].trim().replace(/\\/g, '/');
            break;
        }
    }

    lines.forEach(line => {
        const raw = line.trim();
        if (!raw || raw.startsWith('===')) return;

        if (raw.startsWith('FILE:')) {
            const match = raw.match(/FILE: [\\/](.*?) \((\d+) lines\)/);
            if (match) {
                const pathStr = "ROOT\\" + match[1].replace(/\//g, '\\');
                const lineCount = parseInt(match[2], 10);
                const parts = pathStr.split('\\');
                let curr = root;
                
                parts.forEach((part, i) => {
                    if (i === parts.length - 1) {
                        const fileObj = { 
                            id: pathStr, name: part, lines: lineCount, 
                            meta: [], data: [], routes: [], exports: [], imports: [], unused:[]
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
        } else if (activeFile) {
            // Match any tag like [META   ], [DATA   ], [ROUTES ], [EXPORTS], [IMPORTS], [UNUSED ]
            const tagMatch = raw.match(/^\s*\[\s*(META|DATA|ROUTES|EXPORTS|IMPORTS|UNUSED)\s*\]/);
            if (!tagMatch) return;
            
            const tag = tagMatch[1];
            const content = raw.substring(raw.indexOf(']') + 1).trim();

            if (tag === 'ROUTES') {
                // v4.1 routes are separated by ' | ', like: [GET] /api/health | [POST] /user
                const routeChunks = content.split(' | ').filter(Boolean);
                routeChunks.forEach(chunk => {
                    const rMatch = chunk.match(/\[(.*?)\]\s*(.*)/);
                    if (rMatch) {
                        activeFile.routes.push({
                            method: rMatch[1],
                            path: rMatch[2].trim()
                        });
                    } else {
                        activeFile.routes.push({ method: "ANY", path: chunk.trim() });
                    }
                });
            } else {
                // v4.1 Everything else is separated by commas
                const items = content.split(',').map(s => s.trim()).filter(Boolean);
                if (tag === 'META') activeFile.meta = items;
                if (tag === 'DATA') activeFile.data = items;
                if (tag === 'EXPORTS') activeFile.exports = items;
                if (tag === 'IMPORTS') activeFile.imports = items;
                if (tag === 'UNUSED') activeFile.unused = items;
            }
        }
    });

    return { root, projectPath, registry: localRegistry };
}