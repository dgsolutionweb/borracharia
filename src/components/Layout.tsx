import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Package, 
  Wrench, 
  FileText, 
  BarChart2, 
  Package2,
  LogOut 
} from 'lucide-react';

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/customers', icon: Users, label: 'Clientes' },
  { path: '/products', icon: Package, label: 'Produtos' },
  { path: '/services', icon: Wrench, label: 'Serviços' },
  { path: '/service-orders', icon: FileText, label: 'Ordens de Serviço' },
  { path: '/inventory', icon: Package2, label: 'Estoque' },
  { path: '/reports', icon: BarChart2, label: 'Relatórios' },
];

export default function Layout() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-xl font-bold text-gray-800">BF Borracharia</h1>
        </div>
        <nav className="mt-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 ${
                  location.pathname === item.path ? 'bg-gray-100' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut()}
            className="w-full flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sair
          </button>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}