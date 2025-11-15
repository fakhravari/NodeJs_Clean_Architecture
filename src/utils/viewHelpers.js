function formatDateToYMD(dt) {
    try {
        if (!dt) return '';
        const d = new Date(dt);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}/${m}/${day}`;
    } catch (e) {
        return String(dt);
    }
}

function escapeSingleQuotes(s) {
    if (s === null || s === undefined) return s;
    return String(s).replace(/'/g, "''");
}

module.exports = { formatDateToYMD, escapeSingleQuotes };
