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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGVtZW50YXRpb25HdWlkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltcGxlbWVudGF0aW9uR3VpZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsMkNBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QyxpQ0FBaUM7QUFDakMsaUNBQWlDO0FBQ2pDLGdDQUFnQztBQUNoQyw4Q0FBdUM7QUFJdkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFhL0IsOEJBQXNDLFNBQVEscUJBQVM7SUFHNUMsTUFBTSxDQUFDLFVBQVU7UUFDcEIsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBRWhDLE1BQU0sQ0FBQyxHQUFHLENBQUMsWUFBWSxFQUFtQixxQkFBUSxFQUFFLENBQUMsR0FBb0IsRUFBRSxHQUFHLEVBQUUsRUFBRTtZQUM5RSxHQUFHLENBQUMsS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7WUFFN0QsTUFBTSxTQUFTLEdBQUcsSUFBSSx3QkFBd0IsQ0FBQyxxQkFBcUIsRUFBRSxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUM7WUFDMUYsU0FBUyxDQUFDLGtCQUFrQixFQUFFO2lCQUN6QixJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7aUJBQ3BDLEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUQsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLEtBQUssQ0FBQyxVQUFVLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVNLGtCQUFrQjtRQUNyQixPQUFPLElBQUksT0FBTyxDQUFNLENBQUMsT0FBTyxFQUFFLE1BQU0sRUFBRSxFQUFFO1lBQ3hDLElBQUksQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFO2dCQUM3QixNQUFNLElBQUksS0FBSyxDQUFDLDBEQUEwRCxDQUFDLENBQUM7YUFDL0U7WUFFRCxFQUFFLENBQUMsVUFBVSxDQUFDLGVBQWUsRUFBRSxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQztpQkFDekMsSUFBSSxDQUFDLENBQUMsT0FBNkIsRUFBRSxFQUFFO2dCQUNwQyxNQUFNLE1BQU0sR0FBRyxFQUFFLENBQUM7Z0JBRWxCLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLEtBQUssRUFBRSxFQUFFO29CQUM3QixDQUFDLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQyxPQUFPLEVBQUUsRUFBRTt3QkFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQzs0QkFDUixJQUFJLEVBQUUsS0FBSyxDQUFDLElBQUk7NEJBQ2hCLEdBQUcsRUFBRSxPQUFPLENBQUMsR0FBRzs0QkFDaEIsT0FBTyxFQUFFLE9BQU8sQ0FBQyxZQUFZLENBQUM7NEJBQzlCLFVBQVUsRUFBRSxLQUFLLENBQUMsVUFBVSxDQUFDO3lCQUNoQyxDQUFDLENBQUM7b0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQ3BCLENBQUMsQ0FBQztpQkFDRCxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3JDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLE1BQU0sQ0FBQyxLQUFXO1FBQ3JCLE9BQU8sS0FBSyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUMvQixDQUFDOztBQTlDTSxxQ0FBWSxHQUFHLHFCQUFxQixDQUFDO0FBRGhELDREQWdEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGV4cHJlc3MgZnJvbSAnZXhwcmVzcyc7XHJcbmltcG9ydCB7RmhpckxvZ2ljfSBmcm9tICcuL2ZoaXJMb2dpYyc7XHJcbmltcG9ydCAqIGFzIHJwIGZyb20gJ3JlcXVlc3QtcHJvbWlzZSc7XHJcbmltcG9ydCAqIGFzIGNvbmZpZyBmcm9tICdjb25maWcnO1xyXG5pbXBvcnQgKiBhcyBsb2c0anMgZnJvbSAnbG9nNGpzJztcclxuaW1wb3J0ICogYXMgXyBmcm9tICd1bmRlcnNjb3JlJztcclxuaW1wb3J0IHtjaGVja0p3dH0gZnJvbSAnLi4vYXV0aEhlbHBlcic7XHJcbmltcG9ydCB7RXh0ZW5kZWRSZXF1ZXN0fSBmcm9tICcuL21vZGVscyc7XHJcbmltcG9ydCB7UmVxdWVzdEhhbmRsZXJ9IGZyb20gJ2V4cHJlc3MnO1xyXG5cclxuY29uc3QgZmhpckNvbmZpZyA9IGNvbmZpZy5nZXQoJ2ZoaXInKTtcclxuY29uc3QgbG9nID0gbG9nNGpzLmdldExvZ2dlcigpO1xyXG5cclxuaW50ZXJmYWNlIFB1Ymxpc2hlZEd1aWRlc01vZGVsIHtcclxuICAgIGd1aWRlczogW3tcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgJ25wbS1uYW1lJzogc3RyaW5nO1xyXG4gICAgICAgIGVkaXRpb25zOiBbe1xyXG4gICAgICAgICAgICB1cmw6IHN0cmluZztcclxuICAgICAgICAgICAgdmVyc2lvbjogc3RyaW5nO1xyXG4gICAgICAgIH1dXHJcbiAgICB9XTtcclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEltcGxlbWVudGF0aW9uR3VpZGVMb2dpYyBleHRlbmRzIEZoaXJMb2dpYyB7XHJcbiAgICBzdGF0aWMgcmVzb3VyY2VUeXBlID0gJ0ltcGxlbWVudGF0aW9uR3VpZGUnO1xyXG5cclxuICAgIHB1YmxpYyBzdGF0aWMgaW5pdFJvdXRlcygpIHtcclxuICAgICAgICBjb25zdCByb3V0ZXIgPSBleHByZXNzLlJvdXRlcigpO1xyXG5cclxuICAgICAgICByb3V0ZXIuZ2V0KCcvcHVibGlzaGVkJywgPFJlcXVlc3RIYW5kbGVyPiBjaGVja0p3dCwgKHJlcTogRXh0ZW5kZWRSZXF1ZXN0LCByZXMpID0+IHtcclxuICAgICAgICAgICAgbG9nLnRyYWNlKGBHZXR0aW5nIGxpc3Qgb2YgcHVibGlzaGVkIGltcGxlbWVudGF0aW9uIGd1aWRlc2ApO1xyXG5cclxuICAgICAgICAgICAgY29uc3QgZmhpckxvZ2ljID0gbmV3IEltcGxlbWVudGF0aW9uR3VpZGVMb2dpYygnSW1wbGVtZW50YXRpb25HdWlkZScsIHJlcS5maGlyU2VydmVyQmFzZSk7XHJcbiAgICAgICAgICAgIGZoaXJMb2dpYy5nZXRQdWJsaXNoZWRHdWlkZXMoKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlcy5zZW5kKHJlc3VsdHMpKVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHRoaXMuaGFuZGxlRXJyb3IoZXJyLCBudWxsLCByZXMpKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLmluaXRSb3V0ZXMoJ0ltcGxlbWVudGF0aW9uR3VpZGUnLCByb3V0ZXIpO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBnZXRQdWJsaXNoZWRHdWlkZXMoKTogUHJvbWlzZTxhbnk+IHtcclxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55PigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgICAgICAgIGlmICghZmhpckNvbmZpZy5wdWJsaXNoZWRHdWlkZXMpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignU2VydmVyIGlzIG5vdCBjb25maWd1cmVkIHdpdGggYSBwdWJsaXNoZWRHdWlkZXMgcHJvcGVydHknKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcnAoZmhpckNvbmZpZy5wdWJsaXNoZWRHdWlkZXMsIHsganNvbjogdHJ1ZSB9KVxyXG4gICAgICAgICAgICAgICAgLnRoZW4oKHJlc3VsdHM6IFB1Ymxpc2hlZEd1aWRlc01vZGVsKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgZ3VpZGVzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIF8uZWFjaChyZXN1bHRzLmd1aWRlcywgKGd1aWRlKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF8uZWFjaChndWlkZS5lZGl0aW9ucywgKGVkaXRpb24pID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGd1aWRlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lOiBndWlkZS5uYW1lLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVybDogZWRpdGlvbi51cmwsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVyc2lvbjogZWRpdGlvblsnaWctdmVyc2lvbiddLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICducG0tbmFtZSc6IGd1aWRlWyducG0tbmFtZSddXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoZ3VpZGVzKTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gcmVqZWN0KGVycikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBzZWFyY2gocXVlcnk/OiBhbnkpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBzdXBlci5zZWFyY2gocXVlcnkpO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==