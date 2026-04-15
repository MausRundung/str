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
    const nameMap = new Map(fileRegistry.map(f => [f.name.replace(/\.[^/.]+$/, ""), f]));

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
        // Map Imports
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

        const relativePath = card.dataset.path.substring(5).replace(/\\/g, '/'); 
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
    const filePath = document.getElementById(domId).dataset.path;
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
    
    // Build HTML for Manifest
    let h = `<div style="color:var(--text-main); font-weight:700; font-size:11px; margin-bottom:10px; border-left: 2px solid var(--accent); padding-left: 8px;">${file.id} <span style="font-weight:400; color:#444;">(${file.lines} L)</span></div>`;
    
    // Add sections (Routes, Sockets, etc - helper logic)
    const renderSection = (title, items, icon, tagType) => {
        if (!items || items.length === 0) return '';
        if (tagType === 'sockets' && items.emits.length === 0 && items.ons.length === 0) return '';
        
        let tags = "";
        if (tagType === 'sockets') {
            tags = items.emits.map(e => `<span class="data-tag socket-emit">EMIT: ${e}</span>`).join('') +
                   items.ons.map(o => `<span class="data-tag socket-on">ON: ${o}</span>`).join('');
        } else {
            tags = items.map(i => `<span class="data-tag ${tagType}">${tagType === 'routes' ? `[${i.method}] ${i.path}` : i}</span>`).join('');
        }
        return `<div class="manifest-section"><div class="manifest-header"><i data-lucide="${icon}" size="10"></i> ${title}</div><div class="tag-container">${tags}</div></div>`;
    };

    h += renderSection("API Routes", file.routes, "external-link", 'routes');
    h += renderSection("Sockets", file.sockets, "radio-receiver", 'sockets');
    h += renderSection("Tables", file.tables, "database", 'table');
    h += renderSection("Exports", file.exports, "package-export", 'export');

    document.getElementById('inspector-content').innerHTML = h;
    lucide.createIcons();
    requestAnimationFrame(() => {
        document.getElementById(domId)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
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
    // Logic for report generation...
    const b = document.getElementById("copy-btn");
    b.innerText = "COPIED";
    setTimeout(() => b.innerText = "COPY", 2000);
}

function refreshSelection() {
    if (activeFileDomId) refreshManifest();
}