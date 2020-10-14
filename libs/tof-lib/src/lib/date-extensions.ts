export {};

declare global {
    interface Date {
        formatFhir(): string;
    }
}

Date.prototype.formatFhir = function() {
    const date: Date = this;
    const ret = date.toISOString();

    if (ret.endsWith('T00:00:00.000Z')) {
      return ret.substring(0, 10);
    }

    return ret;
}
