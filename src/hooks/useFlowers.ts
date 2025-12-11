import { useState, useEffect } from 'react';
import { Flower, Category, Accessory } from '../lib/types';
import flowersData from '../data/flowers.json';

export function useFlowers() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Assign category_id based on image_url path
    const flowersWithCategories = flowersData.flowers.map(flower => {
      let category_id = '1'; // default to accessories
      if (flower.image_url.startsWith('/Macetas/')) {
        category_id = '2';
      } else if (flower.image_url.startsWith('/Ramos/')) {
        category_id = '3';
      } else if (flower.image_url.startsWith('/Ramos Lumínicos/')) {
        category_id = '4';
      } else if (flower.image_url.startsWith('/Accesorios/')) {
        category_id = '1';
      } else if (flower.image_url.startsWith('/Otras/')) {
        // For Otras, check if it's a ramo
        if (flower.name.includes('Ramo')) {
          category_id = '3'; // Ramos
        } else {
          category_id = '1'; // Accessories
        }
      }
      return { ...flower, category_id };
    });

    setFlowers(flowersWithCategories);
    setCategories(flowersData.categories);
    setAccessories(flowersData.accessories || []);
    setLoading(false);
  }, []);

  return { flowers, categories, accessories, loading };
}
