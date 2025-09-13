import { FileSizePipe } from './../../pipes/file-size.pipe';
import { FileDemo } from './../../../pages/uikit/filedemo';
import { FileUploadModule } from 'primeng/fileupload';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { GenericTableComponent } from '../generic-table/generic-table.component';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DividerModule } from 'primeng/divider';
import { ToastModule } from 'primeng/toast';
import { DELAY_CODE } from '../../utils/helper_functions';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
    selector: 'app-generic-bulk-upload',
    imports: [CommonModule, GenericTableComponent, FileUploadModule, BadgeModule, ButtonModule, TagModule, DividerModule, ToastModule, ProgressSpinnerModule, FileSizePipe],
    template: `
        <div class="w-full mx-auto">
          <!-- Main Grid: Upload (left), Divider (mid), Table (right) -->
          <div class="grid grid-cols-12 gap-0">
              <!-- Left: Upload Card -->
              <div class="col-span-5 flex flex-col">
                  <!-- File Upload Zone -->
                  <div class="mb-6">
                      <p-fileUpload name="bulkFile" [multiple]="false" accept=".xlsx,.csv" [maxFileSize]="5000000" customUpload (onSelect)="onSelectedFiles($event)" class="w-full">
                          <ng-template #header let-chooseCallback="chooseCallback" let-clearCallback="clearCallback" let-files>
                              <div class="flex items-center justify-between gap-3">
                                  <p-button icon="pi pi-folder-open" label="Choose File" outlined severity="secondary" (onClick)="chooseCallback()" />
                                  @if (files?.length) {
                                      <p-button icon="pi pi-trash" [text]="true" severity="danger" (onClick)="clearCallback()" pTooltip="Clear selected file" />
                                  }
                                  <p-button label="Template" icon="pi pi-download" [outlined]="true" (onClick)="downloadSample()" />

                              </div>
                          </ng-template>
                          <ng-template #content let-files>
                              <div>
                                  <div *ngIf="files?.length" class="bg-gradient-to-r from-primary-50 to-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4 mb-2">
                                      <div class="flex items-center gap-3">
                                          <div class="w-12 h-12 rounded-full flex items-center justify-center animate-pulse">
                                              <i class="pi pi-verified text-green-600" style="font-size: 2rem"></i>
                                          </div>
                                          <div>
                                              <p class="text-sm font-semibold text-primary-800 mb-1">File Ready for Upload</p>
                                              <div class="flex items-center gap-2 bg-white px-3 py-2 rounded-lg shadow-sm border">
                                                  <i class="pi pi-file text-blue-600"></i>
                                                  <span class="text-sm font-medium text-gray-700 truncate max-w-48">{{ files[0].name }}</span>
                                                  <span class="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{{ files[0].size | fileSize }}</span>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </ng-template>
                          <ng-template #file></ng-template>
                          <ng-template #empty>
                              <!-- This will be the same as above empty state  -->
                               <div class="bg-gradient-to-r from-primary-50 to-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4">
                                      <div class="flex items-center gap-3">
                                          <div class="w-16 h-16 rounded-full flex items-center justify-center animate-pulse">
                                              <i class="pi pi-cloud-upload" style="color: var(--primary-color); font-size: 3rem"></i>
                                          </div>
                                          <div>
                                              <p class="text-sm font-semibold text-primary-800 mb-1">Drop your files here</p>
                                              <p class="text-gray-600 mb-4">Supports Excel (.xlsx) and CSV up to 5MB.</p>
                                          </div>
                                      </div>

                                      <div class="flex items-center justify-center mt-4 gap-3 text-sm text-gray-500">
                                                <span class="flex items-center"><i class="pi pi-file-excel text-green-600"></i>.xlsx</span>
                                                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span class="flex items-center"><i class="pi pi-file text-blue-600"></i>.csv</span>
                                                <span class="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span class="flex items-center"><i class="pi pi-database text-purple-600"></i>5MB max</span>
                                        </div>
                                  </div>
                          </ng-template>
                      </p-fileUpload>
                  </div>
              </div>

              <!-- Divider -->
              <div class="col-span-1 flex flex-col justify-center items-center">
                  <p-divider layout="vertical"/>
              </div>

              <!-- Right: Table Preview -->
              <div class="col-span-6">
                  <div *ngIf="reviewData.length" class="animate-fadein">
                      <div>
                          <div class="flex items-center justify-between mb-4">
                              <span class="bg-green-100 text-green-800 px-3 py-1 rounded font-semibold text-sm">{{ reviewData.length }} rows found</span>
                              <button type="button" class="text-blue-600 hover:text-blue-800 text-sm font-bold" (click)="reset()"><i class="pi pi-refresh mr-1"></i> Reset</button>
                          </div>
                          <div class="border border-gray-200 rounded-lg overflow-auto">
                              <app-generic-table [tableConfig]="config.tableConfig" [tableData]="reviewData" class="w-full" />
                          </div>
                          <div class="flex items-center justify-end gap-3 mt-6">
                              <p-button label="Cancel" icon="pi pi-times" severity="secondary" [outlined]="true" class="hover:scale-105 transition-transform" (onClick)="reset()" />
                              <p-button
                                  label="Confirm Upload"
                                  icon="pi pi-cloud-upload"
                                  (onClick)="finalizeUpload()"
                              />
                          </div>
                      </div>
                  </div>
              </div>
          </div>
        </div>
    `
})
export class GenericBulkUploadComponent {
    @Input() config!: {
        dialogHeader?: string;
        formTitle?: string;
        tableConfig: any;
        sampleUrl?: string;
        parseUploadFn: (file: File) => Promise<any[]>;
    };

    @Output() review = new EventEmitter<any[]>();
    @Output() upload = new EventEmitter<any[]>();

    reviewData: any[] = [];
    reviewCols: string[] = [];
    isUploading!: boolean;

    downloadSample() {
        if (this.config.sampleUrl) window.open(this.config.sampleUrl, '_blank');
    }

    async onSelectedFiles(event: any) {
        const file = event.files?.[0];
        if (file && this.config.parseUploadFn) {
            try {
                this.reviewData = await this.config.parseUploadFn(file);
                this.reviewCols = this.reviewData.length ? Object.keys(this.reviewData[0]) : [];
                this.review.emit(this.reviewData);
            } catch (err: any) {
                alert('Could not parse file: ' + (err?.message || err));
                this.reviewData = [];
                this.reviewCols = [];
            }
        }
    }

    async onUploadHandler(event: any) {
        // event.files is the selected file(s)
        const file = event.files?.[0];
        if (file && this.config.parseUploadFn) {
            try {
                this.reviewData = await this.config.parseUploadFn(file);
                this.reviewCols = this.reviewData.length ? Object.keys(this.reviewData[0]) : [];
                this.review.emit(this.reviewData);
            } catch (err: any) {
                alert('Could not parse file: ' + (err?.message || err));
                this.reviewData = [];
                this.reviewCols = [];
            }
        }
    }

    async finalizeUpload() {
        this.isUploading = true;
        this.upload.emit(this.reviewData);
        this.reset();
        await DELAY_CODE(4000);
        this.isUploading = false;
    }

    reset() {
        this.reviewData = [];
        this.reviewCols = [];
    }
}
