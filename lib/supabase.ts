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

export async function createOrderInSupabase(orderData: {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  payment_method: string;
  total_amount: number;
  note: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    priceNum: number;
  }>;
}) {
  try {
    // 1. Insert into orders table
    const { error: orderErr } = await supabase.from('orders').insert({
      id: orderData.id,
      customer_name: orderData.customer_name,
      customer_phone: orderData.customer_phone,
      customer_address: orderData.customer_address,
      payment_method: orderData.payment_method,
      total_amount: orderData.total_amount,
      note: orderData.note,
      status: 'pending',
    });

    if (orderErr) {
      console.error('Error inserting order into Supabase:', orderErr);
    }

    // 2. Insert into order_items table
    if (orderData.items && orderData.items.length > 0) {
      const orderItems = orderData.items.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.priceNum,
        subtotal: item.priceNum * item.quantity,
      }));

      const { error: itemsErr } = await supabase.from('order_items').insert(orderItems);
      if (itemsErr) {
        console.error('Error inserting order items into Supabase:', itemsErr);
      }
    }

    return { success: true };
  } catch (err) {
    console.error('Supabase createOrder error:', err);
    return { success: false, error: err };
  }
}
