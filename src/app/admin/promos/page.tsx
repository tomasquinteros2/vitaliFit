'use client';

import React, { useState, useEffect, SyntheticEvent } from 'react';
import { usePromos } from '@/context/PromoContext';
import { useProducts } from '@/context/ProductContext';
import { Promotion } from '@/types';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Tag, CheckSquare, Square, UploadCloud, Image as ImageIcon, Loader2, User, Lock, LogOut } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AdminPromosPage = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Promo State
  const { promotions, addPromotion, updatePromotion, deletePromotion, loading } = usePromos();
  const { products } = useProducts();
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Verificar sesión al cargar
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setLoadingAuth(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error(error);
      setError('Error al iniciar sesión. Verifica tus credenciales.');
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setEmail('');
    setPassword('');
  };

  // ... Lógica de promociones ...
  const handleEdit = (promo: Promotion) => {
    setEditingPromo({ ...promo });
    setSelectedFile(null);
  };

  const handleSave = async () => {
    if (editingPromo) {
      // Validaciones previas
      if (!isCreating && !editingPromo.id) {
        alert("Error: No se puede actualizar una promoción sin ID válido.");
        return;
      }

      setIsSaving(true);
      try {
        if (isCreating) {
          // Excluir el ID vacío para que no se guarde en la base de datos como string vacío
          const { id, ...newPromoData } = editingPromo;
          await addPromotion(newPromoData as Promotion, selectedFile || undefined);
        } else {
          await updatePromotion(editingPromo, selectedFile || undefined);
        }
        setEditingPromo(null);
        setIsCreating(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error saving promotion:", error);
        alert("Error al guardar la promoción. Intenta de nuevo.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingPromo(null);
    setIsCreating(false);
    setSelectedFile(null);
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingPromo({
      id: '',
      name: '',
      price: 0,
      image: '', // Empty initially
      description: '',
      productIds: [],
    });
    setSelectedFile(null);
  };

  const toggleProductSelection = (productId: string) => {
    if (!editingPromo) return;
    const isSelected = editingPromo.productIds.includes(productId);
    if (isSelected) {
      setEditingPromo({
        ...editingPromo,
        productIds: editingPromo.productIds.filter(id => id !== productId)
      });
    } else {
      setEditingPromo({
        ...editingPromo,
        productIds: [...editingPromo.productIds, productId]
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingPromo) {
      setSelectedFile(file);
      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingPromo({ ...editingPromo, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.style.display = 'none';
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="text-neon-green animate-spin" size={48} />
      </div>
    );
  }

  // Render Login Form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-800 mb-4">
              <Tag className="text-neon-green w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin Promociones</h1>
            <p className="text-zinc-400 text-sm mt-2">Ingresa tus credenciales.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-green transition-colors"
                  placeholder="admin@vitalifit.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-neon-green transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-lg text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-neon-green text-black font-bold py-3 rounded-lg hover:bg-neon-green/90 transition-transform active:scale-95"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/" className="text-zinc-500 hover:text-white text-sm transition-colors">
              ← Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Render Promo Form
  const renderPromoForm = () => {
    if (!editingPromo) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-800 w-full max-w-2xl animate-fade-in-up shadow-2xl my-8">
          <h2 className="text-2xl font-bold mb-6 text-neon-green flex items-center gap-2">
            {isCreating ? <Plus size={24} /> : <Edit size={24} />}
            {isCreating ? 'Crear Nueva Promoción' : 'Editar Promoción'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Nombre de la Promo</label>
              <input
                type="text"
                value={editingPromo.name}
                onChange={(e) => setEditingPromo({ ...editingPromo, name: e.target.value })}
                className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green text-white"
              />
            </div>
            
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Descripción</label>
              <textarea
                value={editingPromo.description}
                onChange={(e) => setEditingPromo({ ...editingPromo, description: e.target.value })}
                className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green h-24 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Precio Promo ($)</label>
                <input
                  type="number"
                  value={editingPromo.price === 0 ? '' : editingPromo.price}
                  placeholder="0"
                  onChange={(e) => setEditingPromo({ ...editingPromo, price: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                  className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green text-white"
                />
              </div>
              
              {/* Image Upload Section */}
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Imagen de la Promo</label>
                <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 hover:border-neon-green transition-colors group relative h-[120px] flex items-center justify-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                  />
                  
                  {editingPromo.image ? (
                    <div className="relative h-full w-full rounded-lg overflow-hidden">
                      <Image 
                        src={editingPromo.image} 
                        alt="Preview" 
                        fill 
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadCloud size={20} className="text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-zinc-500 group-hover:text-neon-green transition-colors">
                      <ImageIcon size={24} className="mb-1" />
                      <p className="text-xs font-medium">Subir imagen</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Productos Incluidos</label>
              <div className="bg-zinc-800 rounded-lg p-4 max-h-48 overflow-y-auto border border-zinc-700 space-y-2">
                {products.map(product => (
                  <div 
                    key={product.id} 
                    onClick={() => toggleProductSelection(product.id)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${editingPromo.productIds.includes(product.id) ? 'bg-neon-green/10 border border-neon-green/30' : 'hover:bg-zinc-700'}`}
                  >
                    {editingPromo.productIds.includes(product.id) ? (
                      <CheckSquare size={18} className="text-neon-green" />
                    ) : (
                      <Square size={18} className="text-zinc-500" />
                    )}
                    <span className={editingPromo.productIds.includes(product.id) ? 'text-white font-medium' : 'text-zinc-400'}>
                      {product.name}
                    </span>
                    <span className="ml-auto text-xs text-zinc-500">${product.price}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-zinc-500 mt-1">Selecciona los productos que forman parte de este pack.</p>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-8">
            <button 
              onClick={handleCancel} 
              disabled={isSaving}
              className="px-4 py-2 rounded-lg bg-zinc-800 text-white hover:bg-zinc-700 transition-colors font-medium disabled:opacity-50"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="px-6 py-2 rounded-lg bg-neon-green text-black font-bold hover:bg-neon-green/90 transition-colors shadow-lg shadow-neon-green/20 flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 size={18} className="animate-spin" /> Guardando...
                </>
              ) : (
                <>
                  <Save size={18} /> Guardar
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <div className="container mx-auto px-4 py-8">
        {/* Header Admin */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Link href="/admin" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                Admin <span className="text-neon-green">Promos</span>
              </h1>
              <p className="text-zinc-500 text-sm">Gestiona tus ofertas y packs</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleCreate} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-neon-green text-black px-5 py-2.5 rounded-lg font-bold hover:bg-neon-green/90 transition-colors shadow-lg shadow-neon-green/10"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nueva Promo</span>
              <span className="sm:hidden">Nueva</span>
            </button>
            
            <button 
              onClick={handleLogout}
              className="p-2.5 bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-400 hover:text-red-500 hover:border-red-500/50 transition-all"
              title="Cerrar Sesión"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-zinc-800/50 border-b border-zinc-800">
                <tr>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">Promoción</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">Productos</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">Precio</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-500">
                      <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                      Cargando promociones...
                    </td>
                  </tr>
                ) : promotions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-500">
                      No hay promociones activas.
                    </td>
                  </tr>
                ) : (
                  promotions.map((promo) => (
                    <tr key={promo.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                            {promo.image ? (
                              <Image 
                                src={promo.image} 
                                alt={promo.name} 
                                fill 
                                className="object-cover" 
                                sizes="40px" 
                                unoptimized 
                                onError={handleImageError} 
                              />
                            ) : (
                              <ImageIcon className="text-zinc-600 m-auto h-full w-1/2" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-white">{promo.name}</div>
                            <div className="text-xs text-zinc-500 truncate max-w-[200px]">{promo.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {promo.productIds.length} items
                        </span>
                      </td>
                      <td className="p-4 text-neon-green font-mono font-bold">
                        ${promo.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => promo.id && handleEdit(promo)} 
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => promo.id && deletePromotion(promo.id)} 
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {renderPromoForm()}
    </div>
  );
};

export default AdminPromosPage;
