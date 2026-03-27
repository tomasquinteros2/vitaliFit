'use client';

import React, { useState, useEffect, SyntheticEvent } from 'react';
import { useProducts } from '@/context/ProductContext';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Save, X, ArrowLeft, Lock, LogOut, User, UploadCloud, Image as ImageIcon, Loader2, Star, ShieldAlert, PackageX } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

const AdminPage = () => {
  // Auth State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Product State
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProducts();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newFlavor, setNewFlavor] = useState('');

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

  // Función de limpieza de emergencia
  const handleCleanup = async () => {
    if (!confirm('ATENCIÓN: Esto buscará y eliminará todos los productos corruptos (sin nombre o inválidos) de la base de datos. ¿Continuar?')) return;
    
    setIsSaving(true);
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      let deletedCount = 0;
      
      const deletePromises = querySnapshot.docs.map(async (document) => {
        const data = document.data();
        if (!data.name || data.name.trim() === '' || !document.id) {
          await deleteDoc(doc(db, "products", document.id));
          deletedCount++;
        }
      });

      await Promise.all(deletePromises);
      alert(`Limpieza completada. Se eliminaron ${deletedCount} productos corruptos. La página se recargará.`);
      window.location.reload();
    } catch (error) {
      console.error("Error cleaning DB:", error);
      alert("Error al intentar limpiar la base de datos.");
    } finally {
      setIsSaving(false);
    }
  };

  // ... Lógica existente de productos ...
  const handleEdit = (product: Product) => {
    setEditingProduct({ ...product });
    setSelectedFile(null);
    setNewFlavor('');
  };

  const handleSave = async () => {
    if (editingProduct) {
      // Validaciones previas
      if (!isCreating && !editingProduct.id) {
        alert("Error: No se puede actualizar un producto sin ID válido. Usa el botón de limpieza (escudo rojo).");
        return;
      }

      setIsSaving(true);
      try {
        if (isCreating) {
          // Excluir el ID vacío para que no se guarde en la base de datos como string vacío
          const { id, ...newProductData } = editingProduct;
          await addProduct(newProductData as Product, selectedFile || undefined);
        } else {
          await updateProduct(editingProduct, selectedFile || undefined);
        }
        setEditingProduct(null);
        setIsCreating(false);
        setSelectedFile(null);
      } catch (error) {
        console.error("Error saving product:", error);
        alert("Error al guardar el producto. Intenta de nuevo.");
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
    setIsCreating(false);
    setSelectedFile(null);
    setNewFlavor('');
  };

  const handleCreate = () => {
    setIsCreating(true);
    setEditingProduct({
      id: '',
      name: '',
      price: 0,
      category: 'Proteínas',
      image: '',
      description: '',
      isFeatured: false,
      flavors: [],
      inStock: true,
    });
    setSelectedFile(null);
    setNewFlavor('');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && editingProduct) {
      setSelectedFile(file);
      // Preview local
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditingProduct({ ...editingProduct, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
    const handleImageError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.style.display = 'none';
        // Opcional: mostrar un placeholder o icono
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
              <Lock className="text-neon-green w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">Acceso Administrativo</h1>
            <p className="text-zinc-400 text-sm mt-2">Ingresa tus credenciales para gestionar la tienda.</p>
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
                  placeholder="email@email.com"
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
              Ingresar al Panel
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

  // Render Admin Dashboard (Existing Logic)
  const renderProductForm = () => {
    if (!editingProduct) return null;

    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-zinc-900 p-6 md:p-8 rounded-xl border border-zinc-800 w-full max-w-lg animate-fade-in-up shadow-2xl my-8">
          <h2 className="text-2xl font-bold mb-6 text-neon-green flex items-center gap-2">
            {isCreating ? <Plus size={24} /> : <Edit size={24} />}
            {isCreating ? 'Crear Nuevo Producto' : 'Editar Producto'}
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Nombre</label>
              <input
                type="text"
                value={editingProduct.name}
                onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green text-white"
              />
            </div>
            
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Descripción</label>
              <textarea
                value={editingProduct.description}
                onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green h-24 text-white resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Precio ($)</label>
                <input
                  type="number"
                  value={editingProduct.price === 0 ? '' : editingProduct.price}
                  placeholder="0"
                  onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value === '' ? 0 : parseFloat(e.target.value) || 0 })}
                  className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green text-white"
                />
              </div>
              <div>
                <label className="text-xs text-zinc-500 uppercase font-bold mb-1 block">Categoría</label>
                <select
                  value={editingProduct.category}
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as Product['category'] })}
                  className="w-full bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green text-white appearance-none"
                >
                  <option>Proteínas</option>
                  <option>Pre-Workout & Energía</option>
                  <option>Recuperación</option>
                  <option>Salud & Vitaminas</option>
                </select>
              </div>
            </div>

            {/* Featured Toggle */}
            <div className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg border border-zinc-700">
              <input
                type="checkbox"
                id="isFeatured"
                checked={editingProduct.isFeatured || false}
                onChange={(e) => setEditingProduct({ ...editingProduct, isFeatured: e.target.checked })}
                className="w-5 h-5 accent-neon-green cursor-pointer"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium text-white cursor-pointer flex items-center gap-2">
                <Star size={16} className={editingProduct.isFeatured ? "text-neon-green fill-neon-green" : "text-zinc-500"} />
                Destacar en Inicio
              </label>
            </div>

            {/* Stock Toggle */}
            <div className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${editingProduct.inStock === false ? 'bg-red-500/10 border-red-500/50' : 'bg-zinc-800 border-zinc-700'}`}>
              <input
                type="checkbox"
                id="inStock"
                checked={editingProduct.inStock !== false}
                onChange={(e) => setEditingProduct({ ...editingProduct, inStock: e.target.checked })}
                className="w-5 h-5 accent-neon-green cursor-pointer"
              />
              <label htmlFor="inStock" className="text-sm font-medium text-white cursor-pointer flex items-center gap-2 flex-1">
                <PackageX size={16} className={editingProduct.inStock === false ? "text-red-400" : "text-zinc-500"} />
                {editingProduct.inStock === false ? (
                  <span className="text-red-400 font-bold">Sin Stock — no se puede comprar</span>
                ) : (
                  <span>Con Stock</span>
                )}
              </label>
            </div>

            {/* Sabores */}
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Sabores</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newFlavor}
                  onChange={(e) => setNewFlavor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const trimmed = newFlavor.trim();
                      if (trimmed && !(editingProduct.flavors || []).includes(trimmed)) {
                        setEditingProduct({ ...editingProduct, flavors: [...(editingProduct.flavors || []), trimmed] });
                      }
                      setNewFlavor('');
                    }
                  }}
                  placeholder="Ej: Chocolate"
                  className="flex-1 bg-zinc-800 p-3 rounded-lg border border-zinc-700 focus:outline-none focus:border-neon-green text-white"
                />
                <button
                  type="button"
                  onClick={() => {
                    const trimmed = newFlavor.trim();
                    if (trimmed && !(editingProduct.flavors || []).includes(trimmed)) {
                      setEditingProduct({ ...editingProduct, flavors: [...(editingProduct.flavors || []), trimmed] });
                    }
                    setNewFlavor('');
                  }}
                  className="px-4 py-2 bg-neon-green text-black font-bold rounded-lg hover:bg-neon-green/90 transition-colors flex items-center gap-1"
                >
                  <Plus size={18} />
                </button>
              </div>
              {(editingProduct.flavors || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {(editingProduct.flavors || []).map((f) => (
                    <span key={f} className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-zinc-700 text-zinc-200 rounded-full">
                      {f}
                      <button
                        type="button"
                        onClick={() => setEditingProduct({ ...editingProduct, flavors: (editingProduct.flavors || []).filter(fl => fl !== f) })}
                        className="ml-1 text-zinc-400 hover:text-red-400 transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <p className="text-xs text-zinc-600 mt-1">Presioná Enter o el botón + para agregar cada sabor.</p>
            </div>

            {/* Image Upload Section */}
            <div>
              <label className="text-xs text-zinc-500 uppercase font-bold mb-2 block">Imagen del Producto</label>
              <div className="border-2 border-dashed border-zinc-700 rounded-xl p-4 hover:border-neon-green transition-colors group relative">
                <input 
                  type="file" 
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                
                {editingProduct.image ? (
                  <div className="relative h-40 w-full rounded-lg overflow-hidden">
                    <Image 
                      src={editingProduct.image} 
                      alt="Preview" 
                      fill 
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white font-bold flex items-center gap-2">
                        <UploadCloud size={20} /> Cambiar Imagen
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 flex flex-col items-center justify-center text-zinc-500 group-hover:text-neon-green transition-colors">
                    <ImageIcon size={32} className="mb-2" />
                    <p className="text-sm font-medium">Click para subir imagen</p>
                    <p className="text-xs opacity-70">JPG, PNG, WEBP</p>
                  </div>
                )}
              </div>
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
            <Link href="/" className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-tighter">
                Panel <span className="text-neon-green">Admin</span>
              </h1>
              <p className="text-zinc-500 text-sm">Gestiona tu inventario</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <button 
              onClick={handleCleanup}
              className="p-2.5 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition-all"
              title="Limpiar productos corruptos"
            >
              <ShieldAlert size={20} />
            </button>

            <button 
              onClick={handleCreate} 
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-neon-green text-black px-5 py-2.5 rounded-lg font-bold hover:bg-neon-green/90 transition-colors shadow-lg shadow-neon-green/10"
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Nuevo Producto</span>
              <span className="sm:hidden">Nuevo</span>
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
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">Producto</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">Categoría</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider">Precio</th>
                  <th className="p-4 text-xs font-bold uppercase text-zinc-500 tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-500">
                      <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                      Cargando productos...
                    </td>
                  </tr>
                ) : products.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-zinc-500">
                      No hay productos en el inventario.
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id} className="hover:bg-zinc-800/30 transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-10 w-10 rounded bg-zinc-800 overflow-hidden flex-shrink-0">
                            {product.image ? (
                                <Image
                                    src={product.image}
                                    alt={product.name}
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
                            <div className="font-bold text-white flex items-center gap-2">
                              {product.name}
                              {product.isFeatured && (
                                <Star size={14} className="text-neon-green fill-neon-green" />
                              )}
                              {product.inStock === false && (
                                <span className="text-[10px] font-black uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 px-1.5 py-0.5 rounded">
                                  Sin Stock
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-zinc-500 truncate max-w-[200px]">{product.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 rounded text-xs font-bold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="p-4 text-neon-green font-mono font-bold">
                        ${product.price.toFixed(2)}
                      </td>
                      <td className="p-4">
                        <div className="flex justify-end gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={() => product.id && handleEdit(product)} 
                            className="p-2 rounded-lg bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => product.id && deleteProduct(product.id)} 
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
      {renderProductForm()}
    </div>
  );
};

export default AdminPage;
