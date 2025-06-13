'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  LibraryBig,
  BadgeCheck,
  Users,
  Upload,
  BookOpen,
  FileText,
  Settings,
  ChevronRight,
  X,
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Inicio', icon: <Home size={18} /> },
    { href: '/dashboard/ocde', label: 'Manejo de OCDE', icon: <LibraryBig size={18} /> },
    { href: '/dashboard/orcid', label: 'Manejo de ORCID', icon: <BadgeCheck size={18} /> },
    { href: '/dashboard/usuarios', label: 'Usuarios', icon: <Users size={18} /> },
    { href: '/dashboard/facultades', label: 'Facultades', icon: <BookOpen size={18} /> },
    { href: '/dashboard/excel', label: 'Carga de Excel', icon: <Upload size={18} /> },
    { href: '/dashboard/pdf', label: 'Carga de PDF', icon: <Upload size={18} /> },
    { href: '/dashboard/investigaciones', label: 'Investigaciones', icon: <BookOpen size={18} /> },
    { href: '/dashboard/autoridades', label: 'Autoridades', icon: <Settings size={18} /> },
    { href: '/dashboard/reportes', label: 'Reportes', icon: <FileText size={18} /> },
    { href: '/dashboard/ajustes', label: 'Ajustes', icon: <Settings size={18} /> },
  ];

  return (
    <aside
      className={`bg-gray-800 text-white w-64 space-y-6 px-6 py-8 absolute md:relative inset-y-0 left-0 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 transition duration-200 ease-in-out z-50`}
    >
      {/* Botón cerrar solo en móvil */}
      <button
        className="md:hidden mb-6 text-right w-full text-sm text-gray-300"
        onClick={onClose}
      >
        <X className="inline-block mr-1" size={18} /> Cerrar
      </button>

      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

      <nav className="space-y-2 text-sm">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition ${
              pathname === href ? 'bg-gray-700 font-semibold' : ''
            }`}
          >
            {icon} {label}
            {pathname === href && <ChevronRight size={16} className="ml-auto opacity-70" />}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
