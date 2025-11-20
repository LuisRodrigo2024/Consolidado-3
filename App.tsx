import React, { useState, useMemo } from 'react';
import Layout from './components/Layout';

// ==========================================
// 1. IMPORTS DE ABASTECIMIENTO (Originales)
// ==========================================
import MainMenu from './screens/MainMenu';
import ProvidersList from './screens/ProvidersList';
import ProviderFormStep1 from './screens/ProviderFormStep1';
import ProviderFormStep2 from './screens/ProviderFormStep2';
import ProviderDetails from './screens/ProviderDetails';
import ProductsList from './screens/ProductsList';
import ProductForm from './screens/ProductForm';
import ProductDetails from './screens/ProductDetails';
import PedidosList from './screens/PedidosList';
import PedidoDetails from './screens/PedidoDetails';
import SolicitudesList from './screens/SolicitudesList';
import GroupItemsForQuotation from './screens/GroupItemsForQuotation';
import ConfirmationModal from './components/ConfirmationModal';
import SolicitudDetails from './screens/SolicitudDetails';
import RegisterQuote from './screens/RegisterQuote';
import PostQuoteModal from './components/PostQuoteModal';
import EvaluateQuotes from './screens/EvaluateQuotes';
import OrdersList from './screens/OrdersList';
import OrderDetailMonitoring from './screens/OrderDetailMonitoring';
import ScheduleReceptionsList from './screens/ScheduleReceptionsList';
import ScheduleReceptionForm from './screens/ScheduleReceptionForm';
import RemissionGuideList from './screens/RemissionGuideList';
import RemissionGuideValidation from './screens/RemissionGuideValidation';
import IncidentsList from './screens/IncidentsList';
import AIHub from './screens/AIHub';
import { AIChatScreen, AIVisionScreen, AIEmailGeneratorScreen, AIProductCatalogerScreen, AIStrategyScreen } from './screens/AIApps';

// ==========================================
// 2. IMPORTS DE CLIENTES / CRM (Nuevos)
// ==========================================
import { ClientTable } from './screens/ClientTable';
import { ClientDetailView } from './screens/ClientDetailView';
import { MaestrosTable } from './screens/MaestrosTable';
import { MaestroDetailView } from './screens/MaestroDetailView';
import { RegisterClientForm } from './screens/RegisterClientForm';
import { RegisterMaestroForm } from './screens/RegisterMaestroForm';
import { RegistrationSuccess } from './screens/RegistrationSuccess';
import { SelectClientForMaestro } from './screens/SelectClientForMaestro';
import { UpdateForm } from './screens/UpdateForm';
import { ContactsModal } from './screens/ContactsModal';
import { DireccionesModal } from './screens/DireccionesModal';
import { CanjeoView } from './screens/CanjeoView';
import { ReportsView } from './screens/ReportsView';
import { ReportDetailView } from './screens/ReportDetailView';
// Iconos para el módulo de clientes
import { SearchIcon, AddIcon, ReportsIcon, UserIcon, WrenchIcon } from './components/icons/iconsClientes'; 

// ==========================================
// 3. IMPORTS DE VENTAS (Nuevos)
// ==========================================
import VentasMainContent from './screens/MainContent';
import VentasPaymentsView from './screens/PaymentsView';
import VentasClaimsView from './screens/ClaimsView';
import VentasReportsView from './screens/VentasReportsView';
import RegisterPaymentModal from './screens/RegisterPaymentModal';
import ClaimModal from './screens/ClaimModal';
import AnnulmentModal from './screens/AnnulmentModal';
// Utils de Ventas
import { derivePaidPayments, derivePendingPayments, deriveSalesSummary } from './utils';

// ==========================================
// 4. TIPOS Y DATOS
// ==========================================
import { 
  // Globales & Abastecimiento
  Screen, Provider, OfferedProduct, ProductoCatalogo, Pedido, SolicitudCotizacion, ItemPendiente, ConfirmationModalData, CotizacionRecibida, PostQuoteModalData, AdjudicatedItem, OrdenCompra, Recepcion, PedidoTransporte, DetalleRecepcionItem, GuiaRemision, Incidencia, Reclamo, 
  // Clientes
  Client, Maestro, Report, 
  // Ventas
  SaleDetail, ModalType, Installment, PendingPayment, SaleStatus, PaymentRecord, ProductStatus, ProductCatalogItem, Annulment, Return, Exchange, OrdenCompraItem, CotizacionRecibidaItem
} from './types';

import { 
  PROVIDERS_DATA, PRODUCTS_DATA, PEDIDOS_DATA, SOLICITUDES_COTIZACION_DATA, ORDENES_COMPRA_DATA, INCIDENCIAS_DATA,
  initialSaleDetailsData, initialReturnsData, initialExchangesData, initialAnnulmentsData 
} from './constants';


const App: React.FC = () => {
  // ==========================================
  // ESTADOS GLOBALES Y NAVEGACIÓN
  // ==========================================
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.MainMenu);
  const [confirmationModal, setConfirmationModal] = useState<ConfirmationModalData>({ isOpen: false, title: '', message: '' });
  const [postQuoteModal, setPostQuoteModal] = useState<PostQuoteModalData>({ isOpen: false, title: '', message: '', onAddAnother: () => {}, onFinish: () => {} });

  // ==========================================
  // ESTADOS ABASTECIMIENTO
  // ==========================================
  const [providers, setProviders] = useState<Provider[]>(PROVIDERS_DATA);
  const [draftProvider, setDraftProvider] = useState<Partial<Provider>>({});
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [providerToEdit, setProviderToEdit] = useState<Provider | null>(null);
  
  const [products, setProducts] = useState<ProductoCatalogo[]>(PRODUCTS_DATA);
  const [selectedProduct, setSelectedProduct] = useState<ProductoCatalogo | null>(null);
  const [productToEdit, setProductToEdit] = useState<ProductoCatalogo | null>(null);
  const [draftProduct, setDraftProduct] = useState<Partial<ProductoCatalogo>>({});

  const [pedidos, setPedidos] = useState<Pedido[]>(PEDIDOS_DATA);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);

  const [solicitudes, setSolicitudes] = useState<SolicitudCotizacion[]>(SOLICITUDES_COTIZACION_DATA);
  const [selectedSolicitud, setSelectedSolicitud] = useState<SolicitudCotizacion | null>(null);

  const [ordenesCompra, setOrdenesCompra] = useState<OrdenCompra[]>(ORDENES_COMPRA_DATA);
  const [selectedOrdenCompra, setSelectedOrdenCompra] = useState<OrdenCompra | null>(null);
  const [selectedRecepcionForValidation, setSelectedRecepcionForValidation] = useState<{ recepcion: Recepcion, order: OrdenCompra, serial?: number } | null>(null);
  
  const [pedidosTransporte, setPedidosTransporte] = useState<PedidoTransporte[]>([]);
  const [incidencias, setIncidencias] = useState<Incidencia[]>(INCIDENCIAS_DATA);
  const [reclamos, setReclamos] = useState<Reclamo[]>([]);

  // ==========================================
  // ESTADOS CLIENTES (CRM)
  // ==========================================
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedMaestro, setSelectedMaestro] = useState<Maestro | null>(null);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [isContactsModalOpen, setIsContactsModalOpen] = useState(false);
  const [isDireccionesModalOpen, setIsDireccionesModalOpen] = useState(false);
  const [successType, setSuccessType] = useState<'cliente' | 'maestro'>('cliente');

  // ==========================================
  // ESTADOS VENTAS (NUEVO)
  // ==========================================
  const [saleDetails, setSaleDetails] = useState<SaleDetail[]>(initialSaleDetailsData);
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [isCashRegisterOpen, setIsCashRegisterOpen] = useState(false);
  const [ventasModalType, setVentasModalType] = useState<ModalType>(null);
  const [isRegisteringSale, setIsRegisteringSale] = useState(false);
  const [viewingPaymentInfoFor, setViewingPaymentInfoFor] = useState<string | null>(null);
  const [viewingInstallmentReceipt, setViewingInstallmentReceipt] = useState<Installment | null>(null);
  const [registeringPaymentFor, setRegisteringPaymentFor] = useState<PendingPayment | null>(null);
  const [claimModalState, setClaimModalState] = useState<{ sale: SaleDetail, type: 'return' | 'exchange' } | null>(null);
  const [annulments, setAnnulments] = useState<Annulment[]>(initialAnnulmentsData);
  const [annulmentModalState, setAnnulmentModalState] = useState<SaleDetail | null>(null);

  // Datos derivados de Ventas (Memoizados para rendimiento)
  const salesSummary = useMemo(() => deriveSalesSummary(saleDetails), [saleDetails]);
  const paidPayments = useMemo(() => derivePaidPayments(saleDetails), [saleDetails]);
  const pendingPayments = useMemo(() => derivePendingPayments(saleDetails), [saleDetails]);
  const saleForPaymentRegistration = registeringPaymentFor ? saleDetails.find(s => s.id === registeringPaymentFor.saleId) : null;
  const selectedSaleDetail = saleDetails.find(s => s.id === selectedSaleId) || null;


  // ==========================================
  // MANEJADOR DE NAVEGACIÓN MAESTRO
  // ==========================================
  const handleNavigate = (screen: Screen | string) => {
    // Limpieza de estados al cambiar de pantalla
    setSelectedSaleId(null);
    setIsRegisteringSale(false);
    setViewingPaymentInfoFor(null);
    setViewingInstallmentReceipt(null);
    setRegisteringPaymentFor(null);
    
    setCurrentScreen(screen as Screen);
  };


  // ==========================================
  // HANDLERS: ABASTECIMIENTO (COMPLETOS)
  // ==========================================
  const pendingItemsForQuotation = useMemo((): ItemPendiente[] => {
    return pedidos.reduce((acc: ItemPendiente[], pedido) => {
        if (pedido.estado_pedido === 'Revisado') {
            const pendingProducts = pedido.productos
                .filter(p => p.estado_item !== 'En Cotización')
                .map(p => ({
                    ...p,
                    origen_pedido_id: pedido.id_pedido,
                }));
            acc.push(...pendingProducts);
        }
        return acc;
    }, []);
  }, [pedidos]);

  // Provider Handlers
  const handleStartProviderRegistration = () => {
    setProviderToEdit(null);
    setDraftProvider({});
    setCurrentScreen(Screen.ProviderFormStep1);
  };

  const handleStartProviderEdit = (provider: Provider) => {
    setProviderToEdit(provider);
    setDraftProvider(provider);
    setCurrentScreen(Screen.ProviderFormStep1);
  };

  const handleContinueToStep2 = (data: Partial<Provider>) => {
    setDraftProvider(prev => ({...prev, ...data}));
    setCurrentScreen(Screen.ProviderFormStep2);
  };
  
  const handleSaveProvider = (offeredProducts: OfferedProduct[]) => {
    const providerDataWithProducts = {
        ...draftProvider,
        productos: offeredProducts,
        contacto: draftProvider.telefono,
    } as Provider;
    
    if (providerToEdit) {
        setProviders(prev => prev.map(p => p.id === providerToEdit.id ? { ...providerToEdit, ...providerDataWithProducts } : p));
    } else {
        const finalProviderData = {
            ...providerDataWithProducts,
            id: `PROV-0${providers.length + 1}`,
        };
        setProviders(prev => [...prev, finalProviderData]);
    }
    
    setDraftProvider({});
    setProviderToEdit(null);
    setCurrentScreen(Screen.ProvidersList);
  };

  const handleViewProvider = (provider: Provider) => {
    setSelectedProvider(provider);
    setCurrentScreen(Screen.ProviderDetails);
  };

  const handleCancelProviderForm = () => {
    setDraftProvider({});
    setProviderToEdit(null);
    setCurrentScreen(Screen.ProvidersList);
  };

  const handleBackToStep1 = () => {
    setCurrentScreen(Screen.ProviderFormStep1);
  };

  // Product Handlers
  const handleStartProductRegistration = () => {
    setProductToEdit(null);
    setDraftProduct({});
    setCurrentScreen(Screen.ProductForm);
  };

  const handleStartProductEdit = (product: ProductoCatalogo) => {
    setProductToEdit(product);
    setDraftProduct(product);
    setCurrentScreen(Screen.ProductForm);
  };

  const handleViewProduct = (product: ProductoCatalogo) => {
    setSelectedProduct(product);
    setCurrentScreen(Screen.ProductDetails);
  };

  const handleSaveProduct = (productData: Partial<ProductoCatalogo>) => {
    if (productToEdit) {
      setProducts(prev => prev.map(p => p.id_producto === productToEdit.id_producto ? { ...productToEdit, ...productData } : p));
    } else {
      const newProduct: ProductoCatalogo = {
        ...productData,
        id_producto: `PROD-0${products.length + 1}`
      } as ProductoCatalogo;
      setProducts(prev => [...prev, newProduct]);
    }
    setDraftProduct({});
    setProductToEdit(null);
    setCurrentScreen(Screen.ProductsList);
  };
  
  const handleCancelProductForm = () => {
    setDraftProduct({});
    setProductToEdit(null);
    setCurrentScreen(Screen.ProductsList);
  };

  // Pedido Handlers
  const handleViewPedido = (pedido: Pedido) => {
    setSelectedPedido(pedido);
    setCurrentScreen(Screen.PedidoDetails);
  };

  const handleMarkAsReviewed = (pedidoId: string) => {
    setPedidos(prev => 
      prev.map(p => 
        p.id_pedido === pedidoId ? { ...p, estado_pedido: 'Revisado' } : p
      )
    );
    setCurrentScreen(Screen.PedidosList);
  };

  // Solicitud de Cotización Handlers
  const handleViewSolicitud = (solicitud: SolicitudCotizacion) => {
    setSelectedSolicitud(solicitud);
    setCurrentScreen(Screen.SolicitudDetails);
  };

  const handleGenerateSolicitud = (itemsToQuote: ItemPendiente[]) => {
    const newId = `SC-00${solicitudes.length + 1}`;
    const newSolicitud: SolicitudCotizacion = {
        id_solicitud: newId,
        fecha_emision_solicitud: new Date().toLocaleDateString('es-ES').replace(/\//g, '-'),
        estado: 'Generada',
        items: itemsToQuote,
        cotizaciones_recibidas: [],
    };
    
    setSolicitudes(prev => [...prev, newSolicitud]);
    
    const itemsToUpdate = new Set(itemsToQuote.map(item => `${item.origen_pedido_id}-${item.nombre_producto}`));

    setPedidos(prevPedidos => prevPedidos.map(pedido => {
        const hasItemToUpdate = pedido.productos.some(p => itemsToUpdate.has(`${pedido.id_pedido}-${p.nombre_producto}`));
        if (!hasItemToUpdate) return pedido;

        return {
            ...pedido,
            productos: pedido.productos.map(p => 
                itemsToUpdate.has(`${pedido.id_pedido}-${p.nombre_producto}`) 
                ? { ...p, estado_item: 'En Cotización' } 
                : p
            ),
        };
    }));

    setConfirmationModal({
        isOpen: true,
        title: '¡Éxito!',
        message: (
            <span>
                Se ha generado la Solicitud de Cotización <strong className="font-bold text-sky-700">{newId}</strong> con {itemsToQuote.length} ítems.
            </span>
        ),
        onClose: () => {
            setConfirmationModal({ isOpen: false, title: '', message: '' });
            setCurrentScreen(Screen.SolicitudesList);
        }
    });
  };

  const handleStartQuoteRegistration = (solicitud: SolicitudCotizacion) => {
    setSelectedSolicitud(solicitud);
    setCurrentScreen(Screen.RegisterQuote);
  };

  const handleSaveQuote = (quoteData: CotizacionRecibida) => {
    if (!selectedSolicitud) return;

    const updatedSolicitud = {
      ...selectedSolicitud,
      estado: 'Cotizada' as const,
      cotizaciones_recibidas: [...(selectedSolicitud.cotizaciones_recibidas || []), quoteData],
    };

    setSolicitudes(prev => prev.map(s => 
      s.id_solicitud === selectedSolicitud.id_solicitud
        ? updatedSolicitud
        : s
    ));
    
    setSelectedSolicitud(updatedSolicitud);

    setPostQuoteModal({
        isOpen: true,
        title: '¡Éxito!',
        message: (
            <span>
                Cotización de <strong className="font-bold text-sky-700">{quoteData.nombre_proveedor}</strong> registrada con éxito para la solicitud <strong className="font-bold text-sky-700">{selectedSolicitud.id_solicitud}</strong>.
            </span>
        ),
        onAddAnother: () => {
            setPostQuoteModal(prev => ({ ...prev, isOpen: false }));
        },
        onFinish: () => {
            setPostQuoteModal(prev => ({ ...prev, isOpen: false }));
            setSelectedSolicitud(null);
            setCurrentScreen(Screen.SolicitudesList);
        }
    });
  };

  const handleStartEvaluation = (solicitud: SolicitudCotizacion) => {
    setSelectedSolicitud(solicitud);
    setCurrentScreen(Screen.EvaluateQuotes);
  };

  const handleGenerateOCs = (adjudicatedItems: Map<string, AdjudicatedItem>, solicitudId: string) => {
    const groupedByProviderAndPayment = Array.from(adjudicatedItems.values()).reduce((acc, item) => {
      const key = `${item.providerId}-${item.finalPaymentMethod}`;
      if (!acc[key]) {
        acc[key] = {
          providerId: item.providerId,
          providerName: item.providerName,
          paymentMethod: item.finalPaymentMethod,
          items: [],
        };
      }
      acc[key].items.push(item.itemDetails);
      return acc;
    }, {} as Record<string, { providerId: string, providerName: string, paymentMethod: 'Contado' | 'Crédito', items: CotizacionRecibidaItem[] }>);
    
    const newOCs: OrdenCompra[] = Object.values(groupedByProviderAndPayment).map((group, index) => {
      const total = group.items.reduce((sum, item) => sum + item.monto_total_ofertado, 0);
      const oc: OrdenCompra = {
        id_orden: `OC-00${ordenesCompra.length + index + 1}`,
        id_solicitud_origen: solicitudId,
        id_proveedor: group.providerId,
        nombre_proveedor: group.providerName,
        fecha_emision: new Date().toLocaleDateString('es-ES').replace(/\//g, '-'),
        modalidad_pago: group.paymentMethod,
        monto_total_orden: total,
        items: group.items.map(item => ({
          nombre_producto: item.nombre_producto,
          cantidad_adjudicada: item.cantidad_requerida,
          unidad_medida: item.unidad_medida,
          monto_total: item.monto_total_ofertado,
        })),
        estado: 'Emitida',
      };
      return oc;
    });

    setOrdenesCompra(prev => [...prev, ...newOCs]);

    setSolicitudes(prev => prev.map(s => s.id_solicitud === solicitudId ? { ...s, estado: 'Adjudicada' } : s));

    setConfirmationModal({
        isOpen: true,
        title: '¡Órdenes de Compra Generadas!',
        message: (
            <div>
                <p>Se han generado las siguientes órdenes de compra:</p>
                <ul className="list-disc list-inside mt-2 text-sm">
                    {newOCs.map(oc => (
                        <li key={oc.id_orden}>
                            <strong className="font-bold text-sky-700">{oc.id_orden}</strong> para {oc.nombre_proveedor} ({oc.modalidad_pago})
                        </li>
                    ))}
                </ul>
            </div>
        ),
        onClose: () => {
            setConfirmationModal({ isOpen: false, title: '', message: '' });
            setSelectedSolicitud(null);
            setCurrentScreen(Screen.SolicitudesList);
        }
    });
  };

  const handleViewOrderMonitoring = (order: OrdenCompra) => {
    setSelectedOrdenCompra(order);
    setCurrentScreen(Screen.OrderDetailMonitoring);
  };

  // Recepcion Handlers
  const handleStartReceptionScheduling = (order: OrdenCompra) => {
    setSelectedOrdenCompra(order);
    setCurrentScreen(Screen.ScheduleReceptionForm);
  };

  const handleConfirmReception = (data: {
      logisticsMode: 'Entrega en Almacén' | 'Recojo por Transporte Propio';
      finalDate: string;
      finalTime: string;
      recursoAsignado?: string;
      items: DetalleRecepcionItem[];
  }) => {
      if (!selectedOrdenCompra) return;
      
      const nextRecepcionNum = (selectedOrdenCompra.recepciones?.length || 0) + 1;
      const newRecepcionId = `REC-${selectedOrdenCompra.id_orden.split('-')[1]}-${nextRecepcionNum}`;

      const newRecepcion: Recepcion = {
          id_recepcion: newRecepcionId,
          modalidad_logistica: data.logisticsMode,
          fecha_recepcion_programada: data.finalDate,
          hora_recepcion_programada: data.finalTime,
          recurso_asignado: data.recursoAsignado,
          estado_recepcion: 'Pendiente',
          items: data.items,
      };

      let newTransportePedido: PedidoTransporte | null = null;
      if (data.logisticsMode === 'Recojo por Transporte Propio') {
          newTransportePedido = {
              id_pedido_transporte: `PT-00${pedidosTransporte.length + 1}`,
              id_recepcion_origen: newRecepcionId,
              id_orden_compra: selectedOrdenCompra.id_orden,
              proveedor: selectedOrdenCompra.nombre_proveedor,
              fecha_recojo: data.finalDate,
              hora_recojo: data.finalTime,
              estado: 'Pendiente',
          };
          setPedidosTransporte(prev => [...prev, newTransportePedido!]);
      }
      
      const updatedOrder: OrdenCompra = {
          ...selectedOrdenCompra,
          recepciones: [...(selectedOrdenCompra.recepciones || []), newRecepcion],
          estado: 'Programada'
      };

      setOrdenesCompra(prev => prev.map(oc => oc.id_orden === selectedOrdenCompra.id_orden ? updatedOrder : oc));
      
      let confirmationMessage: React.ReactNode = (
          <div>
              <p>Recepción <strong className="font-bold text-sky-700">{newRecepcionId}</strong> programada con éxito.</p>
              {newTransportePedido && (
                  <p className="mt-2">
                      Se ha generado el <strong className="font-bold text-sky-700">PEDIDO DE TRANSPORTE {newTransportePedido.id_pedido_transporte}</strong> para el recojo.
                  </p>
              )}
          </div>
      );

      setConfirmationModal({
          isOpen: true,
          title: '¡Programación Exitosa!',
          message: confirmationMessage,
          onClose: () => {
              setConfirmationModal({ isOpen: false, title: '', message: '' });
              setCurrentScreen(Screen.ScheduleReceptionsList);
              setSelectedOrdenCompra(null);
          }
      });
  };

  const handleStartRemissionGuideValidation = (order: OrdenCompra, recepcion: Recepcion, serial: number) => {
    setSelectedRecepcionForValidation({ order, recepcion, serial });
    setCurrentScreen(Screen.RemissionGuideValidation);
  };
  
  const handleConfirmRemissionGuide = (data: { orderId: string, recepcionId: string, guias: GuiaRemision[] }) => {
    const startTime = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    setOrdenesCompra(prev => prev.map(order => {
        if (order.id_orden !== data.orderId) return order;
        
        const updatedRecepciones = order.recepciones?.map(recepcion => {
            if (recepcion.id_recepcion !== data.recepcionId) return recepcion;
            return {
                ...recepcion,
                estado_recepcion: 'En Curso' as const,
                guias_remision: data.guias,
                hora_inicio_recepcion: startTime,
            };
        });
        
        return { ...order, recepciones: updatedRecepciones };
    }));

    setConfirmationModal({
        isOpen: true,
        title: 'Recepción Iniciada',
        message: (
            <div>
                <p>{data.guias.length} Guía(s) de Remisión con su detalle de productos han sido registradas.</p>
                <p>La Recepción <strong className="font-bold text-sky-700">{data.recepcionId}</strong> ha cambiado a estado 'En Curso'.</p>
                <p className="mt-2">Hora de Inicio Registrada: <strong className="font-bold">{startTime}</strong></p>
            </div>
        ),
        onClose: () => {
            setConfirmationModal({ isOpen: false, title: '', message: '' });
            setSelectedRecepcionForValidation(null);
            setCurrentScreen(Screen.RemissionGuideList);
        }
    });
  };

  // Incidents and Claims Handlers
  const handleGenerateClaim = (data: {
      selectedIncidentIds: string[];
      observation: string;
      correctiveAction: 'Nota de Crédito' | 'Reemplazo de Producto' | 'Otro';
  }) => {
      const newReclamoId = `REC-G-00${reclamos.length + 1}`;
      const newReclamo: Reclamo = {
          id_reclamo: newReclamoId,
          fecha_reclamo: new Date().toLocaleDateString('es-ES').replace(/\//g, '-'),
          incidencias_ids: data.selectedIncidentIds,
          observacion_reclamo: data.observation,
          accion_correctiva: data.correctiveAction,
          estado_reclamo: 'Enviado',
      };
      setReclamos(prev => [...prev, newReclamo]);

      setIncidencias(prev =>
          prev.map(inc =>
              data.selectedIncidentIds.includes(inc.id_incidencia)
                  ? { ...inc, estado_incidencia: 'En Reclamo' }
                  : inc
          )
      );
      
      setConfirmationModal({
          isOpen: true,
          title: '¡Reclamo Generado!',
          message: `El reclamo ${newReclamoId} ha sido generado y enviado al proveedor con ${data.selectedIncidentIds.length} incidencia(s) asociada(s).`,
          onClose: () => {
              setConfirmationModal({ isOpen: false, title: '', message: '' });
              setCurrentScreen(Screen.IncidentsList);
          },
      });
  };

  // ==========================================
  // HANDLERS: CLIENTES (CRM)
  // ==========================================
  const handleViewClientDetail = (client: Client) => { setSelectedClient(client); setCurrentScreen(Screen.ClientDetail); };
  const handleViewMaestroDetail = (maestro: Maestro) => { setSelectedMaestro(maestro); setCurrentScreen(Screen.MaestroDetail); };
  const handleSelectClientForMaestro = (client: Client) => { setSelectedClient(client); setCurrentScreen(Screen.RegisterMaestro); };
  const handleViewReportDetail = (report: Report) => { setSelectedReport(report); setCurrentScreen(Screen.ReportDetail); };
  const handleRegisterSuccess = (type: 'cliente' | 'maestro') => { setSuccessType(type); setCurrentScreen(Screen.RegistrationSuccess); };


  // ==========================================
  // HANDLERS: VENTAS (NUEVO)
  // ==========================================
  const handleSelectSale = (saleId: string) => {
    if (selectedSaleId === saleId) {
      setSelectedSaleId(null);
    } else {
      setSelectedSaleId(saleId);
      setIsRegisteringSale(false);
      setViewingPaymentInfoFor(null);
      setViewingInstallmentReceipt(null);
    }
  };
  
  const handleBackToList = () => {
    setSelectedSaleId(null);
    setViewingPaymentInfoFor(null);
    setViewingInstallmentReceipt(null);
  };

  const handleToggleCashRegisterModal = () => setVentasModalType(isCashRegisterOpen ? 'close' : 'open');
  
  const handleConfirmActionVentas = () => {
    if (ventasModalType === 'open') setIsCashRegisterOpen(true);
    else if (ventasModalType === 'close') setIsCashRegisterOpen(false);
  };

  const handleCloseModalVentas = () => setVentasModalType(null);

  const handleStartRegisterSale = () => {
    setIsRegisteringSale(true);
    setSelectedSaleId(null);
    setViewingPaymentInfoFor(null);
    setViewingInstallmentReceipt(null);
  };

  const handleCancelRegisterSale = () => setIsRegisteringSale(false);
  const handleRegisterSale = (newSale: SaleDetail) => { setSaleDetails(prev => [newSale, ...prev]); setIsRegisteringSale(false); };

  const handleShowPaymentInfo = (saleId: string) => setViewingPaymentInfoFor(saleId);
  const handleBackToDetail = () => { setViewingPaymentInfoFor(null); setViewingInstallmentReceipt(null); };
  const handleShowInstallmentReceipt = (installment: Installment) => setViewingInstallmentReceipt(installment);
  const handleBackToSchedule = () => setViewingInstallmentReceipt(null);

  // Esta función es clave: Redirige a la pantalla principal de Ventas dentro del Layout global
  const handleGoToSales = () => handleNavigate(Screen.MainContent);
  
  const handleOpenRegisterPaymentModal = (payment: PendingPayment) => setRegisteringPaymentFor(payment);
  const handleCloseRegisterPaymentModal = () => setRegisteringPaymentFor(null);

  const handleConfirmPayment = (saleId: string, installmentNumber: number, paymentDetails: any) => {
    // Lógica de pago de Ventas
    setSaleDetails(prevDetails => prevDetails.map(sale => {
        if (sale.id === saleId) {
            const newPaid = (sale.paidInstallments || 0) + 1;
            const newStatus = newPaid === sale.totalInstallments ? SaleStatus.Paid : sale.status;
            // Aquí se agregarían los detalles del pago al registro (simplificado)
            return { ...sale, paidInstallments: newPaid, status: newStatus };
        }
        return sale;
    }));
    setRegisteringPaymentFor(null);
  };

  const handleOpenClaimModal = (sale: SaleDetail, type: 'return' | 'exchange') => setClaimModalState({ sale, type });
  const handleCloseClaimModal = () => setClaimModalState(null);
  const handleConfirmClaim = (claimDetails: any) => {
      // Lógica simplificada de confirmación de reclamo
      console.log("Claim confirmed", claimDetails);
      handleCloseClaimModal();
  };
  
  const handleOpenAnnulmentModal = (sale: SaleDetail) => setAnnulmentModalState(sale);
  const handleCloseAnnulmentModal = () => setAnnulmentModalState(null);
  const handleConfirmAnnulment = (saleId: string, reason: string) => {
    setSaleDetails(prev => prev.map(s => s.id === saleId ? { ...s, status: SaleStatus.Annulled } : s));
    const newAnnulment: Annulment = {
        id: `A-${String(annulments.length + 1).padStart(3, '0')}`,
        saleId,
        date: new Date().toLocaleDateString('es-ES'),
        client: 'Cliente', // Se debería sacar del sale real
        seller: 'Vendedor',
        amount: '0',
        reason
    };
    setAnnulments(prev => [newAnnulment, ...prev]);
    handleCloseAnnulmentModal();
  };


  // ==========================================
  // RENDERIZADO DE PANTALLAS (ROUTER)
  // ==========================================
  const renderScreen = () => {
    switch (currentScreen) {
      // --- MÓDULO ABASTECIMIENTO ---
      case Screen.MainMenu: return <MainMenu onNavigate={handleNavigate} />;
      case Screen.ProvidersList: return <ProvidersList onNavigate={handleNavigate} providers={providers} onViewProvider={handleViewProvider} onRegister={handleStartProviderRegistration} onEditProvider={handleStartProviderEdit} />;
      case Screen.ProviderFormStep1: return <ProviderFormStep1 initialData={draftProvider} onContinue={handleContinueToStep2} onCancel={handleCancelProviderForm} />;
      case Screen.ProviderFormStep2: return <ProviderFormStep2 initialData={draftProvider} onSave={handleSaveProvider} onBack={handleBackToStep1} />;
      case Screen.ProviderDetails: return selectedProvider && <ProviderDetails provider={selectedProvider} onBack={() => handleNavigate(Screen.ProvidersList)} />;
      
      case Screen.ProductsList: return <ProductsList onNavigate={handleNavigate} products={products} onViewProduct={handleViewProduct} onRegister={handleStartProductRegistration} onEditProduct={handleStartProductEdit} />;
      case Screen.ProductForm: return <ProductForm initialData={draftProduct} onSave={handleSaveProduct} onCancel={handleCancelProductForm} />;
      case Screen.ProductDetails: return selectedProduct && <ProductDetails product={selectedProduct} onBack={() => handleNavigate(Screen.ProductsList)} onEdit={() => handleStartProductEdit(selectedProduct)} />;
      
      case Screen.PedidosList: return <PedidosList onNavigate={handleNavigate} pedidos={pedidos} onViewPedido={handleViewPedido} />;
      case Screen.PedidoDetails: return selectedPedido && <PedidoDetails pedido={selectedPedido} onBack={() => handleNavigate(Screen.PedidosList)} onMarkAsReviewed={handleMarkAsReviewed} />;

      case Screen.SolicitudesList: return <SolicitudesList onNavigate={handleNavigate} solicitudes={solicitudes} onViewSolicitud={handleViewSolicitud} onRegisterQuote={handleStartQuoteRegistration} onEvaluateQuotes={handleStartEvaluation} />;
      case Screen.GroupItemsForQuotation: return <GroupItemsForQuotation pendingItems={pendingItemsForQuotation} onGenerate={handleGenerateSolicitud} onCancel={() => handleNavigate(Screen.SolicitudesList)} />;
      case Screen.SolicitudDetails: return selectedSolicitud && <SolicitudDetails solicitud={selectedSolicitud} onBack={() => handleNavigate(Screen.SolicitudesList)} />;
      case Screen.RegisterQuote: return selectedSolicitud && <RegisterQuote solicitud={selectedSolicitud} providers={providers} onSave={handleSaveQuote} onCancel={() => handleNavigate(Screen.SolicitudesList)} />;
      case Screen.EvaluateQuotes: return selectedSolicitud && <EvaluateQuotes solicitud={selectedSolicitud} onGenerateOCs={handleGenerateOCs} onCancel={() => handleNavigate(Screen.SolicitudesList)} />;

      case Screen.OrdersList: return <OrdersList onNavigate={handleNavigate} orders={ordenesCompra} onViewOrder={handleViewOrderMonitoring} />;
      case Screen.OrderDetailMonitoring: return selectedOrdenCompra && <OrderDetailMonitoring order={selectedOrdenCompra} onBack={() => handleNavigate(Screen.OrdersList)} />;
      case Screen.ScheduleReceptionsList: return <ScheduleReceptionsList onNavigate={handleNavigate} orders={ordenesCompra} onScheduleReception={handleStartReceptionScheduling} />;
      case Screen.ScheduleReceptionForm: return selectedOrdenCompra && <ScheduleReceptionForm order={selectedOrdenCompra} onCancel={() => handleNavigate(Screen.ScheduleReceptionsList)} onConfirm={handleConfirmReception} />;
      case Screen.RemissionGuideList: return <RemissionGuideList onNavigate={handleNavigate} orders={ordenesCompra} onValidate={handleStartRemissionGuideValidation} />;
      case Screen.RemissionGuideValidation: return selectedRecepcionForValidation && <RemissionGuideValidation order={selectedRecepcionForValidation.order} recepcion={selectedRecepcionForValidation.recepcion} receptionSerial={selectedRecepcionForValidation.serial} onCancel={() => handleNavigate(Screen.RemissionGuideList)} onConfirm={handleConfirmRemissionGuide} />;
      case Screen.IncidentsList: return <IncidentsList onNavigate={handleNavigate} incidencias={incidencias} onGenerateClaim={handleGenerateClaim} />;
      
      // AI Screens
      case Screen.AIHub: return <AIHub onNavigate={handleNavigate} />;
      case Screen.AIChat: return <AIChatScreen onBack={() => handleNavigate(Screen.AIHub)} />;
      case Screen.AIVision: return <AIVisionScreen onBack={() => handleNavigate(Screen.AIHub)} />;
      case Screen.AIEmailGenerator: return <AIEmailGeneratorScreen onBack={() => handleNavigate(Screen.AIHub)} />;
      case Screen.AIProductCataloger: return <AIProductCatalogerScreen onBack={() => handleNavigate(Screen.AIHub)} />;
      case Screen.AIStrategy: return <AIStrategyScreen onBack={() => handleNavigate(Screen.AIHub)} />;

      // --- MÓDULO CLIENTES / CRM ---
      case Screen.Clients:
        return (
          <div className="flex flex-col gap-6 h-full">
             {/* Header CRM */}
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                     <div className="bg-sky-200 p-2 rounded-lg flex items-center gap-2">
                        <button className="p-1 rounded-md bg-sky-300"><UserIcon className="w-8 h-8 text-blue-600" /></button>
                        <button onClick={() => handleNavigate(Screen.Maestros)} className="p-1 rounded-md hover:bg-sky-300 transition-colors"><WrenchIcon className="w-8 h-8 text-blue-600 opacity-50" /></button>
                     </div>
                     <h1 className="text-4xl font-bold text-gray-800">Clientes</h1>
                 </div>
             </div>
             {/* Barra de Acciones */}
             <div className="flex items-center gap-4">
                <div className="relative flex-grow max-w-md">
                    <input type="text" className="border-2 border-gray-300 bg-white h-10 px-5 pr-12 rounded-lg text-sm w-full focus:outline-none focus:border-blue-500" placeholder="Buscar..." />
                    <button className="absolute right-0 top-0 mt-1 mr-1 p-1"><SearchIcon className="text-gray-500 h-4 w-4" /></button>
                </div>
                <div className="ml-auto flex gap-4">
                    <button onClick={() => handleNavigate(Screen.Reports)} className="flex items-center gap-2 bg-slate-700 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-800">Reportes <ReportsIcon className="w-5 h-5"/></button>
                    <button onClick={() => handleNavigate(Screen.RegisterClient)} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Registrar Cliente <AddIcon className="w-5 h-5"/></button>
                </div>
             </div>
             {/* Tabla */}
             <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow">
                <ClientTable onClientSelect={handleViewClientDetail} />
             </div>
          </div>
        );

      case Screen.Maestros:
         return (
            <div className="flex flex-col gap-6 h-full">
               <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                       <div className="bg-sky-200 p-2 rounded-lg flex items-center gap-2">
                          <button onClick={() => handleNavigate(Screen.Clients)} className="p-1 rounded-md hover:bg-sky-300 transition-colors"><UserIcon className="w-8 h-8 text-blue-600 opacity-50" /></button>
                          <button className="p-1 rounded-md bg-sky-300"><WrenchIcon className="w-8 h-8 text-blue-600" /></button>
                       </div>
                       <h1 className="text-4xl font-bold text-gray-800">Maestros</h1>
                   </div>
               </div>
               <div className="flex items-center gap-4">
                   <input type="text" className="border-2 border-gray-300 bg-white h-10 px-5 pr-12 rounded-lg text-sm w-80 focus:outline-none focus:border-blue-500" placeholder="Buscar..." />
                   <div className="ml-auto">
                      <button onClick={() => handleNavigate(Screen.SelectClientForMaestro)} className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700">Registrar Maestro <AddIcon className="w-5 h-5"/></button>
                   </div>
               </div>
               <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow">
                  <MaestrosTable onMaestroSelect={handleViewMaestroDetail} />
               </div>
            </div>
         );

      case Screen.RegisterClient: return <RegisterClientForm onCancel={() => handleNavigate(Screen.Clients)} onSuccess={() => handleRegisterSuccess('cliente')} />;
      case Screen.SelectClientForMaestro: return <SelectClientForMaestro onCancel={() => handleNavigate(Screen.Maestros)} onSelect={handleSelectClientForMaestro} />;
      case Screen.RegisterMaestro: return selectedClient && <RegisterMaestroForm client={selectedClient} onCancel={() => handleNavigate(Screen.Maestros)} onSuccess={() => handleRegisterSuccess('maestro')} />;
      case Screen.RegistrationSuccess: return <RegistrationSuccess message={successType === 'cliente' ? 'CLIENTE REGISTRADO' : 'MAESTRO REGISTRADO'} onBackToList={() => handleNavigate(successType === 'cliente' ? Screen.Clients : Screen.Maestros)} />;
      case Screen.ClientDetail: return selectedClient && <ClientDetailView client={selectedClient} onUpdate={() => handleNavigate('UpdateClient')} />; 
      case Screen.MaestroDetail: return selectedMaestro && <MaestroDetailView maestro={selectedMaestro} onUpdate={() => handleNavigate('UpdateMaestro')} onCanjear={() => handleNavigate(Screen.Premios)} />;
      case Screen.Premios: return selectedMaestro && <CanjeoView maestro={selectedMaestro} onBack={() => handleNavigate(Screen.MaestroDetail)} />;
      case Screen.Reports: return <ReportsView onReportSelect={handleViewReportDetail} />;
      case Screen.ReportDetail: return selectedReport && <ReportDetailView report={selectedReport} onBack={() => { setSelectedReport(null); handleNavigate(Screen.Reports); }} />;
      case 'UpdateClient': return selectedClient && <UpdateForm client={selectedClient} onCancel={() => handleNavigate(Screen.ClientDetail)} onOpenContacts={() => setIsContactsModalOpen(true)} onOpenDirecciones={() => setIsDireccionesModalOpen(true)} />;
      case 'UpdateMaestro': return selectedMaestro && <UpdateForm maestro={selectedMaestro} onCancel={() => handleNavigate(Screen.MaestroDetail)} onOpenContacts={() => setIsContactsModalOpen(true)} onOpenDirecciones={() => setIsDireccionesModalOpen(true)} />;

      // --- MÓDULO VENTAS (CORREGIDO) ---
      
      // 1. Dashboard y Vista Principal
      case Screen.MainContent:
      case Screen.SalesTable:   // Agregado: Mapea 'Registro de Ventas'
      case Screen.RegisterSale: // Agregado: Por seguridad
        return (
          <VentasMainContent 
            sales={salesSummary}
            saleDetails={saleDetails}
            selectedSaleDetail={selectedSaleDetail}
            onSelectSale={handleSelectSale}
            onBack={handleBackToList}
            isCashRegisterOpen={isCashRegisterOpen}
            modalType={ventasModalType}
            onToggleCashRegister={handleToggleCashRegisterModal}
            onConfirmAction={handleConfirmActionVentas}
            onCloseModal={handleCloseModalVentas}
            isRegisteringSale={isRegisteringSale}
            onStartRegisterSale={handleStartRegisterSale}
            onCancelRegisterSale={handleCancelRegisterSale}
            onRegisterSale={handleRegisterSale}
            viewingPaymentInfoFor={viewingPaymentInfoFor}
            onShowPaymentInfo={handleShowPaymentInfo}
            onBackToDetail={handleBackToDetail}
            viewingInstallmentReceipt={viewingInstallmentReceipt}
            onShowInstallmentReceipt={handleShowInstallmentReceipt}
            onBackToSchedule={handleBackToSchedule}
            onGoToMainMenu={handleGoToSales}
            onRegisterPayment={handleOpenRegisterPaymentModal}
            onOpenClaimModal={handleOpenClaimModal}
            onOpenAnnulmentModal={handleOpenAnnulmentModal}
            onNavigateToPayments={() => handleNavigate(Screen.PaymentsView)}
            onNavigateToClaims={() => handleNavigate(Screen.ClaimsView)}
            onNavigateToReports={() => handleNavigate(Screen.VentasReportsView)}
          />
        );

      // 2. Pagos
      case Screen.PaymentsView:
        return (
            <VentasPaymentsView
                payments={paidPayments}
                pendingPayments={pendingPayments}
                saleDetails={saleDetails}
                onGoToMainMenu={handleGoToSales} 
                onRegisterPayment={handleOpenRegisterPaymentModal}
                isCashRegisterOpen={isCashRegisterOpen}
                modalType={ventasModalType}
                onToggleCashRegister={handleToggleCashRegisterModal}
                onConfirmAction={handleConfirmActionVentas}
                onCloseModal={handleCloseModalVentas}
            />
        );

      // 3. Reclamos
      case Screen.ClaimsView:
        return (
            <VentasClaimsView
                annulments={annulments}
                saleDetails={saleDetails}
                selectedSaleDetail={selectedSaleDetail}
                onGoToMainMenu={handleGoToSales}
                onSelectSale={handleSelectSale}
                onBackFromDetail={handleBackToList}
                viewingPaymentInfoFor={viewingPaymentInfoFor}
                onShowPaymentInfo={handleShowPaymentInfo}
                onBackToDetail={handleBackToDetail}
                viewingInstallmentReceipt={viewingInstallmentReceipt}
                onShowInstallmentReceipt={handleShowInstallmentReceipt}
                onBackToSchedule={handleBackToSchedule}
                onRegisterPayment={handleOpenRegisterPaymentModal}
                onOpenClaimModal={handleOpenClaimModal}
                onOpenAnnulmentModal={handleOpenAnnulmentModal}
            />
        );

      // 4. Reportes
      case Screen.VentasReportsView:
        return (
            <VentasReportsView 
                saleDetails={saleDetails} 
                returns={initialReturnsData}
                exchanges={initialExchangesData}
                annulments={annulments}
                onGoToMainMenu={handleGoToSales} 
            />
        );

      default: return <MainMenu onNavigate={handleNavigate} />;
    }
  };

  return (
    <Layout onNavigate={handleNavigate} currentScreen={currentScreen}>
      {renderScreen()}
      
      {/* Modales Globales Abastecimiento */}
      <ConfirmationModal isOpen={confirmationModal.isOpen} title={confirmationModal.title} message={confirmationModal.message} onClose={confirmationModal.onClose} />
      <PostQuoteModal isOpen={postQuoteModal.isOpen} title={postQuoteModal.title} message={postQuoteModal.message} onAddAnother={postQuoteModal.onAddAnother} onFinish={postQuoteModal.onFinish} />
      
      {/* Modales Globales CRM */}
      <ContactsModal isOpen={isContactsModalOpen} onClose={() => setIsContactsModalOpen(false)} />
      <DireccionesModal isOpen={isDireccionesModalOpen} onClose={() => setIsDireccionesModalOpen(false)} />
      
      {/* Modales Globales Ventas */}
      {registeringPaymentFor && saleForPaymentRegistration && (
        <RegisterPaymentModal
          pendingPayment={registeringPaymentFor}
          saleDetail={saleForPaymentRegistration}
          onClose={handleCloseRegisterPaymentModal}
          onConfirm={handleConfirmPayment}
        />
      )}
      {claimModalState && (
        <ClaimModal 
          sale={claimModalState.sale}
          type={claimModalState.type}
          onClose={handleCloseClaimModal}
          onConfirm={handleConfirmClaim}
        />
      )}
      {annulmentModalState && (
        <AnnulmentModal
          sale={annulmentModalState}
          onClose={handleCloseAnnulmentModal}
          onConfirm={handleConfirmAnnulment}
        />
      )}
    </Layout>
  );
};

export default App;