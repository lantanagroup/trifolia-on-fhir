"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FhirHelper = require("../fhirHelper");
const log4js = require("log4js");
class BaseController {
    static handleResponse(res, actual) {
        if (actual.contentType) {
            res.contentType(actual.contentType);
        }
        if (actual.contentDisposition) {
            res.setHeader('Content-Disposition', actual.contentDisposition);
        }
        res.status(actual.status || 200).send(actual.content);
    }
    static handleError(err, body, res, defaultMessage = 'An unknown error occurred') {
        const msg = FhirHelper.getErrorString(err, body, defaultMessage);
        this.log.error(msg);
        if (res) {
            if (err && err.statusCode) {
                res.status(err.statusCode);
            }
            else {
                res.status(500);
            }
            res.send(msg);
        }
    }
}
BaseController.log = log4js.getLogger();
exports.BaseController = BaseController;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNEM7QUFDNUMsaUNBQWlDO0FBVWpDLE1BQWEsY0FBYztJQUdiLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBYSxFQUFFLE1BQXVCO1FBQ2xFLElBQUksTUFBTSxDQUFDLFdBQVcsRUFBRTtZQUNwQixHQUFHLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztTQUN2QztRQUVELElBQUksTUFBTSxDQUFDLGtCQUFrQixFQUFFO1lBQzNCLEdBQUcsQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsTUFBTSxDQUFDLGtCQUFrQixDQUFDLENBQUM7U0FDbkU7UUFFRCxHQUFHLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUMxRCxDQUFDO0lBRVMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSyxFQUFFLEdBQUksRUFBRSxjQUFjLEdBQUcsMkJBQTJCO1FBQ3ZGLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwQixJQUFJLEdBQUcsRUFBRTtZQUNMLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3ZCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNO2dCQUNILEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkI7WUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQzs7QUE1QmdCLGtCQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRDlDLHdDQThCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEZoaXJIZWxwZXIgZnJvbSAnLi4vZmhpckhlbHBlcic7XHJcbmltcG9ydCAqIGFzIGxvZzRqcyBmcm9tICdsb2c0anMnO1xyXG5pbXBvcnQge1Jlc3BvbnNlfSBmcm9tICdleHByZXNzJztcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR2VuZXJpY1Jlc3BvbnNlIHtcclxuICAgIHN0YXR1cz86IG51bWJlcjtcclxuICAgIGNvbnRlbnRUeXBlPzogc3RyaW5nO1xyXG4gICAgY29udGVudERpc3Bvc2l0aW9uPzogc3RyaW5nO1xyXG4gICAgY29udGVudDogYW55O1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZUNvbnRyb2xsZXIge1xyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBsb2cgPSBsb2c0anMuZ2V0TG9nZ2VyKCk7XHJcblxyXG4gICAgcHJvdGVjdGVkIHN0YXRpYyBoYW5kbGVSZXNwb25zZShyZXM6IFJlc3BvbnNlLCBhY3R1YWw6IEdlbmVyaWNSZXNwb25zZSkge1xyXG4gICAgICAgIGlmIChhY3R1YWwuY29udGVudFR5cGUpIHtcclxuICAgICAgICAgICAgcmVzLmNvbnRlbnRUeXBlKGFjdHVhbC5jb250ZW50VHlwZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoYWN0dWFsLmNvbnRlbnREaXNwb3NpdGlvbikge1xyXG4gICAgICAgICAgICByZXMuc2V0SGVhZGVyKCdDb250ZW50LURpc3Bvc2l0aW9uJywgYWN0dWFsLmNvbnRlbnREaXNwb3NpdGlvbik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXMuc3RhdHVzKGFjdHVhbC5zdGF0dXMgfHwgMjAwKS5zZW5kKGFjdHVhbC5jb250ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGhhbmRsZUVycm9yKGVyciwgYm9keT8sIHJlcz8sIGRlZmF1bHRNZXNzYWdlID0gJ0FuIHVua25vd24gZXJyb3Igb2NjdXJyZWQnKSB7XHJcbiAgICAgICAgY29uc3QgbXNnID0gRmhpckhlbHBlci5nZXRFcnJvclN0cmluZyhlcnIsIGJvZHksIGRlZmF1bHRNZXNzYWdlKTtcclxuXHJcbiAgICAgICAgdGhpcy5sb2cuZXJyb3IobXNnKTtcclxuXHJcbiAgICAgICAgaWYgKHJlcykge1xyXG4gICAgICAgICAgICBpZiAoZXJyICYmIGVyci5zdGF0dXNDb2RlKSB7XHJcbiAgICAgICAgICAgICAgICByZXMuc3RhdHVzKGVyci5zdGF0dXNDb2RlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoNTAwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmVzLnNlbmQobXNnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXX0=