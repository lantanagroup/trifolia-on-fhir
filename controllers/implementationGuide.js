"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const fhirLogic_1 = require("./fhirLogic");
const rp = require("request-promise");
const config = require("config");
const log4js = require("log4js");
const _ = require("underscore");
const authHelper_1 = require("../authHelper");
const fhirConfig = config.get('fhir');
const log = log4js.getLogger();
class ImplementationGuideLogic extends fhirLogic_1.FhirLogic {
    static initRoutes() {
        const router = express.Router();
        router.get('/published', authHelper_1.checkJwt, (req, res) => {
            log.trace(`Getting list of published implementation guides`);
            const fhirLogic = new ImplementationGuideLogic('ImplementationGuide', req.fhirServerBase);
            fhirLogic.getPublishedGuides()
                .then((results) => res.send(results))
                .catch((err) => this.handleError(err, null, res));
        });
        return super.initRoutes('ImplementationGuide', router);
    }
    getPublishedGuides() {
        return new Promise((resolve, reject) => {
            if (!fhirConfig.publishedGuides) {
                throw new Error('Server is not configured with a publishedGuides property');
            }
            rp(fhirConfig.publishedGuides, { json: true })
                .then((results) => {
                const guides = [];
                _.each(results.guides, (guide) => {
                    _.each(guide.editions, (edition) => {
                        guides.push({
                            name: guide.name,
                            url: edition.url,
                            version: edition['ig-version'],
                            'npm-name': guide['npm-name']
                        });
                    });
                });
                resolve(guides);
            })
                .catch((err) => reject(err));
        });
    }
    search(query) {
        return super.search(query);
    }
}
ImplementationGuideLogic.resourceType = 'ImplementationGuide';
exports.ImplementationGuideLogic = ImplementationGuideLogic;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGVtZW50YXRpb25HdWlkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltcGxlbWVudGF0aW9uR3VpZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsMkNBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QyxpQ0FBaUM7QUFDakMsaUNBQWlDO0FBQ2pDLGdDQUFnQztBQUNoQyw4Q0FBdUM7QUFJdkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFhL0IsOEJBQXNDLFNBQVEscUJBQVM7SUFHNUMsTUFBTSxDQUFDLFVBQVU7UUFDcEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5RSxHQUFHLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7WUFFN0QsTUFBTSxTQUFTLEdBQUcsSUFBSSx3QkFBd0IsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUYsU0FBUyxDQUFDLGtCQUFrQixFQUFFO2lCQUN6QixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLGtCQUFrQjtRQUNyQixPQUFPLElBQUksT0FBTyxDQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDL0U7WUFFRCxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDekMsSUFBSSxDQUFDLENBQUMsT0FBNkIsRUFBRSxFQUFFO2dCQUNwQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRWxCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTt3QkFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQzs0QkFDUixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7NEJBQ2hCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRzs0QkFDaEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUM7NEJBQzlCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDO3lCQUNoQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFXO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDOztBQTlDTSxxQ0FBWSxHQUFHLHFCQUFxQixDQUFDO0FBRGhELDREQWdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XG5pbXBvcnQge0ZoaXJMb2dpY30gZnJvbSAnLi9maGlyTG9naWMnO1xuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICdjb25maWcnO1xuaW1wb3J0ICogYXMgbG9nNGpzIGZyb20gJ2xvZzRqcyc7XG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xuaW1wb3J0IHtjaGVja0p3dH0gZnJvbSAnLi4vYXV0aEhlbHBlcic7XG5pbXBvcnQge0V4dGVuZGVkUmVxdWVzdH0gZnJvbSAnLi9tb2RlbHMnO1xuaW1wb3J0IHtSZXF1ZXN0SGFuZGxlcn0gZnJvbSAnZXhwcmVzcyc7XG5cbmNvbnN0IGZoaXJDb25maWcgPSBjb25maWcuZ2V0KCdmaGlyJyk7XG5jb25zdCBsb2cgPSBsb2c0anMuZ2V0TG9nZ2VyKCk7XG5cbmludGVyZmFjZSBQdWJsaXNoZWRHdWlkZXNNb2RlbCB7XG4gICAgZ3VpZGVzOiBbe1xuICAgICAgICBuYW1lOiBzdHJpbmc7XG4gICAgICAgICducG0tbmFtZSc6IHN0cmluZztcbiAgICAgICAgZWRpdGlvbnM6IFt7XG4gICAgICAgICAgICB1cmw6IHN0cmluZztcbiAgICAgICAgICAgIHZlcnNpb246IHN0cmluZztcbiAgICAgICAgfV1cbiAgICB9XTtcbn1cblxuZXhwb3J0IGNsYXNzIEltcGxlbWVudGF0aW9uR3VpZGVMb2dpYyBleHRlbmRzIEZoaXJMb2dpYyB7XG4gICAgc3RhdGljIHJlc291cmNlVHlwZSA9ICdJbXBsZW1lbnRhdGlvbkd1aWRlJztcblxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdFJvdXRlcygpIHtcbiAgICAgICAgY29uc3Qgcm91dGVyID0gZXhwcmVzcy5Sb3V0ZXIoKTtcblxuICAgICAgICByb3V0ZXIuZ2V0KCcvcHVibGlzaGVkJywgPFJlcXVlc3RIYW5kbGVyPiBjaGVja0p3dCwgKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcbiAgICAgICAgICAgIGxvZy50cmFjZShgR2V0dGluZyBsaXN0IG9mIHB1Ymxpc2hlZCBpbXBsZW1lbnRhdGlvbiBndWlkZXNgKTtcblxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IEltcGxlbWVudGF0aW9uR3VpZGVMb2dpYygnSW1wbGVtZW50YXRpb25HdWlkZScsIHJlcS5maGlyU2VydmVyQmFzZSk7XG4gICAgICAgICAgICBmaGlyTG9naWMuZ2V0UHVibGlzaGVkR3VpZGVzKClcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXRSb3V0ZXMoJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCByb3V0ZXIpO1xuICAgIH1cblxuICAgIHB1YmxpYyBnZXRQdWJsaXNoZWRHdWlkZXMoKTogUHJvbWlzZTxhbnk+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGFueT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgaWYgKCFmaGlyQ29uZmlnLnB1Ymxpc2hlZEd1aWRlcykge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyIGlzIG5vdCBjb25maWd1cmVkIHdpdGggYSBwdWJsaXNoZWRHdWlkZXMgcHJvcGVydHknKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcnAoZmhpckNvbmZpZy5wdWJsaXNoZWRHdWlkZXMsIHsganNvbjogdHJ1ZSB9KVxuICAgICAgICAgICAgICAgIC50aGVuKChyZXN1bHRzOiBQdWJsaXNoZWRHdWlkZXNNb2RlbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCBndWlkZXMgPSBbXTtcblxuICAgICAgICAgICAgICAgICAgICBfLmVhY2gocmVzdWx0cy5ndWlkZXMsIChndWlkZSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGd1aWRlLmVkaXRpb25zLCAoZWRpdGlvbikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWRlcy5wdXNoKHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZTogZ3VpZGUubmFtZSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBlZGl0aW9uLnVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogZWRpdGlvblsnaWctdmVyc2lvbiddLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnbnBtLW5hbWUnOiBndWlkZVsnbnBtLW5hbWUnXVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZ3VpZGVzKTtcbiAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xuICAgICAgICByZXR1cm4gc3VwZXIuc2VhcmNoKHF1ZXJ5KTtcbiAgICB9XG59XG4iXX0=