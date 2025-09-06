import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { PathReplayService } from '../../../../pages/service/path-replay.service';
import { TabsModule } from 'primeng/tabs';
import { BadgeModule } from 'primeng/badge';
import { CommonModule } from '@angular/common';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';

@Component({
    selector: 'app-playback-path-info',
    imports: [
        SkeletonModule, 
        TabsModule, 
        BadgeModule, 
        CommonModule, 
        ProgressBarModule, 
        MessageModule, 
        ButtonModule,
        TooltipModule
    ],
    template: `
        <div class="path-info-container">
            <!-- Header with Loading Indicator -->
            <div class="flex items-center justify-between">
                <h2 class="text-xl font-semibold text-gray-800">Path Info</h2>

            </div>

            <!-- Error Messages -->
            <!-- @if (hasErrors) {
                <div class="mb-4 space-y-2">
                    @for (error of getCurrentErrors(); track error.type) {
                        <p-message 
                            severity="error" 
                            [text]="error.message"
                            [closable]="true">
                        </p-message>
                    }
                </div>
            } -->

            <!-- Start/End Points Section -->
            <div class="mb-6">
                <!-- Start Point -->
                <div class="flex items-center">
                    <div class="flex-shrink-0 mr-4">
                        <i class="pi pi-circle-fill" style="color: var(--primary-color);"></i>
                    </div>

                    <div class="flex-grow">
                        <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            @if (serviceState?.data?.hasVehicleInfo && pathReplayService.vehicleStartEndInfo.startInfo.address) {
                                <div class="text-sm text-gray-500">{{ pathReplayService.vehicleStartEndInfo.startInfo.address }}</div>
                                <div class="text-sm text-gray-800 font-medium mt-1">[{{ pathReplayService.vehicleStartEndInfo.startInfo.timestamp }}]</div>
                            } @else if (serviceState?.loading?.fetchingAddresses || serviceState?.loading?.processingData) {
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-spin pi-spinner text-xs"></i>
                                    <span class="text-sm text-gray-500">Loading address...</span>
                                </div>
                            } @else {
                                <div>
                                    <p-skeleton width="15rem" styleClass="mb-2" />
                                    <p-skeleton width="5rem" />
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <!-- Dotted Line -->
                <div class="flex justify-start">
                    <div class="dotted-line w-0.5 h-10 ml-2"></div>
                </div>

                <!-- End Point -->
                <div class="flex items-center">
                    <div class="flex-shrink-0 mr-4">
                        <i class="pi pi-map-marker" style="color: var(--primary-color);"></i>
                    </div>

                    <div class="flex-grow">
                        <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                            @if (serviceState?.data?.hasVehicleInfo && pathReplayService.vehicleStartEndInfo.endInfo.address) {
                                <div class="text-sm text-gray-500">{{ pathReplayService.vehicleStartEndInfo.endInfo.address }}</div>
                                <div class="text-sm text-gray-800 font-medium mt-1">[{{ pathReplayService.vehicleStartEndInfo.endInfo.timestamp }}]</div>
                            } @else if (serviceState?.loading?.fetchingAddresses || serviceState?.loading?.processingData) {
                                <div class="flex items-center gap-2">
                                    <i class="pi pi-spin pi-spinner text-xs"></i>
                                    <span class="text-sm text-gray-500">Loading address...</span>
                                </div>
                            } @else {
                                <div>
                                    <p-skeleton width="15rem" styleClass="mb-2" />
                                    <p-skeleton width="5rem" />
                                </div>
                            }
                        </div>
                    </div>
                </div>
            </div>

            <!-- Stats Cards -->
            <div class="grid grid-cols-2 gap-6 mb-2">
                <!-- Distance Card -->
                <div class="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="rounded-full icon-bg flex justify-start mb-4">
                        <i class="pi pi-map" style="color: var(--primary-color);"></i>
                    </div>

                    <div class="">
                        @if (isLoading || serviceState?.loading?.processingData || serviceState?.loading?.initializing) {
                            <!-- Loading State -->
                            <p-skeleton width="3rem" height="1rem" />
                        } @else if (serviceState?.data?.hasVehicleInfo && pathReplayService.vehicleStartEndInfo.totalDistance) {
                            <!-- Data Available -->
                            <div class="text-2xl font-bold text-gray-900">
                                {{ pathReplayService.vehicleStartEndInfo.totalDistance }}
                                <span class="text-sm font-medium text-gray-600">km</span>
                            </div>
                            <div class="text-gray-600 font-medium text-sm">Distance</div>
                        } @else {
                            <!-- Empty State -->
                            <div class="flex flex-row items-center justify-center text-center">
                                 <i class="pi pi-info-circle text-2xl text-gray-400 mr-2"></i>
                                <div class="text-sm text-gray-500">No distance data</div>
                            </div>
                        }
                    </div>
                </div>

                <!-- Max Speed Card -->
                <div class="rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div class="rounded-full icon-bg flex justify-start mb-4">
                        <i class="pi pi-gauge" style="color: var(--primary-color);"></i>
                    </div>

                    <div class="">
                        @if (isLoading || serviceState?.loading?.processingData || serviceState?.loading?.initializing) {
                            <!-- Loading State -->
                            <p-skeleton width="3rem" height="1rem" />
                        } @else if (serviceState?.data?.hasVehicleInfo && pathReplayService.vehicleStartEndInfo.maxSpeed !== undefined) {
                            <!-- Data Available -->
                            <div class="text-2xl font-bold text-gray-900">
                                {{ pathReplayService.vehicleStartEndInfo.maxSpeed }}
                                <span class="text-sm font-medium text-gray-600">kmph</span>
                            </div>
                            <div class="text-gray-600 font-medium text-sm">Max Speed</div>
                        } @else {
                            <!-- Empty State -->
                            <div class="flex flex-row items-center justify-center text-center">
                                 <i class="pi pi-info-circle text-2xl text-gray-400 mr-2"></i>
                                <div class="text-sm text-gray-500">No speed data</div>
                            </div>
                        }
                    </div>
                </div>
            </div>

            <!-- Tabs Section -->
            <div>
                <p-tabs value="0" scrollable>
                    <p-tablist>
                        <p-tab value="0" class="flex items-center !gap-2">
                            <span class="font-bold whitespace-nowrap">Stops</span>
                            
                            @if (serviceState?.loading?.fetchingStops) {
                                <i class="pi pi-spin pi-spinner text-xs"></i>
                            } @else if (serviceState?.data?.hasStopsData) {
                                <p-badge [value]="pathReplayService.vehicleStartEndInfo?.stopsData?.total" />
                            } @else {
                                <p-badge value="0" />
                            }
                        </p-tab>
                        
                        <!-- Future: History Tab -->
                        <!-- <p-tab value="1" class="flex items-center !gap-2" [disabled]="!serviceState?.data?.hasHistoryData">
                            <span class="font-bold whitespace-nowrap">History</span>
                            @if (serviceState?.data?.hasHistoryData) {
                                <p-badge [value]="pathReplayService.vehicleStartEndInfo?.historyData?.total" />
                            } @else {
                                <p-badge value="0" />
                            }
                        </p-tab> -->
                    </p-tablist>
                    
                    <p-tabpanels>
                        <!-- Stops Tab Panel -->
                        <p-tabpanel value="0">
                            <div class="max-h-[160px] overflow-y-auto space-y-3 mt-4 px-2">
                                @if (serviceState?.loading?.fetchingStops || serviceState?.loading?.plottingStops) {
                                    <!-- Loading State for Stops -->
                                    <div class="flex items-center justify-center py-4">
                                        <div class="text-center">
                                            <i class="pi pi-spin pi-spinner text-2xl text-gray-400 mb-2"></i>
                                            <p class="text-sm text-gray-500">
                                                {{ serviceState?.loading?.fetchingStops ? 'Fetching stops...' : 'Plotting stops...' }}
                                            </p>
                                        </div>
                                    </div>
                                } @else if (serviceState?.data?.hasStopsData && pathReplayService.vehicleStartEndInfo?.stopsData?.data?.length > 0) {
                                    <!-- Stops List -->
                                    @for (stop of pathReplayService.vehicleStartEndInfo?.stopsData?.data; track stop) {
                                        <div class="flex items-center">
                                            <div class="stop-marker-container mr-4">
                                                <div class="relative flex items-center justify-center">
                                                    <div class="absolute w-8 h-8 rounded-full border-2 border-white shadow-lg opacity-30" 
                                                         [ngStyle]="{ 'background-color': 'var(--primary-color)' }">
                                                    </div>
                                                    <div class="relative w-5 h-5 rounded-full shadow-lg z-10" 
                                                         [ngStyle]="{ 'background-color': 'var(--primary-color)' }">
                                                        <div class="absolute inset-0 rounded-full opacity-25" 
                                                             [ngStyle]="{ 'background-color': 'var(--primary-color)' }">
                                                        </div>
                                                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-sm z-20">
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div class="flex-grow">
                                                <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                    <div class="text-md text-gray-500">
                                                        <span>{{ stop.label }}</span>
                                                        <span class="ml-2">[{{ stop.duration || '-' }}]</span>
                                                    </div>
                                                    <div class="truncate max-w-[200px] text-sm text-gray-800 font-medium mt-1">
                                                        {{ stop.address || 'Address not available' }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    }
                                } @else if (serviceState?.errors?.stopsError) {
                                    <!-- Error State -->
                                    <div class="text-center py-4">
                                        <i class="pi pi-exclamation-triangle text-2xl text-red-400 mb-2"></i>
                                        <p class="text-sm text-red-600">{{ serviceState.errors.stopsError }}</p>
                                        <p-button 
                                            label="Retry" 
                                            size="small" 
                                            outlined 
                                            class="mt-2"
                                            (click)="retryStopsData()">
                                        </p-button>
                                    </div>
                                } @else {
                                    <!-- No Data State -->
                                    <div class="text-center py-4">
                                        <i class="pi pi-info-circle text-2xl text-gray-400 mb-2"></i>
                                        <p class="text-sm text-gray-500">No stops found for this route</p>
                                    </div>
                                }
                            </div>
                        </p-tabpanel>
                        
                        <!-- History Tab Panel -->
                        <!-- <p-tabpanel value="1">
                            <div class="max-h-[160px] overflow-y-auto mt-4 px-2">
                                @if (serviceState?.loading?.fetchingHistory) {
                                    <div class="flex items-center justify-center py-4">
                                        <div class="text-center">
                                            <i class="pi pi-spin pi-spinner text-2xl text-gray-400 mb-2"></i>
                                            <p class="text-sm text-gray-500">Loading history data...</p>
                                        </div>
                                    </div>
                                } @else if (serviceState?.data?.hasHistoryData) {
                                    <div class="space-y-2">
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-600">Total Points:</span>
                                            <span class="font-medium">{{ pathReplayService.vehicleStartEndInfo?.historyData?.total }}</span>
                                        </div>
                                        <div class="flex justify-between text-sm">
                                            <span class="text-gray-600">Track Player:</span>
                                            <span class="font-medium" 
                                                  [class]="serviceState?.data?.hasTrackPlayer ? 'text-green-600' : 'text-gray-400'">
                                                {{ serviceState?.data?.hasTrackPlayer ? 'Ready' : 'Not Ready' }}
                                            </span>
                                        </div>
                                    </div>
                                } @else {
                                    <div class="text-center py-4">
                                        <i class="pi pi-info-circle text-2xl text-gray-400 mb-2"></i>
                                        <p class="text-sm text-gray-500">No history data available</p>
                                    </div>
                                }
                            </div>
                        </p-tabpanel> -->
                    </p-tabpanels>
                </p-tabs>
            </div>

            <!-- Debug Info (Only in Development) -->
            <!-- @if (showDebugInfo) {
                <div class="mt-4 p-3 bg-gray-100 rounded text-xs">
                    <details>
                        <summary class="cursor-pointer font-medium">Debug Info</summary>
                        <pre class="mt-2 text-xs">{{ getDebugInfo() | json }}</pre>
                    </details>
                </div>
            } -->
        </div>
    `,
    styles: [
        `
            .path-info-container {
                min-height: 400px;
            }

            .dotted-line {
                background-image: linear-gradient(to bottom, var(--primary-color) 40%, transparent 40%);
                background-size: 2px 8px;
                background-repeat: repeat-y;
            }

            :host ::ng-deep .p-tablist-tab-list,
            :host ::ng-deep .p-tabpanels {
                background: none;
            }

            :host ::ng-deep .p-tabpanels {
                padding: 0;
            }

            :host ::ng-deep .progress-bar-custom .p-progressbar-value {
                background: linear-gradient(90deg, var(--primary-color), var(--primary-color-text));
            }

            :host ::ng-deep .p-message {
                margin: 0;
            }

            .stop-marker-container {
                flex-shrink: 0;
            }

            /* Loading animations */
            .loading-pulse {
                animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 1; }
                50% { opacity: 0.5; }
            }
        `
    ]
})
export class PlaybackPathInfoComponent implements OnInit, OnDestroy {
    public pathReplayService = inject(PathReplayService);
    
    private destroy$ = new Subject<void>();
    
    // Component state properties
    serviceState: any = null;
    isLoading = false;
    hasErrors = false;
    isReady = false;
    loadingProgress = 0;
    
    // Debug mode (should be false in production)
    showDebugInfo = false; // Set to true for development

    ngOnInit() {
        // Subscribe to service state changes
        combineLatest([
            this.pathReplayService.serviceState$,
            this.pathReplayService.isLoading$,
            this.pathReplayService.hasAnyError$,
            this.pathReplayService.isReady$,
        ]).pipe(
            takeUntil(this.destroy$)
        ).subscribe(([serviceState, isLoading, hasErrors, isReady]) => {
            this.serviceState = serviceState;
            this.isLoading = isLoading;
            this.hasErrors = hasErrors;
            this.isReady = isReady;
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    // getLoadingMessage(): string {
    //     if (!this.serviceState?.loading) return 'Loading...';
        
    //     const loading = this.serviceState.loading;
        
    //     if (loading.initializing) return 'Initializing...';
    //     if (loading.fetchingHistory) return 'Fetching history...';
    //     if (loading.fetchingStops) return 'Fetching stops...';
    //     if (loading.processingData) return 'Processing data...';
    //     if (loading.fetchingAddresses) return 'Loading addresses...';
    //     if (loading.plottingStops) return 'Plotting stops...';
    //     if (loading.initializingPlayer) return 'Initializing player...';
        
    //     return 'Loading...';
    // }

    // getCurrentErrors(): Array<{type: string, message: string}> {
    //     if (!this.serviceState?.errors) return [];
        
    //     const errors: Array<{type: string, message: string}> = [];
    //     const errorState = this.serviceState.errors;
        
    //     if (errorState.historyError) {
    //         errors.push({ type: 'history', message: `History: ${errorState.historyError}` });
    //     }
    //     if (errorState.stopsError) {
    //         errors.push({ type: 'stops', message: `Stops: ${errorState.stopsError}` });
    //     }
    //     if (errorState.addressError) {
    //         errors.push({ type: 'address', message: `Address: ${errorState.addressError}` });
    //     }
    //     if (errorState.playerError) {
    //         errors.push({ type: 'player', message: `Player: ${errorState.playerError}` });
    //     }
    //     if (errorState.generalError) {
    //         errors.push({ type: 'general', message: errorState.generalError });
    //     }
        
    //     return errors;
    // }

    retryStopsData() {
        // This would need to be implemented in the service
        console.log('Retry stops data requested');
        // You could emit an event or call a service method to retry
    }

    // getDebugInfo() {
    //     return {
    //         serviceState: this.serviceState,
    //         isLoading: this.isLoading,
    //         hasErrors: this.hasErrors,
    //         isReady: this.isReady,
    //         loadingProgress: this.loadingProgress,
    //         vehicleInfo: this.pathReplayService.vehicleStartEndInfo,
    //         hasTrackPlayer: !!this.pathReplayService.trackPlayer
    //     };
    // }
}