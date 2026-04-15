/**
 * SVG Connection Logic
 */
function drawArcs() {
    const svg = document.getElementById("svg-layer");
    const view = document.getElementById("main-view");
    if (!svg || !view) return;

    svg.style.height = Math.max(view.scrollHeight, view.clientHeight) + "px";
    let paths = "";
    const vRect = view.getBoundingClientRect();

    relationLinks.forEach(link => {
        const sEl = document.getElementById(link.source);
        const tEl = document.getElementById(link.target);

        if (sEl && tEl && !sEl.classList.contains("hidden-node") && !tEl.classList.contains("hidden-node")) {
            // If in focus mode, only draw arcs connected to the active file
            if (activeFileDomId && link.source !== activeFileDomId && link.target !== activeFileDomId) return;

            const sR = sEl.getBoundingClientRect();
            const tR = tEl.getBoundingClientRect();
            const scrollY = view.scrollTop;

            const sX = sR.right - vRect.left;
            const sY = sR.top - vRect.top + scrollY + sR.height / 2;
            const eX = tR.right - vRect.left;
            const eY = tR.top - vRect.top + scrollY + tR.height / 2;

            // Control point for cubic bezier curve
            const cp = Math.max(sX, eX) + 80 + Math.abs(sY - eY) * 0.1;

            const isActive = (link.source === activeFileDomId || link.target === activeFileDomId);
            paths += `<path class="arc ${isActive ? "active-focus" : ""}" d="M ${sX} ${sY} C ${cp} ${sY}, ${cp} ${eY}, ${eX} ${eY}" />`;
        }
    });
    svg.innerHTML = paths;
}