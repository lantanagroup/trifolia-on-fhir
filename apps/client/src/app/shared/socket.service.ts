import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {io, Socket} from 'socket.io-client';
import {Practitioner} from '../../../../../libs/tof-lib/src/lib/stu3/fhir';

export class HtmlExportStatus {
    public status: string;                  // when dealing with exports
    public packageId: string;               // when dealing with exports
    public message: string;
}

@Injectable({
    providedIn: 'root'
})
export class SocketService implements OnDestroy {
    readonly socket: Socket = io(location.origin);
    public onHtmlExport = new EventEmitter<HtmlExportStatus>();
    public onMessage = new EventEmitter<string>();
    public onConnected = new EventEmitter<null>();
    public authInfoSent = false;

    constructor() {
        this.socket.on('html-export', (data: HtmlExportStatus) => {
            this.onHtmlExport.emit(data);
        });

        this.socket.on('message', (message: string) => {
            this.onMessage.emit(message);
        });

        this.socket.on('error', (err) => {
            console.log('A socket error occurred: ' + err);
        });

        this.socket.on('connect', () => {
            this.onConnected.emit();
        });

        this.socket.on('disconnect', () => {
            console.log('socket disconnected');
            this.authInfoSent = false;
        });
    }

    public get socketId(): string {
        if (this.socket) {
            return this.socket.id;
        }
    }

    notifyAuthenticated(userProfile?: any, practitioner?: Practitioner) {
        if (!this.authInfoSent) {
            this.socket.emit('authenticated', {
                userProfile: userProfile,
                practitioner: practitioner
            });
            this.authInfoSent = true;
        }
    }

    notifyExporting(packageId) {
        this.socket.emit('exporting', packageId);
    }

    ngOnDestroy() {
        this.socket.disconnect();
    }
}
