/**
 * Component renderers for v4.1
 */
function renderTree(node) {
    if (node.id) {
        // File Node
        const domId = 'f_' + btoa(node.id).replace(/[^a-zA-Z0-9]/g, '');
        let detailItems =[];
        
        const toTags = (items, type) => {
            if (!items || items.length === 0) return '';
            let content = '';
            switch(type) {
                case 'meta': content = items.map(m => `<span class="data-tag meta">${m}</span>`).join(''); break;
                case 'data': content = items.map(d => `<span class="data-tag data"><i data-lucide="database" size="10"></i> ${d}</span>`).join(''); break;
                case 'routes': 
                    content = items.map(r => `<span class="data-tag route"><span class="method">${r.method}</span> ${r.path}</span>`).join(''); 
                    break;
                case 'exports': 
                    content = items.map(e => {
                        if (e.startsWith('[Hook]')) {
                            return `<span class="data-tag hook"><i data-lucide="zap" size="10"></i> ${e.replace('[Hook]', '').trim()}</span>`;
                        }
                        return `<span class="data-tag export">${e}</span>`;
                    }).join(''); 
                    break;
                case 'imports': content = items.map(i => `<span class="data-tag import" title="${i}">${i}</span>`).join(''); break;
                case 'unused': content = items.map(u => `<span class="data-tag unused"><i data-lucide="alert-triangle" size="10"></i> ${u}</span>`).join(''); break;
                case 'relation': 
                    content = items.map(rel => `<span class="data-tag relation-link" onclick="handleSelect('${rel.domId}')"><i data-lucide="file-text" size="10"></i> ${rel.name}</span>`).join(''); 
                    break;
            }
            return `<div class="tag-container">${content}</div>`;
        }
        
        if (node.meta.length) detailItems.push(`<div class="card-data-row card-row-meta"><span class="data-label">Meta</span><div class="data-val">${toTags(node.meta, 'meta')}</div></div>`);
        if (node.data.length) detailItems.push(`<div class="card-data-row card-row-data"><span class="data-label">Data</span><div class="data-val">${toTags(node.data, 'data')}</div></div>`);
        if (node.routes.length) detailItems.push(`<div class="card-data-row card-row-routes"><span class="data-label">Routes</span><div class="data-val">${toTags(node.routes, 'routes')}</div></div>`);
        if (node.exports.length) detailItems.push(`<div class="card-data-row card-row-exports"><span class="data-label">Exports</span><div class="data-val">${toTags(node.exports, 'exports')}</div></div>`);
        if (node.imports.length) detailItems.push(`<div class="card-data-row card-row-imports"><span class="data-label">Imports</span><div class="data-val">${toTags(node.imports, 'imports')}</div></div>`);
        if (node.unused.length) detailItems.push(`<div class="card-data-row card-row-unused"><span class="data-label">Unused</span><div class="data-val">${toTags(node.unused, 'unused')}</div></div>`);
        
        let classes = "file-card";
        if(node.routes.length) classes += " has-route";
        if(node.data.length) classes += " has-data";
        if(node.unused.length) classes += " has-unused";
        
        return `<div class="${classes}" id="${domId}" data-path="${node.id}" onclick="handleFileCardClick(event)" ondblclick="handleSelect('${domId}')">
            <div class="file-name-row">
                <span><i data-lucide="file-code" size="12" color="var(--accent)" style="margin-right:4px;"></i>${node.name}</span>
                <span class="line-badge">${node.lines} L</span>
            </div>
            ${detailItems.length ? `<div class="card-data-section">${detailItems.join('')}</div>` : ''}
        </div>`;
    } else {
        let html = `<div class="folder-block">`;
        if (node.name !== "ROOT") html += `<div class="folder-name"><i data-lucide="folder" size="10"></i> ${node.name}</div>`;
        html += `<div class="folder-children">`;
        for (let k in node.children) html += renderTree(node.children[k]);
        return html + `</div></div>`;
    }
}