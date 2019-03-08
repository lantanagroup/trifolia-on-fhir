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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1wbGVtZW50YXRpb25HdWlkZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImltcGxlbWVudGF0aW9uR3VpZGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtQ0FBbUM7QUFDbkMsMkNBQXNDO0FBQ3RDLHNDQUFzQztBQUN0QyxpQ0FBaUM7QUFDakMsaUNBQWlDO0FBQ2pDLGdDQUFnQztBQUNoQyw4Q0FBdUM7QUFJdkMsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUN0QyxNQUFNLEdBQUcsR0FBRyxNQUFNLENBQUMsU0FBUyxFQUFFLENBQUM7QUFhL0IsTUFBYSx3QkFBeUIsU0FBUSxxQkFBUztJQUc1QyxNQUFNLENBQUMsVUFBVTtRQUNwQixNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFaEMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQW1CLHFCQUFRLEVBQUUsQ0FBQyxHQUFvQixFQUFFLEdBQUcsRUFBRSxFQUFFO1lBQzlFLEdBQUcsQ0FBQyxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQztZQUU3RCxNQUFNLFNBQVMsR0FBRyxJQUFJLHdCQUF3QixDQUFDLHFCQUFxQixFQUFFLEdBQUcsQ0FBQyxjQUFjLENBQUMsQ0FBQztZQUMxRixTQUFTLENBQUMsa0JBQWtCLEVBQUU7aUJBQ3pCLElBQUksQ0FBQyxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztpQkFDcEMsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQztRQUMxRCxDQUFDLENBQUMsQ0FBQztRQUVILE9BQU8sS0FBSyxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUMzRCxDQUFDO0lBRU0sa0JBQWtCO1FBQ3JCLE9BQU8sSUFBSSxPQUFPLENBQU0sQ0FBQyxPQUFPLEVBQUUsTUFBTSxFQUFFLEVBQUU7WUFDeEMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxlQUFlLEVBQUU7Z0JBQzdCLE1BQU0sSUFBSSxLQUFLLENBQUMsMERBQTBELENBQUMsQ0FBQzthQUMvRTtZQUVELEVBQUUsQ0FBQyxVQUFVLENBQUMsZUFBZSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxDQUFDO2lCQUN6QyxJQUFJLENBQUMsQ0FBQyxPQUE2QixFQUFFLEVBQUU7Z0JBQ3BDLE1BQU0sTUFBTSxHQUFHLEVBQUUsQ0FBQztnQkFFbEIsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUMsS0FBSyxFQUFFLEVBQUU7b0JBQzdCLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLE9BQU8sRUFBRSxFQUFFO3dCQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDOzRCQUNSLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTs0QkFDaEIsR0FBRyxFQUFFLE9BQU8sQ0FBQyxHQUFHOzRCQUNoQixPQUFPLEVBQUUsT0FBTyxDQUFDLFlBQVksQ0FBQzs0QkFDOUIsVUFBVSxFQUFFLEtBQUssQ0FBQyxVQUFVLENBQUM7eUJBQ2hDLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFFSCxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDcEIsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDckMsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0lBRU0sTUFBTSxDQUFDLEtBQVc7UUFDckIsT0FBTyxLQUFLLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9CLENBQUM7O0FBOUNNLHFDQUFZLEdBQUcscUJBQXFCLENBQUM7QUFEaEQsNERBZ0RDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgZXhwcmVzcyBmcm9tICdleHByZXNzJztcclxuaW1wb3J0IHtGaGlyTG9naWN9IGZyb20gJy4vZmhpckxvZ2ljJztcclxuaW1wb3J0ICogYXMgcnAgZnJvbSAncmVxdWVzdC1wcm9taXNlJztcclxuaW1wb3J0ICogYXMgY29uZmlnIGZyb20gJ2NvbmZpZyc7XHJcbmltcG9ydCAqIGFzIGxvZzRqcyBmcm9tICdsb2c0anMnO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5pbXBvcnQge2NoZWNrSnd0fSBmcm9tICcuLi9hdXRoSGVscGVyJztcclxuaW1wb3J0IHtFeHRlbmRlZFJlcXVlc3R9IGZyb20gJy4vbW9kZWxzJztcclxuaW1wb3J0IHtSZXF1ZXN0SGFuZGxlcn0gZnJvbSAnZXhwcmVzcyc7XHJcblxyXG5jb25zdCBmaGlyQ29uZmlnID0gY29uZmlnLmdldCgnZmhpcicpO1xyXG5jb25zdCBsb2cgPSBsb2c0anMuZ2V0TG9nZ2VyKCk7XHJcblxyXG5pbnRlcmZhY2UgUHVibGlzaGVkR3VpZGVzTW9kZWwge1xyXG4gICAgZ3VpZGVzOiBbe1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICAnbnBtLW5hbWUnOiBzdHJpbmc7XHJcbiAgICAgICAgZWRpdGlvbnM6IFt7XHJcbiAgICAgICAgICAgIHVybDogc3RyaW5nO1xyXG4gICAgICAgICAgICB2ZXJzaW9uOiBzdHJpbmc7XHJcbiAgICAgICAgfV1cclxuICAgIH1dO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgSW1wbGVtZW50YXRpb25HdWlkZUxvZ2ljIGV4dGVuZHMgRmhpckxvZ2ljIHtcclxuICAgIHN0YXRpYyByZXNvdXJjZVR5cGUgPSAnSW1wbGVtZW50YXRpb25HdWlkZSc7XHJcblxyXG4gICAgcHVibGljIHN0YXRpYyBpbml0Um91dGVzKCkge1xyXG4gICAgICAgIGNvbnN0IHJvdXRlciA9IGV4cHJlc3MuUm91dGVyKCk7XHJcblxyXG4gICAgICAgIHJvdXRlci5nZXQoJy9wdWJsaXNoZWQnLCA8UmVxdWVzdEhhbmRsZXI+IGNoZWNrSnd0LCAocmVxOiBFeHRlbmRlZFJlcXVlc3QsIHJlcykgPT4ge1xyXG4gICAgICAgICAgICBsb2cudHJhY2UoYEdldHRpbmcgbGlzdCBvZiBwdWJsaXNoZWQgaW1wbGVtZW50YXRpb24gZ3VpZGVzYCk7XHJcblxyXG4gICAgICAgICAgICBjb25zdCBmaGlyTG9naWMgPSBuZXcgSW1wbGVtZW50YXRpb25HdWlkZUxvZ2ljKCdJbXBsZW1lbnRhdGlvbkd1aWRlJywgcmVxLmZoaXJTZXJ2ZXJCYXNlKTtcclxuICAgICAgICAgICAgZmhpckxvZ2ljLmdldFB1Ymxpc2hlZEd1aWRlcygpXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0cykgPT4gcmVzLnNlbmQocmVzdWx0cykpXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4gdGhpcy5oYW5kbGVFcnJvcihlcnIsIG51bGwsIHJlcykpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gc3VwZXIuaW5pdFJvdXRlcygnSW1wbGVtZW50YXRpb25HdWlkZScsIHJvdXRlcik7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGdldFB1Ymxpc2hlZEd1aWRlcygpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxhbnk+KChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICAgICAgaWYgKCFmaGlyQ29uZmlnLnB1Ymxpc2hlZEd1aWRlcykge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdTZXJ2ZXIgaXMgbm90IGNvbmZpZ3VyZWQgd2l0aCBhIHB1Ymxpc2hlZEd1aWRlcyBwcm9wZXJ0eScpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBycChmaGlyQ29uZmlnLnB1Ymxpc2hlZEd1aWRlcywgeyBqc29uOiB0cnVlIH0pXHJcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0czogUHVibGlzaGVkR3VpZGVzTW9kZWwpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBndWlkZXMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgXy5lYWNoKHJlc3VsdHMuZ3VpZGVzLCAoZ3VpZGUpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgXy5lYWNoKGd1aWRlLmVkaXRpb25zLCAoZWRpdGlvbikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3VpZGVzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU6IGd1aWRlLm5hbWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiBlZGl0aW9uLnVybCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ZXJzaW9uOiBlZGl0aW9uWydpZy12ZXJzaW9uJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ25wbS1uYW1lJzogZ3VpZGVbJ25wbS1uYW1lJ11cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShndWlkZXMpO1xyXG4gICAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHNlYXJjaChxdWVyeT86IGFueSk6IFByb21pc2U8YW55PiB7XHJcbiAgICAgICAgcmV0dXJuIHN1cGVyLnNlYXJjaChxdWVyeSk7XHJcbiAgICB9XHJcbn1cclxuIl19