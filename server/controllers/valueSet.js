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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmFsdWVTZXQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJ2YWx1ZVNldC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLG1DQUFtQztBQUNuQyxzQ0FBc0M7QUFDdEMsNENBQTRDO0FBQzVDLGlDQUFpQztBQUNqQywyQ0FBc0M7QUFJdEMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQVN0Qyx3QkFBZ0MsU0FBUSxxQkFBUztJQUN0QyxNQUFNLENBQUMsVUFBVTtRQUNwQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQyxHQUFrQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQ25ELE1BQU0sVUFBVSxHQUFHLElBQUksa0JBQWtCLENBQUMsVUFBVSxFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxRSxVQUFVLENBQUMsV0FBVyxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxJQUFJLENBQUM7aUJBQzFDLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3hFLENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxLQUFLLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBRU0sV0FBVyxDQUFDLEVBQVUsRUFBRSxPQUF1QjtRQUNsRCxPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ25DLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMseUNBQXlDLEVBQUUsRUFBRSxDQUFDLENBQUM7WUFFNUUsTUFBTSxVQUFVLEdBQUc7Z0JBQ2YsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsRUFBRSxDQUFDO2dCQUN0RCxNQUFNLEVBQUUsS0FBSztnQkFDYixJQUFJLEVBQUUsSUFBSTthQUNiLENBQUM7WUFFRixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLHdEQUF3RCxFQUFFLEVBQUUsQ0FBQyxDQUFDO1lBRTNGLEVBQUUsQ0FBQyxVQUFVLENBQUM7aUJBQ1QsSUFBSSxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7Z0JBQ2Ysa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO2dCQUV2RSxNQUFNLGFBQWEsR0FBRztvQkFDbEIsR0FBRyxFQUFFLFVBQVUsQ0FBQyxRQUFRLENBQUMsVUFBVSxDQUFDLGlCQUFpQixJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUUsT0FBTyxDQUFDO29CQUM1RyxNQUFNLEVBQUUsTUFBTTtvQkFDZCxJQUFJLEVBQUUsSUFBSTtvQkFDVixJQUFJLEVBQUUsUUFBUTtpQkFDakIsQ0FBQztnQkFFRixrQkFBa0IsQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLDhDQUE4QyxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRixPQUFPLEVBQUUsQ0FBQyxhQUFhLENBQUMsQ0FBQztZQUM3QixDQUFDLENBQUM7aUJBQ0QsSUFBSSxDQUFDLENBQUMsZ0JBQWdCLEVBQUUsRUFBRTtnQkFDdkIsa0JBQWtCLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQywrQ0FBK0MsQ0FBQyxDQUFDO2dCQUU5RSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztZQUM5QixDQUFDLENBQUM7aUJBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNyQyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7Q0FDSjtBQWhERCxnREFnREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBleHByZXNzIGZyb20gJ2V4cHJlc3MnO1xyXG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xyXG5pbXBvcnQgKiBhcyBGaGlySGVscGVyIGZyb20gJy4uL2ZoaXJIZWxwZXInO1xyXG5pbXBvcnQgKiBhcyBjb25maWcgZnJvbSAnY29uZmlnJztcclxuaW1wb3J0IHtGaGlyTG9naWN9IGZyb20gJy4vZmhpckxvZ2ljJztcclxuaW1wb3J0IHtFeHRlbmRlZFJlcXVlc3R9IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHtFeHBhbmRPcHRpb25zfSBmcm9tICcuLi8uLi9zcmMvYXBwL21vZGVscy9zdHUzL2V4cGFuZE9wdGlvbnMnO1xyXG5cclxuY29uc3QgZmhpckNvbmZpZyA9IGNvbmZpZy5nZXQoJ2ZoaXInKTtcclxuXHJcbmludGVyZmFjZSBFeHBhbmRSZXF1ZXN0IGV4dGVuZHMgRXh0ZW5kZWRSZXF1ZXN0IHtcclxuICAgIHBhcmFtczoge1xyXG4gICAgICAgIGlkOiBzdHJpbmc7XHJcbiAgICB9O1xyXG4gICAgYm9keTogRXhwYW5kT3B0aW9ucztcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFZhbHVlU2V0Q29udHJvbGxlciBleHRlbmRzIEZoaXJMb2dpYyB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGluaXRSb3V0ZXMoKSB7XHJcbiAgICAgICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcclxuXHJcbiAgICAgICAgcm91dGVyLnBvc3QoJy86aWQvZXhwYW5kJywgKHJlcTogRXhwYW5kUmVxdWVzdCwgcmVzKSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnRyb2xsZXIgPSBuZXcgVmFsdWVTZXRDb250cm9sbGVyKCdWYWx1ZVNldCcsIHJlcS5maGlyU2VydmVyQmFzZSk7XHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXIuZ2V0RXhwYW5kZWQocmVxLnBhcmFtcy5pZCwgcmVxLmJvZHkpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gVmFsdWVTZXRDb250cm9sbGVyLmhhbmRsZUVycm9yKGVyciwgbnVsbCwgcmVzKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBzdXBlci5pbml0Um91dGVzKCdWYWx1ZVNldCcsIHJvdXRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldEV4cGFuZGVkKGlkOiBzdHJpbmcsIG9wdGlvbnM/OiBFeHBhbmRPcHRpb25zKSB7XHJcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgVmFsdWVTZXRDb250cm9sbGVyLmxvZy50cmFjZShgQmVnaW5uaW5nIHJlcXVlc3QgdG8gZXhwYW5kIHZhbHVlIHNldCAke2lkfWApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZ2V0T3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHVybDogRmhpckhlbHBlci5idWlsZFVybCh0aGlzLmJhc2VVcmwsICdWYWx1ZVNldCcsIGlkKSxcclxuICAgICAgICAgICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgICAgICAgICBqc29uOiB0cnVlXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBWYWx1ZVNldENvbnRyb2xsZXIubG9nLmRlYnVnKGBFeHBhbmQgb3BlcmF0aW9uIGlzIHJlcXVlc3RpbmcgdmFsdWUgc2V0IGNvbnRlbnQgZm9yICR7aWR9YCk7XHJcblxyXG4gICAgICAgICAgICBycChnZXRPcHRpb25zKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHZhbHVlU2V0KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgVmFsdWVTZXRDb250cm9sbGVyLmxvZy50cmFjZSgnUmV0cmlldmVkIHZhbHVlIHNldCBjb250ZW50IGZvciBleHBhbmQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZXhwYW5kT3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBGaGlySGVscGVyLmJ1aWxkVXJsKGZoaXJDb25maWcudGVybWlub2xvZ3lTZXJ2ZXIgfHwgdGhpcy5iYXNlVXJsLCAnVmFsdWVTZXQnLCBudWxsLCAnJGV4cGFuZCcsIG9wdGlvbnMpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAganNvbjogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYm9keTogdmFsdWVTZXRcclxuICAgICAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZVNldENvbnRyb2xsZXIubG9nLmRlYnVnKGBBc2tpbmcgdGhlIEZISVIgc2VydmVyIHRvIGV4cGFuZCB2YWx1ZSBzZXQgJHtpZH1gKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gcnAoZXhwYW5kT3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKGV4cGFuZGVkVmFsdWVTZXQpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBWYWx1ZVNldENvbnRyb2xsZXIubG9nLnRyYWNlKCdGSElSIHNlcnZlciByZXNwb25kZWQgd2l0aCBleHBhbmRlZCB2YWx1ZSBzZXQnKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShleHBhbmRlZFZhbHVlU2V0KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il19