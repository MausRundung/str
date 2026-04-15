/**
 * Component renderers
 */
function renderTree(node) {
    if (node.id) {
        // File Node
        const domId = 'f_' + btoa(node.id).replace(/[^a-zA-Z0-9]/g, '');
        let detailItems = [];
        
        const toTags = (items, type) => {
            if (!items || (Array.isArray(items) && items.length === 0)) return '';
            let content = '';
            switch(type) {
                case 'routes': content = items.map(r => `<span class="data-tag route"><span class="method">${r.method}</span> ${r.path}</span>`).join(''); break;
                case 'sockets': 
                    content += items.emits.map(e => `<span class="data-tag socket-emit">EMIT: ${e}</span>`).join('');
                    content += items.ons.map(o => `<span class="data-tag socket-on">ON: ${o}</span>`).join('');
                    break;
                case 'tables': content = items.map(t => `<span class="data-tag table">${t}</span>`).join(''); break;
                case 'types': content = items.map(t => `<span class="data-tag type">${t}</span>`).join(''); break;
                case 'exports': content = items.map(e => `<span class="data-tag export">${e}</span>`).join(''); break;
                case 'imports': content = items.map(i => `<span class="data-tag import" title="${i}">${i.split('/').pop()}</span>`).join(''); break;
            }
            return `<div class="tag-container">${content}</div>`;
        }
        
        if (node.routes.length) detailItems.push(`<div class="card-data-row card-row-routes"><span class="data-label">Routes</span><div class="data-val">${toTags(node.routes, 'routes')}</div></div>`);
        if (node.sockets.emits.length || node.sockets.ons.length) detailItems.push(`<div class="card-data-row card-row-sockets"><span class="data-label">Sockets</span><div class="data-val">${toTags(node.sockets, 'sockets')}</div></div>`);
        if (node.tables.length) detailItems.push(`<div class="card-data-row card-row-tables"><span class="data-label">Tables</span><div class="data-val">${toTags(node.tables, 'tables')}</div></div>`);
        if (node.types.length) detailItems.push(`<div class="card-data-row card-row-types"><span class="data-label">Types</span><div class="data-val">${toTags(node.types, 'types')}</div></div>`);
        if (node.exports.length) detailItems.push(`<div class="card-data-row card-row-exports"><span class="data-label">Exports</span><div class="data-val">${toTags(node.exports, 'exports')}</div></div>`);
        if (node.imports.length) detailItems.push(`<div class="card-data-row card-row-imports"><span class="data-label">Imports</span><div class="data-val">${toTags(node.imports, 'imports')}</div></div>`);

        let classes = "file-card";
        if(node.routes.length) classes += " has-route";
        if(node.sockets.emits.length || node.sockets.ons.length) classes += " has-socket";
        
        return `<div class="${classes}" id="${domId}" data-path="${node.id}" onclick="handleFileCardClick(event)" ondblclick="handleSelect('${domId}')">
            <div class="file-name-row">
                <span><i data-lucide="file-code" size="12" color="var(--accent)" style="margin-right:4px;"></i>${node.name}</span>
                <span class="line-badge">${node.lines} L</span>
            </div>
            ${detailItems.length ? `<div class="card-data-section">${detailItems.join('')}</div>` : ''}
        </div>`;
    } else {
        // Directory Node
        let html = `<div class="folder-block">`;
        if (node.name !== "ROOT") html += `<div class="folder-name"><i data-lucide="folder" size="10"></i> ${node.name}</div>`;
        html += `<div class="folder-children">`;
        for (let k in node.children) html += renderTree(node.children[k]);
        return html + `</div></div>`;
    }
}