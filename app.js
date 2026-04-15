// app.js
/**
 * Global State & Orchestration
 */
let fileRegistry =[];
let relationLinks =[];
let activeFileDomId = null;
let activeChips = new Set();
let projectBasePath = null;

// New: Keep track of global structures unattached to files
let globalModelsRegistry = []; 
let globalStateRegistry =[];

// Initialization
document.addEventListener('DOMContentLoaded', () => { lucide.createIcons(); });
window.addEventListener('resize', drawArcs);

function buildSystem() {
    const txt = document.getElementById('data-input').value;
    if (!txt) return;

    document.getElementById('input-section').classList.remove('visible');
    
    const parsed = parseToGraph(txt);
    fileRegistry = parsed.registry;
    projectBasePath = parsed.projectPath;
    globalModelsRegistry = parsed.globalModels;
    globalStateRegistry = parsed.globalState;

    document.getElementById('tree-container').innerHTML = renderTree(parsed.root);
    
    lucide.createIcons();
    mapRelations();
    setTimeout(drawArcs, 200);
}

function mapRelations() {
    const consolidatedLinks = new Map();
    const pathMap = new Map();
    
    // 1. Build an exact lookup mapping using relative paths without extensions
    fileRegistry.forEach(f => {
        const idWithoutExt = f.id.replace(/\.[^/.\\]+$/, "");
        pathMap.set(idWithoutExt, f);
        
        if (idWithoutExt.endsWith('\\index')) {
            pathMap.set(idWithoutExt.replace(/\\index$/, ""), f);
        }
    });

    // 2. Performance Fix: Pre-compute socket listeners
    const socketOnMap = new Map();
    fileRegistry.forEach(f => {
        f.sockets.ons.forEach(evt => {
            if (!socketOnMap.has(evt)) socketOnMap.set(evt, new Set());
            socketOnMap.get(evt).add(f);
        });
    });

    const addReason = (source, target, reason) => {
        const key = [source.id, target.id].sort().join('--');
        if (!consolidatedLinks.has(key)) {
            consolidatedLinks.set(key, { 
                source: 'f_' + btoa(source.id).replace(/[^a-zA-Z0-9]/g, ''), 
                target: 'f_' + btoa(target.id).replace(/[^a-zA-Z0-9]/g, ''),
                sourcePath: source.id,
                targetPath: target.id,
                reasons:[]
            });
        }
        consolidatedLinks.get(key).reasons.push(reason);
    };

    const resolveImportPath = (currentFilePath, importPath) => {
        if (!importPath.startsWith('.')) return null; 
        
        const currentParts = currentFilePath.replace(/\\/g, '/').split('/');
        currentParts.pop(); 
        
        const importParts = importPath.split('/');
        for (let part of importParts) {
            if (part === '.') continue;
            if (part === '..') {
                if (currentParts.length > 1) currentParts.pop(); 
            } else {
                currentParts.push(part);
            }
        }
        return currentParts.join('\\');
    };

    fileRegistry.forEach(src => {
        src.imports.forEach(imp => {
            const resolvedPath = resolveImportPath(src.id, imp);
            if (resolvedPath) {
                const cleanTargetId = resolvedPath.replace(/\.[^/.\\]+$/, "");
                const tgt = pathMap.get(cleanTargetId);
                
                if (tgt && tgt.id !== src.id) {
                    addReason(src, tgt, { type: 'import', detail: imp, direction: 'out' });
                }
            }
        });

        src.sockets.emits.forEach(emitEvt => {
            const targets = socketOnMap.get(emitEvt);
            if (targets) {
                targets.forEach(tgt => {
                    if (src.id !== tgt.id) {
                        addReason(src, tgt, { type: 'socket', detail: emitEvt, direction: 'out' });
                    }
                });
            }
        });
    });
    
    relationLinks = Array.from(consolidatedLinks.values());
}

// Interaction Handlers
function handleFileCardClick(event) {
    if (event.shiftKey) {
        event.preventDefault();
        const card = event.currentTarget;
        if (!projectBasePath) return alert("Base path unknown.");
        const relativePath = card.dataset.path.replace(/^ROOT\\/, '').replace(/\\/g, '/'); 
        window.location.href = `trae://file/${projectBasePath}/${relativePath}`;
    }
}

function handleSelect(domId) {
    if (activeFileDomId === domId) { clearSelection(); return; }
    activeFileDomId = domId;
    refreshManifest();
}

function refreshManifest() {
    if (!activeFileDomId) return;
    const domId = activeFileDomId;
    const cardEl = document.getElementById(domId);
    if (!cardEl) return;
    
    const filePath = cardEl.dataset.path;
    const file = fileRegistry.find(f => f.id === filePath);
    
    document.body.classList.add('focus-mode');
    document.getElementById('reset-btn').style.display = 'flex';
    document.getElementById('copy-btn').disabled = false;
    
    const showImp = document.getElementById('opt-imports').checked;
    const showSoc = document.getElementById('opt-sockets').checked;
    
    const connectedLinks = relationLinks.filter(link => {
        const hasSocket = link.reasons.some(r => r.type === 'socket');
        const hasImport = link.reasons.some(r => r.type === 'import');
        const relevant = (link.sourcePath === filePath || link.targetPath === filePath);
        return relevant && ((showImp && hasImport) || (showSoc && hasSocket));
    });

    const relatedDomIds = new Set([domId]);
    connectedLinks.forEach(link => {
        relatedDomIds.add(link.source);
        relatedDomIds.add(link.target);
    });
    
    document.querySelectorAll('.file-card').forEach(el => {
        el.classList.remove('isolated-target', 'active-focus', 'hidden-node');
        if (el.id === domId) el.classList.add('isolated-target');
        else if (relatedDomIds.has(el.id)) el.classList.add('active-focus');
        else el.classList.add('hidden-node');
    });

    document.querySelectorAll('.folder-block').forEach(f => {
        f.classList.toggle('hidden-node', !f.querySelector('.file-card:not(.hidden-node)'));
    });
    
    let h = `<div class="manifest-filepath">${file.id.replace(/^ROOT\\/, '').replace(/\\/g, '/')} <span class="manifest-lines">(${file.lines} lines)</span></div>`;
    
    const outboundDeps = [];
    const inboundDeps =[];

    // Bundle exactly formatted filepaths for UI Rendering
    relationLinks.forEach(link => {
        if (link.reasons.some(r => r.type === 'import')) {
            if (link.sourcePath === filePath) {
                const targetFile = fileRegistry.find(f => f.id === link.targetPath);
                if (targetFile) outboundDeps.push({ 
                    name: targetFile.name, 
                    path: targetFile.id.replace(/^ROOT\\/, '').replace(/\\/g, '/'),
                    domId: link.target 
                });
            } else if (link.targetPath === filePath) {
                const sourceFile = fileRegistry.find(f => f.id === link.sourcePath);
                if (sourceFile) inboundDeps.push({ 
                    name: sourceFile.name, 
                    path: sourceFile.id.replace(/^ROOT\\/, '').replace(/\\/g, '/'),
                    domId: link.source 
                });
            }
        }
    });

    const renderSection = (title, items, icon, tagType, isRelation = false) => {
        if (!items || items.length === 0) return '';
        if (tagType === 'sockets' && items.emits.length === 0 && items.ons.length === 0) return '';
        
        let tags = "";
        if (isRelation) {
            tags = items.map(rel => `<span class="data-tag relation-node" onclick="handleSelect('${rel.domId}')" title="${rel.path}"><i data-lucide="file-text" size="10"></i> ${rel.name} <span style="opacity: 0.6; margin-left: 4px; font-weight: normal; font-size: 0.9em;">(${rel.path})</span></span>`).join('');
        } else if (tagType === 'sockets') {
            tags = items.emits.map(e => `<span class="data-tag socket-emit">EMIT: ${e}</span>`).join('') +
                   items.ons.map(o => `<span class="data-tag socket-on">ON: ${o}</span>`).join('');
        } else {
            tags = items.map(i => `<span class="data-tag ${tagType}">${tagType === 'routes' ? `[${i.method}] ${i.path}${i.handler ? ` -> ${i.handler}`:''}` : i}</span>`).join('');
        }
        return `
            <div class="manifest-section">
                <div class="manifest-header"><i data-lucide="${icon}" size="12"></i> ${title}</div>
                <div class="tag-container">${tags}</div>
            </div>`;
    };

    h += renderSection("Dependencies (Imports)", outboundDeps, "box-select", 'relation', true);
    h += renderSection("Reliant Components (Used By)", inboundDeps, "layers", 'relation', true);
    h += renderSection("API Routes", file.routes, "external-link", 'routes');
    h += renderSection("Socket Events", file.sockets, "radio-receiver", 'sockets');
    h += renderSection("Database Tables", file.tables, "database", 'table');
    h += renderSection("Exports", file.exports, "package-export", 'export');

    document.getElementById('inspector-content').innerHTML = h;
    lucide.createIcons();
    
    requestAnimationFrame(() => {
        cardEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        drawArcs();
    });
}

function clearSelection() {
    activeFileDomId = null;
    document.body.classList.remove("focus-mode");
    document.getElementById("reset-btn").style.display = "none";
    document.getElementById("copy-btn").disabled = true;
    document.querySelectorAll(".file-card, .folder-block").forEach(el => el.classList.remove("hidden-node", "isolated-target", "active-focus"));
    
    let defaultHtml = "Select a file for isolation analysis.";
    if (globalModelsRegistry.length > 0) {
        defaultHtml += `<div style="margin-top:20px; font-size:11px; color:#888;">Project contains ${globalModelsRegistry.length} database models.</div>`;
    }

    document.getElementById("inspector-content").innerHTML = defaultHtml;
    filterSystem();
}

function filterSystem() {
    const query = document.getElementById("search-input").value.toLowerCase();
    document.querySelectorAll(".file-card").forEach(card => {
        const path = card.getAttribute("data-path").toLowerCase();
        const content = card.innerText.toLowerCase();
        let matchChip = activeChips.size === 0 || Array.from(activeChips).some(c => card.classList.contains(c));
        card.classList.toggle("hidden-node", !matchChip || (!path.includes(query) && !content.includes(query)));
    });
    document.querySelectorAll(".folder-block").forEach(f => {
        f.classList.toggle("hidden-node", !f.querySelector(".file-card:not(.hidden-node)"));
    });
    drawArcs();
}

function toggleChip(el, cls) { 
    el.classList.toggle('active'); 
    if(activeChips.has(cls)) activeChips.delete(cls); else activeChips.add(cls);
    filterSystem();
}

function toggleSidebar() { 
    document.body.classList.toggle('sidebar-collapsed'); 
    setTimeout(drawArcs, 300); 
}

function openNew() { 
    document.getElementById('input-section').classList.add('visible'); 
}

function handleContentToggle(cls) {
    document.body.classList.toggle(cls);
    drawArcs();
}

function copySystemReport() {
    if (!activeFileDomId) return;
    
    const cardEl = document.getElementById(activeFileDomId);
    if (!cardEl) return;
    
    const filePath = cardEl.dataset.path;
    const file = fileRegistry.find(f => f.id === filePath);
    if (!file) return;

    const outboundDeps =[];
    const inboundDeps =[];

    // Directly bind the formatted file path into the generated copy list
    relationLinks.forEach(link => {
        if (link.reasons.some(r => r.type === 'import')) {
            if (link.sourcePath === filePath) {
                const targetFile = fileRegistry.find(f => f.id === link.targetPath);
                if (targetFile) outboundDeps.push(`${targetFile.name} (${targetFile.id.replace(/^ROOT\\/, '').replace(/\\/g, '/')})`);
            } else if (link.targetPath === filePath) {
                const sourceFile = fileRegistry.find(f => f.id === link.sourcePath);
                if (sourceFile) inboundDeps.push(`${sourceFile.name} (${sourceFile.id.replace(/^ROOT\\/, '').replace(/\\/g, '/')})`);
            }
        }
    });

    let report = `FILE MANIFEST: ${file.id.replace(/^ROOT\\/, '').replace(/\\/g, '/')} (${file.lines} lines)\n`;
    report += `=========================================================\n\n`;

    if (outboundDeps.length > 0) {
        report += `Dependencies (Imports):\n${outboundDeps.map(d => `  - ${d}`).join('\n')}\n\n`;
    }
    
    if (inboundDeps.length > 0) {
        report += `Reliant Components (Used By):\n${inboundDeps.map(d => `  - ${d}`).join('\n')}\n\n`;
    }

    if (file.routes && file.routes.length > 0) {
        report += `API Routes:\n${file.routes.map(r => `  -[${r.method}] ${r.path}${r.handler ? ` -> ${r.handler}`:''}`).join('\n')}\n\n`;
    }

    if (file.sockets && (file.sockets.emits.length > 0 || file.sockets.ons.length > 0)) {
        report += `Socket Events:\n`;
        file.sockets.emits.forEach(e => report += `  - EMIT: ${e}\n`);
        file.sockets.ons.forEach(o => report += `  - ON: ${o}\n`);
        report += `\n`;
    }

    if (file.tables && file.tables.length > 0) {
        report += `Database Tables:\n${file.tables.map(t => `  - ${t}`).join('\n')}\n\n`;
    }

    if (file.exports && file.exports.length > 0) {
        report += `Exports:\n${file.exports.map(e => `  - ${e}`).join('\n')}\n\n`;
    }

    navigator.clipboard.writeText(report.trim()).then(() => {
        const b = document.getElementById("copy-btn");
        b.innerText = "COPIED";
        setTimeout(() => b.innerText = "COPY", 2000);
    }).catch(err => {
        console.error("Failed to copy report: ", err);
        alert("Clipboard copy failed. Please ensure you are running in a secure context (HTTPS/localhost).");
    });
}

function refreshSelection() {
    if (activeFileDomId) refreshManifest();
}