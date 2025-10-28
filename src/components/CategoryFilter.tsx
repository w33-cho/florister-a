import { Category } from '../lib/types';
import { Sparkles } from 'lucide-react';

interface CategoryFilterProps {
  categories: Category[];
  selectedCategory: string | null;
  onSelectCategory: (categoryId: string | null) => void;
}

export function CategoryFilter({ categories, selectedCategory, onSelectCategory }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-12 justify-center">
      <button
        onClick={() => onSelectCategory(null)}
        className={`group relative ${
          selectedCategory === null ? 'scale-105' : ''
        } transition-transform duration-300`}
      >
        {selectedCategory === null && (
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg opacity-70" />
        )}
        <div
          className={`relative px-8 py-3 rounded-2xl font-bold transition-all duration-300 border-2 ${
            selectedCategory === null
              ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400/50 shadow-2xl shadow-pink-500/50'
              : 'bg-pink-50/50 backdrop-blur-sm text-pink-600 border-pink-500/30 hover:border-pink-400/60 hover:bg-pink-100/50'
          }`}
        >
          <Sparkles size={18} className="inline mr-2" />
          Todos los Elementos
        </div>
      </button>

      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onSelectCategory(category.id)}
          className={`group relative ${
            selectedCategory === category.id ? 'scale-105' : ''
          } transition-transform duration-300`}
        >
          {selectedCategory === category.id && (
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-rose-500 rounded-2xl blur-lg opacity-70" />
          )}
          <div
            className={`relative px-8 py-3 rounded-2xl font-bold transition-all duration-300 border-2 ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400/50 shadow-2xl shadow-pink-500/50'
                : 'bg-pink-50/50 backdrop-blur-sm text-pink-600 border-pink-500/30 hover:border-pink-400/60 hover:bg-pink-100/50'
            }`}
          >
            {category.name}
          </div>
        </button>
      ))}
    </div>
  );
}
