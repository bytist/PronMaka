import { Injectable, Inject, Renderer2 } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { MakaScriptTagService } from '../../../../../shared/services/maka-script-tag.service';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class MakaOpenpayService {

    constructor(private scriptTagService: MakaScriptTagService,
                @Inject(DOCUMENT) private doc: Document){}

    private inserted: boolean;
    private coreScriptId = 'openpay-script';
    private dataScriptId = 'openpay-data-script';
    private scriptSection = 'body';
    private insertedIframesIds = ['_op_data_r', '_op_data_antifraud'];

    setInserted(inserted: boolean) {
        this.inserted = inserted;
    }

    getInserted() {
        return this.inserted;
    }

    addScripts(renderer2: Renderer2, callback: any) {
        if (!this.inserted) {
            // load scripts sequentially
            this.scriptTagService.addScript({
                renderer: renderer2,
                type: 'text/javascript',
                src: environment.externalUrls.openpay,
                id: this.coreScriptId,
                charset: 'UTF-8',
                section: this.scriptSection,
                text: null,
                onload: () => {
                    this.scriptTagService.addScript({
                        renderer: renderer2,
                        type: 'text/javascript',
                        src: environment.externalUrls.openpayData,
                        id: this.dataScriptId,
                        charset: 'UTF-8',
                        section: this.scriptSection,
                        text: null,
                        onload: () => callback()
                    });
                    this.inserted = true;
                }
            });
        } else {
          return callback();
        }
    }

    removeScripts(renderer2: Renderer2) {
        if (this.inserted) {
            this.scriptTagService.removeScript(renderer2, this.coreScriptId, this.scriptSection);
            this.scriptTagService.removeScript(renderer2, this.dataScriptId, this.scriptSection);
            // openpay  also may also add some iframes
            this.insertedIframesIds.forEach(iframeId => {
                if (this.doc.getElementById(iframeId)) {
                    renderer2.removeChild(this.doc.body, this.doc.getElementById(iframeId));
                }
            });
            this.inserted = false;
        }
    }
}
