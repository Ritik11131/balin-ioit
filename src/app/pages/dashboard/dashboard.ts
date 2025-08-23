import { Component } from '@angular/core';


@Component({
    selector: 'app-dashboard',
    imports: [],
    template: `
    <div class="w-full h-[calc(100vh-60px)] p-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">Welcome back 👋</h1>
                    <p class="text-gray-600 mb-6">Here's your dashboard overview.</p>
                 
                </div>
        
    `
})
export class Dashboard {}
