/**
 * Global State & Orchestration
 */
let fileRegistry = [];
let relationLinks =[];
let activeFileDomId = null;
let activeChips = new Set();
let projectBasePath = null;

document.addEventListener('DOMContentLoaded', () => { 
    lucide.createIcons(); 
    if (typeof window.STR_AUTO_DATA !== 'undefined' && window.STR_AUTO_DATA) {
        document.getElementById('data-input').value = window.STR_AUTO_DATA;
        buildSystem();
    }
});
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
    const pathMap = new Map();
    
    fileRegistry.forEach(f => {
        const idWithoutExt = f.id.replace(/\.[^/.\\]+$/, "");
        pathMap.set(idWithoutExt, f);
        if (idWithoutExt.endsWith('\\index')) pathMap.set(idWithoutExt.replace(/\\index$/, ""), f);
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
            // v4.1 formats imports as "modulePath (importedVariable)"
            const moduleMatch = imp.match(/^(.+?)(?:\s+\(.*\))?$/);
            const rawPath = moduleMatch ? moduleMatch[1].trim() : imp;

            const resolvedPath = resolveImportPath(src.id, rawPath);
            if (resolvedPath) {
                const cleanTargetId = resolvedPath.replace(/\.[^/.\\]+$/, "");
                const tgt = pathMap.get(cleanTargetId);
                
                if (tgt && tgt.id !== src.id) {
                    addReason(src, tgt, { type: 'import', detail: imp, direction: 'out' });
                }
            }
        });
    });
    
    relationLinks = Array.from(consolidatedLinks.values());
}

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
    
    const connectedLinks = relationLinks.filter(link => {
        const hasImport = link.reasons.some(r => r.type === 'import');
        return (link.sourcePath === filePath || link.targetPath === filePath) && (showImp && hasImport);
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

    relationLinks.forEach(link => {
        if (link.reasons.some(r => r.type === 'import')) {
            if (link.sourcePath === filePath) {
                const targetFile = fileRegistry.find(f => f.id === link.targetPath);
                if (targetFile) outboundDeps.push({ name: targetFile.name, path: targetFile.id.replace(/^ROOT\\/, '').replace(/\\/g, '/'), exports: targetFile.exports, domId: link.target });
            } else if (link.targetPath === filePath) {
                const sourceFile = fileRegistry.find(f => f.id === link.sourcePath);
                if (sourceFile) inboundDeps.push({ name: sourceFile.name, path: sourceFile.id.replace(/^ROOT\\/, '').replace(/\\/g, '/'), exports: sourceFile.exports, domId: link.source });
            }
        }
    });

    const renderSection = (title, items, icon, tagType, isRelation = false) => {
        if (!items || items.length === 0) return '';
        
        let tags = "";
        if (isRelation) {
            tags = items.map(rel => {
                let exportsBadge = rel.exports && rel.exports.length > 0 
                    ? `<span style="color: #60a5fa; margin-left: 6px; font-weight: 500;">{ ${rel.exports.map(e => e.replace('[Hook]', '').trim()).join(', ')} }</span>` 
                    : '';
                return `<span class="data-tag relation-node" onclick="handleSelect('${rel.domId}')" title="${rel.path}">
                    <i data-lucide="file-text" size="10"></i> ${rel.name} 
                    <span style="opacity: 0.6; margin-left: 4px; font-weight: normal; font-size: 0.9em;">(${rel.path})</span>
                    ${exportsBadge}
                </span>`;
            }).join('');
        } else {
            tags = items.map(i => {
                if (tagType === 'routes') return `<span class="data-tag route">[${i.method}] ${i.path}</span>`;
                if (tagType === 'hook' || (tagType === 'export' && i.startsWith('[Hook]'))) return `<span class="data-tag hook"><i data-lucide="zap" size="10"></i> ${i.replace('[Hook]', '').trim()}</span>`;
                if (tagType === 'unused') return `<span class="data-tag unused"><i data-lucide="alert-triangle" size="10"></i> ${i}</span>`;
                if (tagType === 'data') return `<span class="data-tag data"><i data-lucide="database" size="10"></i> ${i}</span>`;
                return `<span class="data-tag ${tagType}">${i}</span>`;
            }).join('');
        }
        return `
            <div class="manifest-section">
                <div class="manifest-header"><i data-lucide="${icon}" size="12"></i> ${title}</div>
                <div class="tag-container">${tags}</div>
            </div>`;
    };

    h += renderSection("Unused Variables", file.unused, "alert-triangle", "unused");
    h += renderSection("Meta Context", file.meta, "info", "meta");
    h += renderSection("Data Structures", file.data, "database", "data");
    h += renderSection("Dependencies (Imports)", outboundDeps, "box-select", 'relation', true);
    h += renderSection("Reliant Components (Used By)", inboundDeps, "layers", 'relation', true);
    h += renderSection("API Routes", file.routes, "external-link", 'routes');
    h += renderSection("Exports & Hooks", file.exports, "package-export", 'export');

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
    if (!activeFileDomId) return;
    
    const cardEl = document.getElementById(activeFileDomId);
    if (!cardEl) return;
    
    const filePath = cardEl.dataset.path;
    const file = fileRegistry.find(f => f.id === filePath);
    if (!file) return;

    let report = `FILE MANIFEST: ${file.id.replace(/^ROOT\\/, '').replace(/\\/g, '/')} (${file.lines} lines)\n`;
    report += `=========================================================\n\n`;

    if (file.unused.length > 0) report += `Unused Code:\n${file.unused.map(u => `  - ${u}`).join('\n')}\n\n`;
    if (file.meta.length > 0) report += `Meta Attributes:\n${file.meta.map(m => `  - ${m}`).join('\n')}\n\n`;
    if (file.data.length > 0) report += `Data & Models:\n${file.data.map(d => `  - ${d}`).join('\n')}\n\n`;
    if (file.routes.length > 0) report += `Routes:\n${file.routes.map(r => `  - [${r.method}] ${r.path}`).join('\n')}\n\n`;
    if (file.exports.length > 0) report += `Exports & Hooks:\n${file.exports.map(e => `  - ${e.replace('[Hook]', '[Hook] ')}`).join('\n')}\n\n`;

    navigator.clipboard.writeText(report.trim()).then(() => {
        const b = document.getElementById("copy-btn");
        b.innerText = "COPIED";
        setTimeout(() => b.innerText = "COPY", 2000);
    });
}

function refreshSelection() {
    if (activeFileDomId) refreshManifest();
}