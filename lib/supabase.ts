import { createClient } from '@supabase/supabase-js';
import { Product } from './types';
import { INITIAL_PRODUCTS_DATA } from './products-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function mapSupabaseProduct(row: any): Product {
  const categoryNameMap: Record<string, string> = {
    'st-dupont': 'S.T. Dupont France',
    'dupont-hk': 'Dupont Hongkong',
    'dupont-hongkong': 'Dupont Hongkong',
    'rowenta': 'Rowenta R10',
    'phu-kien': 'Phụ Kiện Lửa',
  };

  const categoryId = row.category_id || row.category || 'st-dupont';
  const priceNum = Number(row.price) || 0;
  const formattedPrice = row.price_formatted || (priceNum ? new Intl.NumberFormat('vi-VN').format(priceNum) + 'đ' : '0đ');

  return {
    id: String(row.id),
    name: row.name,
    category: categoryId,
    categoryName: categoryNameMap[categoryId] || 'Sản Phẩm',
    price: formattedPrice,
    priceNum: priceNum,
    badge: row.badge || undefined,
    img: row.image_url || row.img || '/assets/img/banner/banner.png',
    desc: row.description || row.desc || '',
    specs: row.specs || {},
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from('products').select('*');
    if (error || !data || data.length === 0) {
      console.warn('Supabase fetch returned empty or error, falling back to local dataset:', error?.message);
      return INITIAL_PRODUCTS_DATA;
    }
    return data.map(mapSupabaseProduct);
  } catch (err) {
    console.error('Error connecting to Supabase:', err);
    return INITIAL_PRODUCTS_DATA;
  }
}

export async function fetchProductByIdFromSupabase(id: string): Promise<Product> {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single();
    if (error || !data) {
      return INITIAL_PRODUCTS_DATA.find(p => p.id === id) || INITIAL_PRODUCTS_DATA[0];
    }
    return mapSupabaseProduct(data);
  } catch {
    return INITIAL_PRODUCTS_DATA.find(p => p.id === id) || INITIAL_PRODUCTS_DATA[0];
  }
}
