const config = require('config');
const Q = require('q');

const importConfig = config.get('import');

function PhinVadsImporter() {
    const HessianProxy = require('hessian-client');     // Move to top of .js file after figuring out what hessian library is going to work
    this.client = new HessianProxy(importConfig.phinVadsUrl);
    this.client.debug = true;
}

PhinVadsImporter.prototype.search = function(text) {
    const deferred = Q.defer();
    const args = [{
        codeSearch: true,
        nameSearch: true,
        oidSearch: true,
        definitionSearch: false,
        searchText: text,
        searchType: 2
    }, 1, 10];
    this.client.invoke('findValueSets', args, (err, body) => {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(body);
        }
    });

    return deferred.promise;
}

module.exports = PhinVadsImporter;