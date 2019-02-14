"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const FhirHelper = require("../fhirHelper");
const log4js = require("log4js");
class BaseController {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29udHJvbGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImNvbnRyb2xsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0Q0FBNEM7QUFDNUMsaUNBQWlDO0FBRWpDO0lBR2MsTUFBTSxDQUFDLFdBQVcsQ0FBQyxHQUFHLEVBQUUsSUFBSyxFQUFFLEdBQUksRUFBRSxjQUFjLEdBQUcsMkJBQTJCO1FBQ3ZGLE1BQU0sR0FBRyxHQUFHLFVBQVUsQ0FBQyxjQUFjLENBQUMsR0FBRyxFQUFFLElBQUksRUFBRSxjQUFjLENBQUMsQ0FBQztRQUVqRSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUVwQixJQUFJLEdBQUcsRUFBRTtZQUNMLElBQUksR0FBRyxJQUFJLEdBQUcsQ0FBQyxVQUFVLEVBQUU7Z0JBQ3ZCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO2FBQzlCO2lCQUFNO2dCQUNILEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7YUFDbkI7WUFFRCxHQUFHLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQ2pCO0lBQ0wsQ0FBQzs7QUFoQmdCLGtCQUFHLEdBQUcsTUFBTSxDQUFDLFNBQVMsRUFBRSxDQUFDO0FBRDlDLHdDQWtCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIEZoaXJIZWxwZXIgZnJvbSAnLi4vZmhpckhlbHBlcic7XHJcbmltcG9ydCAqIGFzIGxvZzRqcyBmcm9tICdsb2c0anMnO1xyXG5cclxuZXhwb3J0IGNsYXNzIEJhc2VDb250cm9sbGVyIHtcclxuICAgIHByb3RlY3RlZCBzdGF0aWMgbG9nID0gbG9nNGpzLmdldExvZ2dlcigpO1xyXG5cclxuICAgIHByb3RlY3RlZCBzdGF0aWMgaGFuZGxlRXJyb3IoZXJyLCBib2R5PywgcmVzPywgZGVmYXVsdE1lc3NhZ2UgPSAnQW4gdW5rbm93biBlcnJvciBvY2N1cnJlZCcpIHtcclxuICAgICAgICBjb25zdCBtc2cgPSBGaGlySGVscGVyLmdldEVycm9yU3RyaW5nKGVyciwgYm9keSwgZGVmYXVsdE1lc3NhZ2UpO1xyXG5cclxuICAgICAgICB0aGlzLmxvZy5lcnJvcihtc2cpO1xyXG5cclxuICAgICAgICBpZiAocmVzKSB7XHJcbiAgICAgICAgICAgIGlmIChlcnIgJiYgZXJyLnN0YXR1c0NvZGUpIHtcclxuICAgICAgICAgICAgICAgIHJlcy5zdGF0dXMoZXJyLnN0YXR1c0NvZGUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmVzLnN0YXR1cyg1MDApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXMuc2VuZChtc2cpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSJdfQ==