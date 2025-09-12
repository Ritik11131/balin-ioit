import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { GenericFormGeneratorComponent } from '../../../../../../shared/components/generic-form-generator/generic-form-generator.component';
import { VehicleTrackingLinkService } from '../../../../../service/vehicle-tracking-link.service';
import { UiService } from '../../../../../../layout/service/ui.service';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-vehicle-tracking-link',
    imports: [CommonModule,ButtonModule, GenericFormGeneratorComponent],
    template: `
        <div class="p-6 space-y-6">
            <!-- Vehicle Info Card -->
            <div class="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                        <svg class="w-5 h-5 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                            <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                        </svg>
                    </div>
                    <div>
                        <p class="font-semibold text-gray-800">Selected Vehicle</p>
                        <p class="text-lg font-bold text-primary">{{ vehicle?.name }}</p>
                    </div>
                </div>
            </div>

            <!-- Hours Input -->
            @if (!generatedLink) {
                <div class="space-y-2">
                    <app-generic-form-generator [config]="trackingLinkService.formFields" [initialData]="editData" (formSubmit)="onFormSubmit($event)" (formCancel)="onFormCancel()" />
                    @if (isGenerating) {
                        <div class="flex items-center justify-center py-4">
                            <div class="text-center">
                                <i class="pi pi-spin pi-spinner text-2xl text-gray-400 mb-2"></i>
                                <p class="text-sm text-gray-500">Generating...</p>
                            </div>
                        </div>
                    }
                </div>
            } @else {
                <!-- Generated Link Section -->
                <div class="space-y-3 animate-fadein">
                    <label class="block text-sm font-medium text-gray-700"> Generated Tracking Link </label>
                    <div class="relative bg-gradient-to-r from-primary-50 to-primary-50 border-2 border-dashed border-primary-300 rounded-lg p-4">
                        <div class="flex items-center space-x-3">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
                                    <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                    </svg>
                                </div>
                            </div>
                            <div class="flex-end min-w-0">
                                <p class="text-sm font-medium text-primary-800 mb-1">Link Generated Successfully!</p>
                                <div class="bg-white rounded-md px-3 py-2 border">
                                    <p class="text-sm text-gray-800 font-mono break-all">{{ generatedLink }}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Action Buttons for Generated Link -->
                    <div class="flex space-x-3">
                      <p-button label="Copy Link" (onClick)="copyLink()" icon="pi pi-copy" styleClass="flex-1" />
                      <p-button label="Share Link" (onClick)="shareLink()" icon='pi pi-share-alt' styleClass="flex-1" /> 
                    </div>
                </div>
            }

            <!-- Reset Button when link is generated -->
            <div *ngIf="generatedLink" class="pt-2">
                <button (click)="resetForm()" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors duration-200">Generate Another Link</button>
            </div>
        </div>
    `
})
export class VehicleTrackingLinkComponent {
    @Input() vehicle: any;

    private uiService = inject(UiService);
    public trackingLinkService = inject(VehicleTrackingLinkService);
    trackingHours = this.trackingLinkService.trackingHours;
    get generatedLink() {
        return this.trackingLinkService.generatedLink;
    }
    get isGenerating() {
        return this.trackingLinkService.isGenerating;
    }

    editData = { trackingDuration: '1' };

    constructor() {}

    async generateTrackingLink(): Promise<void> {
        if (!this.trackingLinkService.validateTrackingHours(this.trackingHours)) {
            // this.trackingLinkService.showNotification('Please enter a valid duration between 1-168 hours', 'error');
            return;
        }
        if (!this.vehicle?.id) {
            // this.trackingLinkService.showNotification('No vehicle selected', 'error');
            return;
        }
        await this.trackingLinkService.generateTrackingLink(this.vehicle.id, this.trackingHours);
    }

    async copyLink(): Promise<void> {
        await this.trackingLinkService.copyLink(this.generatedLink);
    }

    async shareLink(): Promise<void> {
        await this.trackingLinkService.shareLink(this.generatedLink, this.trackingHours);
    }

    async onFormSubmit(e: any): Promise<void> {
        const { formValue } = e;
        if (!this.trackingLinkService.validateTrackingHours(formValue?.trackingDuration)) {
            this.uiService.showToast('warn', 'Warning', 'Please enter a valid duration between 1-168 hours');
            return;
        }
        if (!this.vehicle?.id) {
            this.uiService.showToast('error', 'Error', 'No Vehicle Selected!');
            return;
        }
        await this.trackingLinkService.generateTrackingLink(this.vehicle.id, formValue?.trackingDuration);
    }

    onFormCancel() {
        this.resetForm();
        this.uiService.closeDialog();
    }

    resetForm(): void {
        this.trackingLinkService.reset();
        this.trackingHours = this.trackingLinkService.trackingHours;
    }

    onHoursChange(): void {
        if (this.trackingHours < 1) this.trackingHours = 1;
        else if (this.trackingHours > 168) this.trackingHours = 168;
    }
}
