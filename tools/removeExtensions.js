"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseTools_1 = require("./baseTools");
class RemoveExtensions extends baseTools_1.BaseTools {
    constructor(options) {
        super();
        this.options = options;
        if (typeof this.options.extension === 'string') {
            this.options.extension = [this.options.extension];
        }
        else if (!this.options.extension) {
            this.options.extension = [];
        }
        if (typeof this.options.excludeResourceType === 'string') {
            this.options.excludeResourceType = [this.options.excludeResourceType];
        }
        else if (!this.options.excludeResourceType) {
            this.options.excludeResourceType = [];
        }
    }
    removeExtensions(allResources) {
        const changedResources = [];
        allResources.forEach((resource) => {
            let resourceChanged = false;
            if (this.options.excludeResourceType.indexOf(resource.resourceType) >= 0) {
                return;
            }
            const foundExtensions = (resource.extension || []).filter((extension) => {
                return this.options.extension.indexOf(extension.url) >= 0;
            });
            foundExtensions.forEach((foundExtension) => {
                const index = resource.extension.indexOf(foundExtension);
                resource.extension.splice(index, 1);
                resourceChanged = true;
            });
            if (resourceChanged) {
                changedResources.push(resource);
            }
        });
        return changedResources;
    }
    execute() {
        this.getAllResources(this.options.server)
            .then((allResources) => {
            const changedResources = this.removeExtensions(allResources);
            console.log(`Changes are being saved for ${changedResources.length} resources`);
            const savePromises = changedResources.map((changedResource) => this.saveResource(this.options.server, changedResource));
            return Promise.all(savePromises);
        })
            .then(() => {
            console.log('All changes have been saved');
            process.exit(0);
        })
            .catch((err) => {
            console.error(err);
            process.exit(1);
        });
    }
}
exports.RemoveExtensions = RemoveExtensions;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlRXh0ZW5zaW9ucy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbInJlbW92ZUV4dGVuc2lvbnMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSwyQ0FBc0M7QUFTdEMsTUFBYSxnQkFBaUIsU0FBUSxxQkFBUztJQUc3QyxZQUFZLE9BQWdDO1FBQzFDLEtBQUssRUFBRSxDQUFDO1FBRVIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFFdkIsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxLQUFLLFFBQVEsRUFBRTtZQUM5QyxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7U0FDbkQ7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEVBQUU7WUFDbEMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsRUFBRSxDQUFDO1NBQzdCO1FBRUQsSUFBSSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEtBQUssUUFBUSxFQUFFO1lBQ3hELElBQUksQ0FBQyxPQUFPLENBQUMsbUJBQW1CLEdBQUcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDdkU7YUFBTSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRTtZQUM1QyxJQUFJLENBQUMsT0FBTyxDQUFDLG1CQUFtQixHQUFHLEVBQUUsQ0FBQztTQUN2QztJQUNILENBQUM7SUFFTyxnQkFBZ0IsQ0FBQyxZQUE4QjtRQUNyRCxNQUFNLGdCQUFnQixHQUFHLEVBQUUsQ0FBQztRQUU1QixZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUU7WUFDaEMsSUFBSSxlQUFlLEdBQUcsS0FBSyxDQUFDO1lBRTVCLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDeEUsT0FBTzthQUNSO1lBRUQsTUFBTSxlQUFlLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLFNBQVMsRUFBRSxFQUFFO2dCQUN0RSxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO1lBQzVELENBQUMsQ0FBQyxDQUFDO1lBRUgsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDLGNBQWMsRUFBRSxFQUFFO2dCQUN6QyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsQ0FBQztnQkFDekQsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUNwQyxlQUFlLEdBQUcsSUFBSSxDQUFDO1lBQ3pCLENBQUMsQ0FBQyxDQUFDO1lBRUgsSUFBSSxlQUFlLEVBQUU7Z0JBQ25CLGdCQUFnQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUNqQztRQUNILENBQUMsQ0FBQyxDQUFDO1FBRUgsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU0sT0FBTztRQUNaLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUM7YUFDdEMsSUFBSSxDQUFDLENBQUMsWUFBWSxFQUFFLEVBQUU7WUFDckIsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsWUFBWSxDQUFDLENBQUM7WUFFN0QsT0FBTyxDQUFDLEdBQUcsQ0FBQywrQkFBK0IsZ0JBQWdCLENBQUMsTUFBTSxZQUFZLENBQUMsQ0FBQztZQUVoRixNQUFNLFlBQVksR0FBRyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxlQUFlLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsZUFBZSxDQUFDLENBQUMsQ0FBQztZQUN4SCxPQUFPLE9BQU8sQ0FBQyxHQUFHLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbkMsQ0FBQyxDQUFDO2FBQ0QsSUFBSSxDQUFDLEdBQUcsRUFBRTtZQUNULE9BQU8sQ0FBQyxHQUFHLENBQUMsNkJBQTZCLENBQUMsQ0FBQztZQUMzQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQzthQUNELEtBQUssQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1lBQ2IsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNuQixPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2xCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztDQUNGO0FBcEVELDRDQW9FQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHJlcXVlc3QgZnJvbSAncmVxdWVzdCc7XHJcbmltcG9ydCB7QmFzZVRvb2xzfSBmcm9tICcuL2Jhc2VUb29scyc7XHJcbmltcG9ydCB7RG9tYWluUmVzb3VyY2V9IGZyb20gJy4uL2xpYnMvdG9mLWxpYi9zcmMvbGliL3N0dTMvZmhpcic7XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJlbW92ZUV4dGVuc2lvbnNPcHRpb25zIHtcclxuICBzZXJ2ZXI6IHN0cmluZztcclxuICBleHRlbnNpb246IHN0cmluZyB8IHN0cmluZ1tdO1xyXG4gIGV4Y2x1ZGVSZXNvdXJjZVR5cGU6IHN0cmluZyB8IHN0cmluZ1tdO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgUmVtb3ZlRXh0ZW5zaW9ucyBleHRlbmRzIEJhc2VUb29scyB7XHJcbiAgcmVhZG9ubHkgb3B0aW9uczogUmVtb3ZlRXh0ZW5zaW9uc09wdGlvbnM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFJlbW92ZUV4dGVuc2lvbnNPcHRpb25zKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9uID09PSAnc3RyaW5nJykge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9uID0gW3RoaXMub3B0aW9ucy5leHRlbnNpb25dO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5vcHRpb25zLmV4dGVuc2lvbikge1xyXG4gICAgICB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9uID0gW107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZXhjbHVkZVJlc291cmNlVHlwZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLmV4Y2x1ZGVSZXNvdXJjZVR5cGUgPSBbdGhpcy5vcHRpb25zLmV4Y2x1ZGVSZXNvdXJjZVR5cGVdO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5vcHRpb25zLmV4Y2x1ZGVSZXNvdXJjZVR5cGUpIHtcclxuICAgICAgdGhpcy5vcHRpb25zLmV4Y2x1ZGVSZXNvdXJjZVR5cGUgPSBbXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByaXZhdGUgcmVtb3ZlRXh0ZW5zaW9ucyhhbGxSZXNvdXJjZXM6IERvbWFpblJlc291cmNlW10pOiBEb21haW5SZXNvdXJjZVtdIHtcclxuICAgIGNvbnN0IGNoYW5nZWRSZXNvdXJjZXMgPSBbXTtcclxuXHJcbiAgICBhbGxSZXNvdXJjZXMuZm9yRWFjaCgocmVzb3VyY2UpID0+IHtcclxuICAgICAgbGV0IHJlc291cmNlQ2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5leGNsdWRlUmVzb3VyY2VUeXBlLmluZGV4T2YocmVzb3VyY2UucmVzb3VyY2VUeXBlKSA+PSAwKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBmb3VuZEV4dGVuc2lvbnMgPSAocmVzb3VyY2UuZXh0ZW5zaW9uIHx8IFtdKS5maWx0ZXIoKGV4dGVuc2lvbikgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZXh0ZW5zaW9uLmluZGV4T2YoZXh0ZW5zaW9uLnVybCkgPj0gMDtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICBmb3VuZEV4dGVuc2lvbnMuZm9yRWFjaCgoZm91bmRFeHRlbnNpb24pID0+IHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHJlc291cmNlLmV4dGVuc2lvbi5pbmRleE9mKGZvdW5kRXh0ZW5zaW9uKTtcclxuICAgICAgICByZXNvdXJjZS5leHRlbnNpb24uc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICByZXNvdXJjZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChyZXNvdXJjZUNoYW5nZWQpIHtcclxuICAgICAgICBjaGFuZ2VkUmVzb3VyY2VzLnB1c2gocmVzb3VyY2UpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gY2hhbmdlZFJlc291cmNlcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBleGVjdXRlKCkge1xyXG4gICAgdGhpcy5nZXRBbGxSZXNvdXJjZXModGhpcy5vcHRpb25zLnNlcnZlcilcclxuICAgICAgLnRoZW4oKGFsbFJlc291cmNlcykgPT4ge1xyXG4gICAgICAgIGNvbnN0IGNoYW5nZWRSZXNvdXJjZXMgPSB0aGlzLnJlbW92ZUV4dGVuc2lvbnMoYWxsUmVzb3VyY2VzKTtcclxuXHJcbiAgICAgICAgY29uc29sZS5sb2coYENoYW5nZXMgYXJlIGJlaW5nIHNhdmVkIGZvciAke2NoYW5nZWRSZXNvdXJjZXMubGVuZ3RofSByZXNvdXJjZXNgKTtcclxuXHJcbiAgICAgICAgY29uc3Qgc2F2ZVByb21pc2VzID0gY2hhbmdlZFJlc291cmNlcy5tYXAoKGNoYW5nZWRSZXNvdXJjZSkgPT4gdGhpcy5zYXZlUmVzb3VyY2UodGhpcy5vcHRpb25zLnNlcnZlciwgY2hhbmdlZFJlc291cmNlKSk7XHJcbiAgICAgICAgcmV0dXJuIFByb21pc2UuYWxsKHNhdmVQcm9taXNlcyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC50aGVuKCgpID0+IHtcclxuICAgICAgICBjb25zb2xlLmxvZygnQWxsIGNoYW5nZXMgaGF2ZSBiZWVuIHNhdmVkJyk7XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDApO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goKGVycikgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUuZXJyb3IoZXJyKTtcclxuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=