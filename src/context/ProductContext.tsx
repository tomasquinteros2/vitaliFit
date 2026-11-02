'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '@/types';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface ProductContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>, imageFile?: File) => Promise<void>;
  updateProduct: (product: Product, imageFile?: File) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  loading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar productos desde Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "products"));
        const productsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(productsData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `products/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addProduct = async (productData: Omit<Product, 'id'>, imageFile?: File) => {
    try {
      let imageUrl = productData.image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const docRef = await addDoc(collection(db, "products"), {
        ...productData,
        image: imageUrl
      });

      const newProduct = { ...productData, image: imageUrl, id: docRef.id };
      setProducts(prev => [...prev, newProduct]);
    } catch (error) {
      console.error("Error adding product: ", error);
      throw error;
    }
  };

  const updateProduct = async (updatedProduct: Product, imageFile?: File) => {
    try {
      let imageUrl = updatedProduct.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productRef = doc(db, "products", updatedProduct.id);
      await updateDoc(productRef, {
        ...updatedProduct,
        image: imageUrl
      });

      setProducts(prev =>
        prev.map(p => (p.id === updatedProduct.id ? { ...updatedProduct, image: imageUrl } : p))
      );
    } catch (error) {
      console.error("Error updating product: ", error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting product: ", error);
      throw error;
    }
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
