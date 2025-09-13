import { TemplateRef } from "@angular/core";

export interface DialogConfig {
    content?: TemplateRef<any>;
    header?: string;
    subheader?:string;
    headerIcon?: string;
    styleClass?: string;
    modal?: boolean;
    closable?: boolean;
    dismissableMask?: boolean;
    resizable?: boolean;
    draggable?: boolean;
    blockScroll?: boolean;
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    minY?: number;
    maximizable?: boolean;
    baseZIndex?: number;
}
