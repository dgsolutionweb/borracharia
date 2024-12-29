import React from 'react';
import { useQuery } from '../hooks/useQuery';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { RevenueChart } from '../components/dashboard/RevenueChart';
import { TopServices } from '../components/dashboard/TopServices';
import { TopProducts } from '../components/dashboard/TopProducts';
import { RecentOrders } from '../components/dashboard/RecentOrders';

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      
      <DashboardStats />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart />
        <TopServices />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts />
        <RecentOrders />
      </div>
    </div>
  );
}