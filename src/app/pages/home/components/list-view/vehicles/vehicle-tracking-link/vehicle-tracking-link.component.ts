import { CommonModule } from '@angular/common';
import { Component, Input, inject } from '@angular/core';
import { GenericFormGeneratorComponent } from '../../../../../../shared/components/generic-form-generator/generic-form-generator.component';
import { VehicleTrackingLinkService } from '../../../../../service/vehicle-tracking-link.service';
import { UiService } from '../../../../../../layout/service/ui.service';

@Component({
  selector: 'app-vehicle-tracking-link',
  imports: [CommonModule, GenericFormGeneratorComponent],
  template:`
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
                    <div class="space-y-2">
                        <app-generic-form-generator [config]="trackingLinkService.formFields" [initialData]="editData" (formSubmit)="onFormSubmit($event)" (formCancel)="onFormCancel()" />
                    </div>
    
                    <!-- Generated Link Section -->
                    <div *ngIf="generatedLink" class="space-y-3 animate-fadein">
                        <label class="block text-sm font-medium text-gray-700"> Generated Tracking Link </label>
                        <div class="relative bg-gradient-to-r from-primary-50 to-blue-50 border-2 border-dashed border-primary-300 rounded-lg p-4">
                            <div class="flex items-center space-x-3">
                                <div class="flex-shrink-0">
                                    <div class="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center animate-pulse">
                                        <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                                        </svg>
                                    </div>
                                </div>
                                <div class="flex-1 min-w-0">
                                    <p class="text-sm font-medium text-primary-800 mb-1">Link Generated Successfully!</p>
                                    <div class="bg-white rounded-md px-3 py-2 border">
                                        <p class="text-sm text-gray-800 font-mono break-all">{{ generatedLink }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <!-- Action Buttons for Generated Link -->
                        <div class="flex space-x-3">
                            <button (click)="copyLink()" class="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                                </svg>
                                <span>Copy Link</span>
                            </button>
                            <button (click)="shareLink()" class="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2">
                                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                                </svg>
                                <span>Share</span>
                            </button>
                        </div>
                    </div>
    
                    <!-- Action Buttons -->
                    <div *ngIf="!generatedLink" class="flex space-x-3 pt-2">
                        <button class="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors duration-200">Cancel</button>
                        <button
                            (click)="generateTrackingLink()"
                            [disabled]="!trackingHours || trackingHours < 1"
                            class="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                        >
                            <svg *ngIf="isGenerating" class="animate-spin w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <svg *ngIf="!isGenerating" class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fill-rule="evenodd"
                                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                                    clip-rule="evenodd"
                                />
                            </svg>
                            <span>{{ isGenerating ? 'Generating...' : 'Generate Link' }}</span>
                        </button>
                    </div>
    
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
  get generatedLink() { return this.trackingLinkService.generatedLink; }
  get isGenerating() { return this.trackingLinkService.isGenerating; }

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

  onFormSubmit(e: any) {
    console.log(e);
    
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
