import React, { useState, useEffect } from 'react';
import { 
    UserIcon, ClientsIcon, TransportIcon, InventoryIcon, 
    SupplyIcon, SalesIcon, LogoutIcon, SparklesIcon 
} from './icons/IconsAbastecimiento';
// Asegúrate de tener o crear estos iconos simples para las flechas
import { ChevronDownIcon, ChevronUpIcon } from './icons/iconsVentas'; 
import { Screen } from '../types';

interface SidebarProps {
    onNavigate?: (screen: Screen | string) => void;
    currentScreen?: Screen | string;
}

interface NavItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    hasSubmenu?: boolean;
    isOpen?: boolean;
    onToggle?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ 
    icon, label, active = false, onClick, hasSubmenu, isOpen, onToggle 
}) => {
    const baseClasses = "flex items-center w-full p-3 my-1 rounded-lg text-white text-left text-sm transition-all duration-200";
    
    // Estilo para ítem activo (Verde más claro y borde izquierdo grueso)
    const activeClasses = "bg-green-600 font-bold shadow-md border-l-4 border-green-300"; 
    
    // Estilo para ítem inactivo (hover suave)
    const inactiveClasses = "hover:bg-green-700 opacity-90 hover:opacity-100 border-l-4 border-transparent";

    return (
        <button 
            className={`${baseClasses} ${active ? activeClasses : inactiveClasses}`} 
            onClick={hasSubmenu ? onToggle : onClick}
        >
            <div className="mr-3">{icon}</div>
            <span className="flex-1">{label}</span>
            
            {/* Icono de flecha si tiene submenú */}
            {hasSubmenu && (
                <div className="ml-2">
                    {isOpen ? (
                        <ChevronUpIcon className="w-4 h-4 text-green-200" />
                    ) : (
                        <ChevronDownIcon className="w-4 h-4 text-green-200" />
                    )}
                </div>
            )}
        </button>
    );
};

// Componente para los items del Submenú (La línea se define en el contenedor padre)
const SubNavItem: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <button
        onClick={onClick}
        className={`block w-full text-left py-2 pl-4 text-sm transition-colors duration-200 
        ${active ? 'text-white font-bold' : 'text-green-200 hover:text-white'}`}
    >
        {label}
    </button>
);

const Sidebar: React.FC<SidebarProps> = ({ onNavigate, currentScreen }) => {
    // Estado para controlar si el menú de ventas está abierto
    const [isVentasOpen, setIsVentasOpen] = useState(false);

    // Efecto: Si estamos en una pantalla de ventas, abrir el menú automáticamente
    useEffect(() => {
        const ventasScreens = [
            Screen.SalesTable, 
            Screen.PaymentsView, 
            Screen.ClaimsView, 
            Screen.VentasReportsView,
            Screen.RegisterSale
        ];
        if (ventasScreens.includes(currentScreen as Screen)) {
            setIsVentasOpen(true);
        }
    }, [currentScreen]);

    // Determinar si la sección padre "Ventas" debe verse activa
    const isVentasActive = [
        Screen.MainContent,
        Screen.SalesTable, 
        Screen.PaymentsView, 
        Screen.ClaimsView, 
        Screen.VentasReportsView,
        Screen.RegisterSale
    ].includes(currentScreen as Screen);

    return (
        <div className="w-64 bg-green-800 text-white flex flex-col p-4 shadow-lg h-screen sticky top-0 overflow-hidden">
            
            {/* Header de Usuario */}
            <div className="flex items-center mb-6 pb-4 border-b border-green-700 shrink-0">
                <div className="bg-green-600 rounded-full p-1 mr-3 shadow-sm">
                    <UserIcon className="h-10 w-10 text-green-100" />
                </div>
                <div>
                    <p className="font-bold text-sm">Pablo, Torres</p>
                    <p className="text-xs text-green-300">Operador de CRM</p>
                </div>
            </div>

            {/* Navegación Principal (Con scroll si la pantalla es pequeña) */}
            <nav className="flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-green-600 scrollbar-track-transparent">
                
                {/* --- MÓDULO CLIENTES --- */}
                <NavItem 
                    icon={<ClientsIcon />} 
                    label="Clientes" 
                    active={currentScreen === Screen.Clients}
                    onClick={() => onNavigate && onNavigate(Screen.Clients)} 
                />

                {/* --- MÓDULO ABASTECIMIENTO --- */}
                <NavItem 
                    icon={<SupplyIcon />} 
                    label="Abastecimiento" 
                    active={currentScreen === Screen.MainMenu} 
                    onClick={() => onNavigate && onNavigate(Screen.MainMenu)}
                />

                {/* --- OTROS MÓDULOS --- */}
                <NavItem 
                    icon={<InventoryIcon />} 
                    label="Inventario" 
                    active={currentScreen === 'inventario'}
                    onClick={() => onNavigate && onNavigate('inventario')}
                />

                 <NavItem 
                    icon={<TransportIcon />} 
                    label="Transporte" 
                    active={currentScreen === 'transporte'}
                    onClick={() => onNavigate && onNavigate('transporte')}
                />

                {/* --- MÓDULO VENTAS (DESPLEGABLE) --- */}
                <div className="mb-2">
                    <NavItem 
                        icon={<SalesIcon />} 
                        label="Ventas" 
                        active={isVentasActive} 
                        hasSubmenu={true}
                        isOpen={isVentasOpen}
                        // AQUÍ ESTÁ LA LÓGICA DOBLE:
                        onToggle={() => {
                            setIsVentasOpen(!isVentasOpen); // 1. Abre/Cierra menú
                            if (onNavigate) {
                                onNavigate(Screen.MainContent); // 2. Navega a la pantalla principal
                            }
                        }}
                    />

                    {isVentasOpen && (
                <div className="ml-5 mt-1 space-y-1">
                    {/* ml-5 alinea los ítems con el texto del padre */}
                    
                    <SubNavItem 
                        label="Registro de Ventas" 
                        active={currentScreen === Screen.SalesTable || currentScreen === Screen.RegisterSale}
                        onClick={(e) => {
                            e.stopPropagation(); // <--- ESTO EVITA QUE SE ACTIVEN OTROS CLICK
                            if(onNavigate) onNavigate(Screen.SalesTable);
                        }} 
                    />
                    <SubNavItem 
                        label="Pagos" 
                        active={currentScreen === Screen.PaymentsView}
                        onClick={(e) => {
                            e.stopPropagation();
                            if(onNavigate) onNavigate(Screen.PaymentsView);
                        }} 
                    />
                    <SubNavItem 
                        label="Reclamos" 
                        active={currentScreen === Screen.ClaimsView}
                        onClick={(e) => {
                            e.stopPropagation();
                            if(onNavigate) onNavigate(Screen.ClaimsView);
                        }} 
                    />
                    <SubNavItem 
                        label="Reportes" 
                        active={currentScreen === Screen.VentasReportsView}
                        onClick={(e) => {
                            e.stopPropagation();
                            if(onNavigate) onNavigate(Screen.VentasReportsView);
                        }} 
                    />
                </div>
            )}
                </div>

                {/* Sección Especial IA */}
                <div className="my-2 border-t border-green-700 pt-4 mt-4">
                    <p className="text-[10px] text-green-400 uppercase font-bold mb-2 px-2 tracking-wider">Herramientas</p>
                    <NavItem 
                        icon={<SparklesIcon className="text-yellow-300"/>} 
                        label="Inteligencia Artificial" 
                        active={currentScreen === Screen.AIHub}
                        onClick={() => onNavigate && onNavigate(Screen.AIHub)}
                    />
                </div>
            </nav>

            {/* Footer */}
            <div className="mt-auto pt-4 border-t border-green-700 shrink-0">
                <button className="flex items-center w-full p-3 rounded-lg text-white bg-red-600 hover:bg-red-700 transition-colors duration-200 shadow-sm">
                    <div className="mr-3"><LogoutIcon /></div>
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;