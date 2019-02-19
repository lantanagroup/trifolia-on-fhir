"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const rp = require("request-promise");
const FhirHelper = require("../fhirHelper");
const config = require("config");
const fhirLogic_1 = require("./fhirLogic");
const fhirConfig = config.get('fhir');
class ValueSetController extends fhirLogic_1.FhirLogic {
    static initRoutes() {
        const router = express.Router();
        router.post('/:id/expand', (req, res) => {
            const controller = new ValueSetController('ValueSet', req.fhirServerBase);
            controller.getExpanded(req.params.id, req.body)
                .then((results) => res.send(results))
                .catch((err) => ValueSetController.handleError(err, null, res));
        });
        return super.initRoutes('ValueSet', router);
    }
    getExpanded(id, options) {
        return new Promise((resolve, reject) => {
            ValueSetController.log.trace(`Beginning request to expand value set ${id}`);
            const getOptions = {
                url: FhirHelper.buildUrl(this.baseUrl, 'ValueSet', id),
                method: 'GET',
                json: true
            };
            ValueSetController.log.debug(`Expand operation is requesting value set content for ${id}`);
            rp(getOptions)
                .then((valueSet) => {
                ValueSetController.log.trace('Retrieved value set content for expand');
                const expandOptions = {
                    url: FhirHelper.buildUrl(fhirConfig.terminologyServer || this.baseUrl, 'ValueSet', null, '$expand', options),
                    method: 'POST',
                    json: true,
                    body: valueSet
                };
                ValueSetController.log.debug(`Asking the FHIR server to expand value set ${id}`);
                return rp(expandOptions);
            })
                .then((expandedValueSet) => {
                ValueSetController.log.trace('FHIR server responded with expanded value set');
                resolve(expandedValueSet);
            })
                .catch((err) => reject(err));
        });
    }
}
exports.ValueSetController = ValueSetController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVTZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWx1ZVNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBc0M7QUFDdEMsNENBQTRDO0FBQzVDLGlDQUFpQztBQUNqQywyQ0FBc0M7QUFJdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQVN0Qyx3QkFBZ0MsU0FBUSxxQkFBUztJQUN0QyxNQUFNLENBQUMsVUFBVTtRQUNwQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFrQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ25ELE1BQU0sVUFBVSxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxRSxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQzFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sV0FBVyxDQUFDLEVBQVUsRUFBRSxPQUF1QjtRQUNsRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMseUNBQXlDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFNUUsTUFBTSxVQUFVLEdBQUc7Z0JBQ2YsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDO2dCQUN0RCxNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7WUFFRixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHdEQUF3RCxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTNGLEVBQUUsQ0FBQyxVQUFVLENBQUM7aUJBQ1QsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2Ysa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2dCQUV2RSxNQUFNLGFBQWEsR0FBRztvQkFDbEIsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDO29CQUM1RyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsUUFBUTtpQkFDakIsQ0FBQztnQkFFRixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRixPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDdkIsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO2dCQUU5RSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWhERCxnREFnREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIEZoaXJIZWxwZXIgZnJvbSAnLi4vZmhpckhlbHBlcic7XG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcbmltcG9ydCB7RmhpckxvZ2ljfSBmcm9tICcuL2ZoaXJMb2dpYyc7XG5pbXBvcnQge0V4dGVuZGVkUmVxdWVzdH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtFeHBhbmRPcHRpb25zfSBmcm9tICcuLi9zcmMvYXBwL21vZGVscy9zdHUzL2V4cGFuZE9wdGlvbnMnO1xuXG5jb25zdCBmaGlyQ29uZmlnID0gY29uZmlnLmdldCgnZmhpcicpO1xuXG5pbnRlcmZhY2UgRXhwYW5kUmVxdWVzdCBleHRlbmRzIEV4dGVuZGVkUmVxdWVzdCB7XG4gICAgcGFyYW1zOiB7XG4gICAgICAgIGlkOiBzdHJpbmc7XG4gICAgfTtcbiAgICBib2R5OiBFeHBhbmRPcHRpb25zO1xufVxuXG5leHBvcnQgY2xhc3MgVmFsdWVTZXRDb250cm9sbGVyIGV4dGVuZHMgRmhpckxvZ2ljIHtcbiAgICBwdWJsaWMgc3RhdGljIGluaXRSb3V0ZXMoKSB7XG4gICAgICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XG5cbiAgICAgICAgcm91dGVyLnBvc3QoJy86aWQvZXhwYW5kJywgKHJlcTogRXhwYW5kUmVxdWVzdCwgcmVzKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBjb250cm9sbGVyID0gbmV3IFZhbHVlU2V0Q29udHJvbGxlcignVmFsdWVTZXQnLCByZXEuZmhpclNlcnZlckJhc2UpO1xuICAgICAgICAgICAgY29udHJvbGxlci5nZXRFeHBhbmRlZChyZXEucGFyYW1zLmlkLCByZXEuYm9keSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IFZhbHVlU2V0Q29udHJvbGxlci5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdFJvdXRlcygnVmFsdWVTZXQnLCByb3V0ZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRFeHBhbmRlZChpZDogc3RyaW5nLCBvcHRpb25zPzogRXhwYW5kT3B0aW9ucykge1xuICAgICAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgVmFsdWVTZXRDb250cm9sbGVyLmxvZy50cmFjZShgQmVnaW5uaW5nIHJlcXVlc3QgdG8gZXhwYW5kIHZhbHVlIHNldCAke2lkfWApO1xuXG4gICAgICAgICAgICBjb25zdCBnZXRPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdWYWx1ZVNldCcsIGlkKSxcbiAgICAgICAgICAgICAgICBtZXRob2Q6ICdHRVQnLFxuICAgICAgICAgICAgICAgIGpzb246IHRydWVcbiAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgIFZhbHVlU2V0Q29udHJvbGxlci5sb2cuZGVidWcoYEV4cGFuZCBvcGVyYXRpb24gaXMgcmVxdWVzdGluZyB2YWx1ZSBzZXQgY29udGVudCBmb3IgJHtpZH1gKTtcblxuICAgICAgICAgICAgcnAoZ2V0T3B0aW9ucylcbiAgICAgICAgICAgICAgICAudGhlbigodmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgVmFsdWVTZXRDb250cm9sbGVyLmxvZy50cmFjZSgnUmV0cmlldmVkIHZhbHVlIHNldCBjb250ZW50IGZvciBleHBhbmQnKTtcblxuICAgICAgICAgICAgICAgICAgICBjb25zdCBleHBhbmRPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKGZoaXJDb25maWcudGVybWlub2xvZ3lTZXJ2ZXIgfHwgdGhpcy5iYXNlVXJsLCAnVmFsdWVTZXQnLCBudWxsLCAnJGV4cGFuZCcsIG9wdGlvbnMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBqc29uOiB0cnVlLFxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogdmFsdWVTZXRcbiAgICAgICAgICAgICAgICAgICAgfTtcblxuICAgICAgICAgICAgICAgICAgICBWYWx1ZVNldENvbnRyb2xsZXIubG9nLmRlYnVnKGBBc2tpbmcgdGhlIEZISVIgc2VydmVyIHRvIGV4cGFuZCB2YWx1ZSBzZXQgJHtpZH1gKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJwKGV4cGFuZE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKGV4cGFuZGVkVmFsdWVTZXQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgVmFsdWVTZXRDb250cm9sbGVyLmxvZy50cmFjZSgnRkhJUiBzZXJ2ZXIgcmVzcG9uZGVkIHdpdGggZXhwYW5kZWQgdmFsdWUgc2V0Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShleHBhbmRlZFZhbHVlU2V0KTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn0iXX0=