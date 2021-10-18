import { Renderer2 } from '@angular/core';

export interface ExternalLibrary {
    renderer: Renderer2;
    type: string;
    src?: string;
    id?: string;
    charset?: string;
    section?: string;
    text?: string;
    onload?: () => void;
    className?: string;
}
