'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Promotion } from '@/types';
import { db, storage } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

interface PromoContextType {
  promotions: Promotion[];
  addPromotion: (promo: Omit<Promotion, 'id'>, imageFile?: File) => Promise<void>;
  updatePromotion: (promo: Promotion, imageFile?: File) => Promise<void>;
  deletePromotion: (id: string) => Promise<void>;
  loading: boolean;
}

const PromoContext = createContext<PromoContextType | undefined>(undefined);

export const PromoProvider = ({ children }: { children: ReactNode }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar promociones desde Firestore
  useEffect(() => {
    const fetchPromos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "promotions"));
        const promosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Promotion[];
        setPromotions(promosData);
      } catch (error) {
        console.error("Error fetching promotions: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPromos();
  }, []);

  const uploadImage = async (file: File) => {
    const storageRef = ref(storage, `promotions/${Date.now()}_${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const addPromotion = async (promoData: Omit<Promotion, 'id'>, imageFile?: File) => {
    try {
      let imageUrl = promoData.image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const docRef = await addDoc(collection(db, "promotions"), {
        ...promoData,
        image: imageUrl
      });

      const newPromo = { ...promoData, image: imageUrl, id: docRef.id };
      setPromotions(prev => [...prev, newPromo]);
    } catch (error) {
      console.error("Error adding promotion: ", error);
      throw error;
    }
  };

  const updatePromotion = async (updatedPromo: Promotion, imageFile?: File) => {
    try {
      let imageUrl = updatedPromo.image;

      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const promoRef = doc(db, "promotions", updatedPromo.id);
      await updateDoc(promoRef, {
        ...updatedPromo,
        image: imageUrl
      });

      setPromotions(prev =>
        prev.map(p => (p.id === updatedPromo.id ? { ...updatedPromo, image: imageUrl } : p))
      );
    } catch (error) {
      console.error("Error updating promotion: ", error);
      throw error;
    }
  };

  const deletePromotion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "promotions", id));
      setPromotions(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Error deleting promotion: ", error);
      throw error;
    }
  };

  return (
    <PromoContext.Provider value={{ promotions, addPromotion, updatePromotion, deletePromotion, loading }}>
      {children}
    </PromoContext.Provider>
  );
};

export const usePromos = () => {
  const context = useContext(PromoContext);
  if (context === undefined) {
    throw new Error('usePromos must be used within a PromoProvider');
  }
  return context;
};
