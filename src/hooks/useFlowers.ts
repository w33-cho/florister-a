import { useState, useEffect } from 'react';
import { Flower, Category, Accessory } from '../lib/types';
import flowersData from '../data/flowers.json';

export function useFlowers() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[LCP Debug] useFlowers: Starting data load');
    setFlowers(flowersData.flowers);
    setCategories(flowersData.categories);
    setAccessories(flowersData.accessories || []);
    setLoading(false);
    console.log('[LCP Debug] useFlowers: Data loaded', {
      flowersCount: flowersData.flowers.length,
      categoriesCount: flowersData.categories.length,
      accessoriesCount: flowersData.accessories?.length || 0
    });
  }, []);

  return { flowers, categories, accessories, loading };
}
