import { createClient } from '@supabase/supabase-js';
import { Product, Order } from './types';
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
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
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

export async function saveProductToSupabase(product: Product, isEditing: boolean) {
  try {
    const row = {
      id: product.id,
      name: product.name,
      category_id: product.category,
      price: product.priceNum,
      price_formatted: product.price || (new Intl.NumberFormat('vi-VN').format(product.priceNum) + 'đ'),
      badge: product.badge || null,
      image_url: product.img,
      description: product.desc,
      specs: product.specs || {},
      in_stock: true
    };

    if (isEditing) {
      const { error } = await supabase.from('products').update(row).eq('id', product.id);
      if (error) console.error('Error updating product in Supabase:', error);
    } else {
      const { error } = await supabase.from('products').insert([row]);
      if (error) console.error('Error inserting product into Supabase:', error);
    }
    return { success: true };
  } catch (err) {
    console.error('Error saveProductToSupabase:', err);
    return { success: false, error: err };
  }
}

export async function deleteProductFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('Error deleting product from Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('Error deleteProductFromSupabase:', err);
    return { success: false, error: err };
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

export async function fetchOrdersFromSupabase(): Promise<Order[]> {
  try {
    const { data: ordersData, error: ordersErr } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (ordersErr || !ordersData || ordersData.length === 0) {
      return [];
    }

    const { data: itemsData } = await supabase.from('order_items').select('*');

    const mappedOrders: Order[] = ordersData.map((row: any) => {
      const relatedItems = itemsData ? itemsData.filter((i: any) => i.order_id === row.id) : [];

      return {
        id: row.id,
        createdAt: row.created_at ? new Date(row.created_at).toISOString().replace('T', ' ').substring(0, 16) : '',
        customerInfo: {
          fullname: row.customer_name || 'Khách Hàng',
          phone: row.customer_phone || '',
          address: row.customer_address || '',
          notes: row.note || '',
          paymentMethod: (row.payment_method === 'bank' ? 'bank_transfer' : 'cod') as any,
        },
        items: relatedItems.map((item: any) => ({
          id: item.product_id || String(item.id),
          name: item.product_name || 'Sản phẩm Tiệm Lửa',
          priceNum: Number(item.price) || 0,
          quantity: Number(item.quantity) || 1,
          img: '/assets/img/banner/banner.png'
        })),
        subtotal: Number(row.total_amount) || 0,
        discount: 0,
        totalAmount: Number(row.total_amount) || 0,
        status: (row.status || 'pending') as any
      };
    });

    return mappedOrders;
  } catch (err) {
    console.error('Error fetchOrdersFromSupabase:', err);
    return [];
  }
}

export async function updateOrderStatusInSupabase(orderId: string, status: string) {
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) {
      console.error('Error updating order status in Supabase:', error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (err) {
    console.error('Error updateOrderStatusInSupabase:', err);
    return { success: false, error: err };
  }
}
