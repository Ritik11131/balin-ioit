import { Component } from '@angular/core';
import { NotificationsWidget } from './components/notificationswidget';
import { StatsWidget } from './components/statswidget';
import { RecentSalesWidget } from './components/recentsaleswidget';
import { BestSellingWidget } from './components/bestsellingwidget';
import { RevenueStreamWidget } from './components/revenuestreamwidget';

@Component({
    selector: 'app-dashboard',
    imports: [StatsWidget, RecentSalesWidget, BestSellingWidget, RevenueStreamWidget, NotificationsWidget],
    template: `
    <div class="w-full h-[calc(100vh-60px)] p-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">Welcome back 👋</h1>
                    <p class="text-gray-600 mb-6">Here's your dashboard overview.</p>
                 
                </div>
        
    `
})
export class Dashboard {}
