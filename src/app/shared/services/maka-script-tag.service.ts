import {
    Injectable,
    Inject,
    Renderer2
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { ExternalLibrary } from 'src/app/core/models/maka-config.model';

@Injectable({
    providedIn: 'root',
})
export class MakaScriptTagService {

    constructor(
        @Inject(DOCUMENT) private currentDocument: Document
    ) { }

    addScript(exterbalLib: ExternalLibrary): void {
        const script = exterbalLib.renderer.createElement('script');

        script.type = exterbalLib.type;
        script.charset = exterbalLib.charset;

        if (exterbalLib.id) {
            // Replace script content instead of append
            if (this.currentDocument.getElementById(exterbalLib.id) && exterbalLib.text) {
                return exterbalLib.renderer.setProperty(this.currentDocument.getElementById(exterbalLib.id), 'text', exterbalLib.text);
            }
            script.id = exterbalLib.id;
        }

        if (exterbalLib.src) {
            script.src = exterbalLib.src;
        }

        if (exterbalLib.text) {
            script.text = exterbalLib.text;
        }

        if (exterbalLib.onload) {
            script.onload = exterbalLib.onload;
        }

        if (exterbalLib.className) {
            exterbalLib.renderer.setAttribute(script, 'class', exterbalLib.className);
        }

        exterbalLib.renderer.appendChild(this.getSectionByName(exterbalLib.section), script);

        return script;
    }

    getSectionByName(section: string) {
        return (section && this.currentDocument[section]) ?
            this.currentDocument[section] : this.currentDocument.head;
    }

    removeScript(renderer: Renderer2, id: string, section: string) {
        if (this.currentDocument.getElementById(id)) {
          renderer.removeChild(this.getSectionByName(section), this.currentDocument.getElementById(id));
        }
    }
}
