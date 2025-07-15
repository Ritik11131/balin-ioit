import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  imports: [],
  template: `
<div class="w-full h-full">
    <!-- Two Column Layout -->
    <div class="flex flex-col lg:flex-row gap-6 h-full">
        
        <!-- Left Side - Fixed Width 340px on large screens -->
        <div class="w-full lg:w-[340px] lg:flex-shrink-0">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Left Panel</h2>
                <div class="space-y-4">
                    <div class="p-4 bg-gray-50 rounded-lg">
                        <h3 class="font-medium text-gray-800">Quick Actions</h3>
                        <p class="text-sm text-gray-600 mt-2">Content for left panel</p>
                    </div>
                    <div class="p-4 bg-blue-50 rounded-lg">
                        <h3 class="font-medium text-blue-800">Statistics</h3>
                        <p class="text-sm text-blue-600 mt-2">More content here</p>
                    </div>
                    <div class="p-4 bg-green-50 rounded-lg">
                        <h3 class="font-medium text-green-800">Recent Activity</h3>
                        <p class="text-sm text-green-600 mt-2">Activity content</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right Side - Takes remaining space -->
        <div class="flex-1 min-w-0">
            <div class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-full">
                <h2 class="text-xl font-semibold text-gray-900 mb-4">Main Content</h2>
                <div class="space-y-6">
                    <!-- Content Grid -->
                    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <div class="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg">
                            <h3 class="text-lg font-medium mb-2">Card 1</h3>
                            <p class="text-blue-100">Some content here</p>
                        </div>
                        <div class="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg">
                            <h3 class="text-lg font-medium mb-2">Card 2</h3>
                            <p class="text-green-100">Some content here</p>
                        </div>
                        <div class="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg">
                            <h3 class="text-lg font-medium mb-2">Card 3</h3>
                            <p class="text-purple-100">Some content here</p>
                        </div>
                    </div>

                    <!-- Additional Content Section -->
                    <div class="bg-gray-50 rounded-lg p-6">
                        <h3 class="text-lg font-medium text-gray-900 mb-4">Main Dashboard</h3>
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div class="bg-white p-4 rounded-lg border">
                                <div class="text-2xl font-bold text-gray-900">1,234</div>
                                <div class="text-sm text-gray-600">Total Users</div>
                            </div>
                            <div class="bg-white p-4 rounded-lg border">
                                <div class="text-2xl font-bold text-gray-900">567</div>
                                <div class="text-sm text-gray-600">Active Sessions</div>
                            </div>
                            <div class="bg-white p-4 rounded-lg border">
                                <div class="text-2xl font-bold text-gray-900">89%</div>
                                <div class="text-sm text-gray-600">Performance</div>
                            </div>
                            <div class="bg-white p-4 rounded-lg border">
                                <div class="text-2xl font-bold text-gray-900">$12,345</div>
                                <div class="text-sm text-gray-600">Revenue</div>
                            </div>
                        </div>
                    </div>

                    <!-- Chart/Table Section -->
                    <div class="bg-white rounded-lg border">
                        <div class="p-6 border-b">
                            <h3 class="text-lg font-medium text-gray-900">Analytics Overview</h3>
                        </div>
                        <div class="p-6">
                            <div class="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                                <p class="text-gray-500">Chart/Table content would go here</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    `,
})
export class HomeComponent {

}
