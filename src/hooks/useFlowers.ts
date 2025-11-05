import { useState, useEffect } from 'react';
import { Flower, Category, Accessory } from '../lib/types';
import flowersData from '../data/flowers.json';

export function useFlowers() {
  const [flowers, setFlowers] = useState<Flower[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setFlowers(flowersData.flowers);
    setCategories(flowersData.categories);
    setAccessories(flowersData.accessories || []);
    setLoading(false);
  }, []);

  return { flowers, categories, accessories, loading };
}
