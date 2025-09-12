import { Injectable, signal, TemplateRef } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogConfig } from '../../shared/interfaces/generic-components';

export type ToastSeverity = 'success' | 'info' | 'warn' | 'error';

@Injectable({
  providedIn: 'root'
})
export class UiService {
  // Default values as constants
  private readonly DEFAULT_DRAWER_HEADER = ' ';
  private readonly DEFAULT_DRAWER_STYLE_CLASS = '!w-full md:!w-96 lg:!w-[30rem]';

  // Private signals
  private isDrawerModalSignal = signal(false);
  private isDrawerOpenSignal = signal(false);
  private drawerContentSignal = signal<TemplateRef<any> | null>(null);
  private drawerHeaderSignal = signal<string>(this.DEFAULT_DRAWER_HEADER);
  private drawerStyleClassSignal = signal(this.DEFAULT_DRAWER_STYLE_CLASS);
  private isLoadingSignal = signal(false);

  // Public readonly signals
  isDrawerModal = this.isDrawerModalSignal.asReadonly()
  isDrawerOpen = this.isDrawerOpenSignal.asReadonly();
  drawerContent = this.drawerContentSignal.asReadonly();
  drawerStyleClass = this.drawerStyleClassSignal.asReadonly();
  drawerHeader = this.drawerHeaderSignal.asReadonly();
  isLoading = this.isLoadingSignal.asReadonly();

  //Dialog signals
  private dialogConfigSignal = signal<DialogConfig | null>(null);
  dialogConfig = this.dialogConfigSignal.asReadonly();


  // Public access to default values (readonly)
  get defaultDrawerHeader(): string {
    return this.DEFAULT_DRAWER_HEADER;
  }

  get defaultDrawerStyleClass(): string {
    return this.DEFAULT_DRAWER_STYLE_CLASS;
  }

  constructor(private messageService: MessageService) { }

  toggleLoader(state: boolean): void {
    this.isLoadingSignal.set(state);
  }

  showToast(severity: ToastSeverity, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  openDrawer(content: TemplateRef<any>, header = this.DEFAULT_DRAWER_HEADER, styleClass?: string, modal: boolean = false): void {
    this.drawerContentSignal.set(content);
    this.drawerHeaderSignal.set(header);
    this.isDrawerOpenSignal.set(true);
    this.isDrawerModalSignal.set(modal);
    if (styleClass) {
      this.drawerStyleClassSignal.set(styleClass);
    } else {
      // Ensure default style is applied if none provided
      this.drawerStyleClassSignal.set(this.DEFAULT_DRAWER_STYLE_CLASS);
    }
  }

  closeDrawer(): void {
    this.isDrawerOpenSignal.set(false);
    this.drawerContentSignal.set(null);
    this.drawerHeaderSignal.set(this.DEFAULT_DRAWER_HEADER);
    this.drawerStyleClassSignal.set(this.DEFAULT_DRAWER_STYLE_CLASS);
  }

  openDialog(config: DialogConfig) {
    this.dialogConfigSignal.set(config);
  }

  closeDialog() {
    this.dialogConfigSignal.set(null);
  }

  // Useful for testing and resetting the service state
  resetAllState(): void {
    this.closeDrawer();
    this.closeDialog();
    this.isLoadingSignal.set(false);
  }
}