if (typeof Date.prototype.formatDateToYMD !== "function") {
  Object.defineProperty(Date.prototype, "formatDateToYMD", {
    value: function () {
      try {
        const d = this instanceof Date ? this : new Date(this);
        if (isNaN(d.getTime())) return String(this);
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        return `${year}/${month}/${day}`;
      } catch (e) {
        return String(this);
      }
    },
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

if (typeof Date.prototype.formatDateTimeSQL !== "function") {
  Object.defineProperty(Date.prototype, "formatDateTimeSQL", {
    value: function () {
      try {
        const d = this instanceof Date ? this : new Date(this);
        if (isNaN(d.getTime())) return String(this);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const day = String(d.getDate()).padStart(2, "0");
        const hours = String(d.getHours()).padStart(2, "0");
        const minutes = String(d.getMinutes()).padStart(2, "0");
        const seconds = String(d.getSeconds()).padStart(2, "0");
        const ms = String(d.getMilliseconds()).padStart(3, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
      } catch (e) {
        return String(this);
      }
    },
    configurable: false,
    enumerable: false,
    writable: false,
  });
}

if (typeof String.prototype.escapeSqlString !== "function") {
  Object.defineProperty(String.prototype, "escapeSqlString", {
    value: function () {
      if (this === null || this === undefined) return this;
      return String(this).replace(/'/g, "''");
    },
    configurable: false,
    enumerable: false,
    writable: false,
  });
}
