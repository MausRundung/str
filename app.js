// app.js
/**
 * Global State & Orchestration
 */
let fileRegistry = [];
let relationLinks = [];
let activeFileDomId = null;
let activeChips = new Set();
let projectBasePath = null;

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

    document.getElementById('tree-container').innerHTML = renderTree(parsed.root);
    
    lucide.createIcons();
    mapRelations();
    setTimeout(drawArcs, 200);
}

function mapRelations() {
    const consolidatedLinks = new Map();
    const nameMap = new Map();
    
    // Create a robust mapping of filename (without extension) to registry entry
    fileRegistry.forEach(f => {
        const baseName = f.name.replace(/\.[^/.]+$/, "");
        nameMap.set(baseName, f);
        // Also map by full ID for direct matches
        nameMap.set(f.id, f);
    });

    const addReason = (source, target, reason) => {
        const key = [source.id, target.id].sort().join('--');
        if (!consolidatedLinks.has(key)) {
            consolidatedLinks.set(key, { 
                source: 'f_' + btoa(source.id).replace(/[^a-zA-Z0-9]/g, ''), 
                target: 'f_' + btoa(target.id).replace(/[^a-zA-Z0-9]/g, ''),
                sourcePath: source.id,
                targetPath: target.id,
                reasons: []
            });
        }
        consolidatedLinks.get(key).reasons.push(reason);
    };

    fileRegistry.forEach(src => {
        // Map Imports (Outbound)
        src.imports.forEach(imp => {
            const tgtName = imp.split('/').pop().replace(/\.[^/.]+$/, "");
            const tgt = nameMap.get(tgtName);
            if (tgt && tgt.id !== src.id) {
                addReason(src, tgt, { type: 'import', detail: imp, direction: 'out' });
            }
        });
        // Map Sockets
        src.sockets.emits.forEach(emitEvt => {
            fileRegistry.forEach(tgt => {
                if (src.id !== tgt.id && tgt.sockets.ons.includes(emitEvt)) {
                    addReason(src, tgt, { type: 'socket', detail: emitEvt, direction: 'out' });
                }
            });
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
        const relativePath = card.dataset.path.replace('ROOT\\', '').replace(/\\/g, '/'); 
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
    
    // Filter links connected to this file
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
    
    // Visual Isolation
    document.querySelectorAll('.file-card').forEach(el => {
        el.classList.remove('isolated-target', 'active-focus', 'hidden-node');
        if (el.id === domId) el.classList.add('isolated-target');
        else if (relatedDomIds.has(el.id)) el.classList.add('active-focus');
        else el.classList.add('hidden-node');
    });

    document.querySelectorAll('.folder-block').forEach(f => {
        f.classList.toggle('hidden-node', !f.querySelector('.file-card:not(.hidden-node)'));
    });
    
    // BUILD MANIFEST HTML
    let h = `<div class="manifest-filepath">${file.id.replace('ROOT\\', '')} <span class="manifest-lines">(${file.lines} lines)</span></div>`;
    
    // Logic for Relationships (Imports/Dependents)
    const outboundDeps = []; // Files I import
    const inboundDeps = [];  // Files that import me

    relationLinks.forEach(link => {
        if (link.reasons.some(r => r.type === 'import')) {
            if (link.sourcePath === filePath) {
                const targetFile = fileRegistry.find(f => f.id === link.targetPath);
                if (targetFile) outboundDeps.push({ name: targetFile.name, domId: link.target });
            } else if (link.targetPath === filePath) {
                const sourceFile = fileRegistry.find(f => f.id === link.sourcePath);
                if (sourceFile) inboundDeps.push({ name: sourceFile.name, domId: link.source });
            }
        }
    });

    const renderSection = (title, items, icon, tagType, isRelation = false) => {
        if (!items || items.length === 0) return '';
        if (tagType === 'sockets' && items.emits.length === 0 && items.ons.length === 0) return '';
        
        let tags = "";
        if (isRelation) {
            tags = items.map(rel => `<span class="data-tag relation-node" onclick="handleSelect('${rel.domId}')"><i data-lucide="file-text" size="10"></i> ${rel.name}</span>`).join('');
        } else if (tagType === 'sockets') {
            tags = items.emits.map(e => `<span class="data-tag socket-emit">EMIT: ${e}</span>`).join('') +
                   items.ons.map(o => `<span class="data-tag socket-on">ON: ${o}</span>`).join('');
        } else {
            tags = items.map(i => `<span class="data-tag ${tagType}">${tagType === 'routes' ? `[${i.method}] ${i.path}` : i}</span>`).join('');
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
    document.getElementById("inspector-content").innerHTML = "Select a file for isolation analysis.";
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
    const b = document.getElementById("copy-btn");
    b.innerText = "COPIED";
    setTimeout(() => b.innerText = "COPY", 2000);
}

function refreshSelection() {
    if (activeFileDomId) refreshManifest();
}