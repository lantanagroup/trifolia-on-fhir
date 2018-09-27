import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import * as io from 'socket.io-client';
import {saveAs} from 'file-saver';
import {Practitioner} from '../models/stu3/fhir';

export class SocketMessage {
    public status: string;                  // when dealing with exports
    public packageId: string;               // when dealing with exports
    public message: string;
}

@Injectable({
    providedIn: 'root'
})
export class SocketService implements OnDestroy {
    private socket;
    public onMessage = new EventEmitter<SocketMessage>();
    public onConnected = new EventEmitter<null>();
    public authInfoSent = false;

    constructor() {
        this.socket = io(location.origin);

        this.socket.on('message', (data: SocketMessage) => {
            this.onMessage.emit(data);
        });

        this.socket.on('error', (err) => {
            console.log('A socket error occurred: ' + err);
        });

        this.socket.on('connect', () => {
            this.onConnected.emit();
        });

        this.socket.on('disconnect', () => this.authInfoSent = false);
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

    ngOnDestroy() {
        this.socket.disconnect();
    }
}
