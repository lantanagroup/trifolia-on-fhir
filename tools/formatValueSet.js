const request = require('request');
const url = process.argv[2];
const _ = require('underscore');
const Q = require('q');

function printCodes(codes) {
    console.log('public readonly codes: Coding[] = [');
    _.each(codes, (code, index) => {
        const comma = index < codes.length - 1 ? ',' : '';
        console.log(`\t{ code: '${code.code}', display: '${code.display}', system: '${code.system}' }${comma}`);
    });
    console.log('];');
}

function getCodes(include) {
    const deferred = Q.defer();

    if (include.concept) {
        const nextCodes = _.map(include.concept, (concept) => {
            return {
                code: concept.code,
                display: concept.display || concept.code,
                system: include.system
            };
        });
        deferred.resolve(nextCodes);
    } else if (include.system) {
        let systemUrl = include.system;
        systemUrl = systemUrl.substring(0, systemUrl.lastIndexOf('/') + 1) +
            'codesystem-' + systemUrl.substring(systemUrl.lastIndexOf('/') + 1) + '.json';

        request(systemUrl, function(err, results, json) {
            if (err) {
                return deferred.reject(err);
            }

            const codeSystem = JSON.parse(json);

            if (!codeSystem.concept) {
                return deferred.reject('Code System does not have concepts');
            }

            const nextCodes = _.map(codeSystem.concept, (concept) => {
                return {
                    code: concept.code,
                    display: concept.display,
                    system: codeSystem.url
                };
            });

            deferred.resolve(nextCodes);
        });
    } else {
        deferred.reject('Could not find codes');
    }

    return deferred.promise;
}

request.get(url, function(err, response, json) {
    if (err) {
        return process.exit(1);
    }

    const valueSet = JSON.parse(json);

    if (valueSet.compose && valueSet.compose.include) {
        const promises = _.map(valueSet.compose.include, (include) => getCodes(include));
        Q.all(promises)
            .then((allCodes) => {
                let codes = [];

                _.each(allCodes, (nextCodes) => {
                    codes = codes.concat(nextCodes);
                });

                printCodes(codes);
            })
            .catch((err) => {
                console.log(err);
                return process.exit(1);
            });
    }
});