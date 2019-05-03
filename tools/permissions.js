"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const baseTools_1 = require("./baseTools");
const globals_1 = require("../src/app/globals");
const _ = require("underscore");
const rp = require("request-promise");
class BasePermissions extends baseTools_1.BaseTools {
    constructor(options) {
        super();
        this.options = options;
        if (!options.allResources && !options.resourceType && !options.resourceId) {
            throw new Error('You must specify either "all" or "resourceType" and "resourceId"');
        }
    }
    getResources() {
        if (this.options.allResources) {
            return this.getAllResources(this.options.server);
        }
        else if (this.options.resourceType && this.options.resourceId) {
            return new Promise((resolve, reject) => {
                this.getResource(this.options.server, this.options.resourceType, this.options.resourceId)
                    .then((results) => resolve([results]))
                    .catch((err) => reject(err));
            });
        }
    }
}
exports.BasePermissions = BasePermissions;
class RemovePermission extends BasePermissions {
    removePermission(resource) {
        const delim = globals_1.Globals.securityDelim;
        const securityTag = this.options.type === 'everyone' ?
            `${this.options.type}${delim}${this.options.permission}` :
            `${this.options.type}${delim}${this.options.id}${delim}${this.options.permission}`;
        const options = {
            method: 'POST',
            url: this.options.server + (this.options.server.endsWith('/') ? '' : '/') + resource.resourceType + '/' + resource.id + '/$meta-delete',
            json: true,
            body: {
                resourceType: 'Parameters',
                parameter: [{
                        name: 'meta',
                        valueMeta: {
                            security: {
                                system: globals_1.Globals.securitySystem,
                                code: securityTag
                            }
                        }
                    }]
            }
        };
        return rp(options);
    }
    execute() {
        this.getResources()
            .then((resources) => {
            const removePromises = _.map(resources, (resource) => this.removePermission(resource));
            return Promise.all(removePromises);
        })
            .then(() => {
            console.log('Done removing permission from resources');
            process.exit(0);
        })
            .catch((err) => {
            this.printError(err);
            process.exit(1);
        });
    }
}
exports.RemovePermission = RemovePermission;
class AddPermission extends BasePermissions {
    execute() {
        this.getResources()
            .then((resources) => {
            const savePromises = _.chain(resources)
                .filter((resource) => {
                resource.meta = resource.meta || {};
                return globals_1.Globals.addPermission(resource.meta, this.options.type, this.options.permission, this.options.id);
            })
                .map((resource) => this.saveResource(this.options.server, resource))
                .value();
            return Promise.all(savePromises);
        })
            .then(() => {
            console.log('Done adding permissions to resources');
            process.exit(0);
        })
            .catch((err) => {
            this.printError(err);
            process.exit(1);
        });
    }
}
exports.AddPermission = AddPermission;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGVybWlzc2lvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJwZXJtaXNzaW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJDQUFzQztBQUd0QyxnREFBMkM7QUFDM0MsZ0NBQWdDO0FBQ2hDLHNDQUFzQztBQVl0QyxNQUFhLGVBQWdCLFNBQVEscUJBQVM7SUFHNUMsWUFBWSxPQUEwQjtRQUNwQyxLQUFLLEVBQUUsQ0FBQztRQUVSLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO1FBRXZCLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDekUsTUFBTSxJQUFJLEtBQUssQ0FBQyxrRUFBa0UsQ0FBQyxDQUFDO1NBQ3JGO0lBQ0gsQ0FBQztJQUVTLFlBQVk7UUFDcEIsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRTtZQUM3QixPQUFPLElBQUksQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUNsRDthQUFNLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxZQUFZLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUU7WUFDL0QsT0FBTyxJQUFJLE9BQU8sQ0FBQyxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDckMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFlBQVksRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQztxQkFDdEYsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO3FCQUNyQyxLQUFLLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxH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QUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUMzRyxDQUFDLENBQUM7aUJBQ0QsR0FBRyxDQUFDLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO2lCQUNuRSxLQUFLLEVBQUUsQ0FBQztZQUVYLE9BQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLENBQUMsQ0FBQztRQUNuQyxDQUFDLENBQUM7YUFDRCxJQUFJLENBQUMsR0FBRyxFQUFFO1lBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3BELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLENBQUMsR0FBRyxFQUFFLEVBQUU7WUFDYixJQUFJLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3JCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbEIsQ0FBQyxDQUFDLENBQUM7SUFDUCxDQUFDO0NBQ0Y7QUF2QkQsc0NBdUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtCYXNlVG9vbHN9IGZyb20gJy4vYmFzZVRvb2xzJztcclxuaW1wb3J0IHtGaGlyfSBmcm9tICcuLi9zZXJ2ZXIvY29udHJvbGxlcnMvbW9kZWxzJztcclxuaW1wb3J0IERvbWFpblJlc291cmNlID0gRmhpci5Eb21haW5SZXNvdXJjZTtcclxuaW1wb3J0IHtHbG9iYWxzfSBmcm9tICcuLi9zcmMvYXBwL2dsb2JhbHMnO1xyXG5pbXBvcnQgKiBhcyBfIGZyb20gJ3VuZGVyc2NvcmUnO1xyXG5pbXBvcnQgKiBhcyBycCBmcm9tICdyZXF1ZXN0LXByb21pc2UnO1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBQZXJtaXNzaW9uT3B0aW9ucyB7XHJcbiAgc2VydmVyOiBzdHJpbmc7XHJcbiAgdHlwZTogJ2V2ZXJ5b25lJ3wnZ3JvdXAnfCd1c2VyJztcclxuICBwZXJtaXNzaW9uOiAncmVhZCd8J3dyaXRlJztcclxuICBpZD86IHN0cmluZztcclxuICBhbGxSZXNvdXJjZXM/OiBib29sZWFuO1xyXG4gIHJlc291cmNlVHlwZT86IHN0cmluZztcclxuICByZXNvdXJjZUlkPzogc3RyaW5nO1xyXG59XHJcblxyXG5leHBvcnQgY2xhc3MgQmFzZVBlcm1pc3Npb25zIGV4dGVuZHMgQmFzZVRvb2xzIHtcclxuICBwcm90ZWN0ZWQgb3B0aW9uczogUGVybWlzc2lvbk9wdGlvbnM7XHJcblxyXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnM6IFBlcm1pc3Npb25PcHRpb25zKSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnM7XHJcblxyXG4gICAgaWYgKCFvcHRpb25zLmFsbFJlc291cmNlcyAmJiAhb3B0aW9ucy5yZXNvdXJjZVR5cGUgJiYgIW9wdGlvbnMucmVzb3VyY2VJZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBtdXN0IHNwZWNpZnkgZWl0aGVyIFwiYWxsXCIgb3IgXCJyZXNvdXJjZVR5cGVcIiBhbmQgXCJyZXNvdXJjZUlkXCInKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHByb3RlY3RlZCBnZXRSZXNvdXJjZXMoKTogUHJvbWlzZTxEb21haW5SZXNvdXJjZVtdPiB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmFsbFJlc291cmNlcykge1xyXG4gICAgICByZXR1cm4gdGhpcy5nZXRBbGxSZXNvdXJjZXModGhpcy5vcHRpb25zLnNlcnZlcik7XHJcbiAgICB9IGVsc2UgaWYgKHRoaXMub3B0aW9ucy5yZXNvdXJjZVR5cGUgJiYgdGhpcy5vcHRpb25zLnJlc291cmNlSWQpIHtcclxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgICB0aGlzLmdldFJlc291cmNlKHRoaXMub3B0aW9ucy5zZXJ2ZXIsIHRoaXMub3B0aW9ucy5yZXNvdXJjZVR5cGUsIHRoaXMub3B0aW9ucy5yZXNvdXJjZUlkKVxyXG4gICAgICAgICAgLnRoZW4oKHJlc3VsdHMpID0+IHJlc29sdmUoW3Jlc3VsdHNdKSlcclxuICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiByZWplY3QoZXJyKSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIFJlbW92ZVBlcm1pc3Npb24gZXh0ZW5kcyBCYXNlUGVybWlzc2lvbnMge1xyXG4gIHByaXZhdGUgcmVtb3ZlUGVybWlzc2lvbihyZXNvdXJjZTogRG9tYWluUmVzb3VyY2UpIHtcclxuICAgIGNvbnN0IGRlbGltID0gR2xvYmFscy5zZWN1cml0eURlbGltO1xyXG4gICAgY29uc3Qgc2VjdXJpdHlUYWcgPSB0aGlzLm9wdGlvbnMudHlwZSA9PT0gJ2V2ZXJ5b25lJyA/XHJcbiAgICAgIGAke3RoaXMub3B0aW9ucy50eXBlfSR7ZGVsaW19JHt0aGlzLm9wdGlvbnMucGVybWlzc2lvbn1gIDpcclxuICAgICAgYCR7dGhpcy5vcHRpb25zLnR5cGV9JHtkZWxpbX0ke3RoaXMub3B0aW9ucy5pZH0ke2RlbGltfSR7dGhpcy5vcHRpb25zLnBlcm1pc3Npb259YDtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICB1cmw6IHRoaXMub3B0aW9ucy5zZXJ2ZXIgKyAodGhpcy5vcHRpb25zLnNlcnZlci5lbmRzV2l0aCgnLycpID8gJycgOiAnLycpICsgcmVzb3VyY2UucmVzb3VyY2VUeXBlICsgJy8nICsgcmVzb3VyY2UuaWQgKyAnLyRtZXRhLWRlbGV0ZScsXHJcbiAgICAgIGpzb246IHRydWUsXHJcbiAgICAgIGJvZHk6IHtcclxuICAgICAgICByZXNvdXJjZVR5cGU6ICdQYXJhbWV0ZXJzJyxcclxuICAgICAgICBwYXJhbWV0ZXI6IFt7XHJcbiAgICAgICAgICBuYW1lOiAnbWV0YScsXHJcbiAgICAgICAgICB2YWx1ZU1ldGE6IHtcclxuICAgICAgICAgICAgc2VjdXJpdHk6IHtcclxuICAgICAgICAgICAgICBzeXN0ZW06IEdsb2JhbHMuc2VjdXJpdHlTeXN0ZW0sXHJcbiAgICAgICAgICAgICAgY29kZTogc2VjdXJpdHlUYWdcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1dXHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHJwKG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgcHVibGljIGV4ZWN1dGUoKSB7XHJcbiAgICB0aGlzLmdldFJlc291cmNlcygpXHJcbiAgICAgIC50aGVuKChyZXNvdXJjZXM6IERvbWFpblJlc291cmNlW10pID0+IHtcclxuICAgICAgICBjb25zdCByZW1vdmVQcm9taXNlcyA9IF8ubWFwKHJlc291cmNlcywgKHJlc291cmNlKSA9PiB0aGlzLnJlbW92ZVBlcm1pc3Npb24ocmVzb3VyY2UpKTtcclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwocmVtb3ZlUHJvbWlzZXMpO1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbigoKSA9PiB7XHJcbiAgICAgICAgY29uc29sZS5sb2coJ0RvbmUgcmVtb3ZpbmcgcGVybWlzc2lvbiBmcm9tIHJlc291cmNlcycpO1xyXG4gICAgICAgIHByb2Nlc3MuZXhpdCgwKTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKChlcnIpID0+IHtcclxuICAgICAgICB0aGlzLnByaW50RXJyb3IoZXJyKTtcclxuICAgICAgICBwcm9jZXNzLmV4aXQoMSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEFkZFBlcm1pc3Npb24gZXh0ZW5kcyBCYXNlUGVybWlzc2lvbnMge1xyXG4gIHB1YmxpYyBleGVjdXRlKCkge1xyXG4gICAgdGhpcy5nZXRSZXNvdXJjZXMoKVxyXG4gICAgICAudGhlbigocmVzb3VyY2VzOiBEb21haW5SZXNvdXJjZVtdKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2F2ZVByb21pc2VzID0gXy5jaGFpbihyZXNvdXJjZXMpXHJcbiAgICAgICAgICAuZmlsdGVyKChyZXNvdXJjZSkgPT4ge1xyXG4gICAgICAgICAgICByZXNvdXJjZS5tZXRhID0gcmVzb3VyY2UubWV0YSB8fCB7fTtcclxuICAgICAgICAgICAgcmV0dXJuIEdsb2JhbHMuYWRkUGVybWlzc2lvbihyZXNvdXJjZS5tZXRhLCB0aGlzLm9wdGlvbnMudHlwZSwgdGhpcy5vcHRpb25zLnBlcm1pc3Npb24sIHRoaXMub3B0aW9ucy5pZCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLm1hcCgocmVzb3VyY2UpID0+IHRoaXMuc2F2ZVJlc291cmNlKHRoaXMub3B0aW9ucy5zZXJ2ZXIsIHJlc291cmNlKSlcclxuICAgICAgICAgIC52YWx1ZSgpO1xyXG5cclxuICAgICAgICByZXR1cm4gUHJvbWlzZS5hbGwoc2F2ZVByb21pc2VzKTtcclxuICAgICAgfSlcclxuICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdEb25lIGFkZGluZyBwZXJtaXNzaW9ucyB0byByZXNvdXJjZXMnKTtcclxuICAgICAgICBwcm9jZXNzLmV4aXQoMCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5wcmludEVycm9yKGVycik7XHJcbiAgICAgICAgcHJvY2Vzcy5leGl0KDEpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbn1cclxuIl19