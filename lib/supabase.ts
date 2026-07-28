import { createClient } from '@supabase/supabase-js';
import { Product, Order } from './types';
import { INITIAL_PRODUCTS_DATA } from './products-data';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lnwltbvlifrhyrpwtmmf.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_nkefygNGjpLMtEsPv127jQ_yJakszuM';

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

  const rawImg = row.image_url || row.img || '/assets/img/banner/banner.png';
  const safeImg = rawImg.startsWith('http') || rawImg.startsWith('data:') ? rawImg : encodeURI(rawImg);

  return {
    id: String(row.id),
    name: row.name,
    category: categoryId,
    categoryName: categoryNameMap[categoryId] || 'Sản Phẩm',
    price: formattedPrice,
    priceNum: priceNum,
    badge: row.badge || undefined,
    img: safeImg,
    desc: row.description || row.desc || '',
    specs: row.specs || {},
  };
}

export async function fetchProductsFromSupabase(): Promise<Product[]> {
  let dbProducts: Product[] = [];
  try {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (!error && data && data.length > 0) {
      dbProducts = data.map(mapSupabaseProduct);
    } else {
      dbProducts = INITIAL_PRODUCTS_DATA;
    }
  } catch (err) {
    dbProducts = INITIAL_PRODUCTS_DATA;
  }

  // Merge with custom products in localStorage so newly added products ALWAYS show 100%
  try {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('tiemlua_custom_products');
      if (local) {
        const customList: Product[] = JSON.parse(local);
        const combinedMap = new Map<string, Product>();
        customList.forEach(p => combinedMap.set(p.id, p));
        dbProducts.forEach(p => {
          if (!combinedMap.has(p.id)) combinedMap.set(p.id, p);
        });
        return Array.from(combinedMap.values());
      }
    }
  } catch (e) {
    console.warn('Error merging local custom products:', e);
  }

  return dbProducts;
}

export async function fetchProductByIdFromSupabase(id: string): Promise<Product> {
  try {
    const allProds = await fetchProductsFromSupabase();
    const found = allProds.find(p => p.id === id);
    if (found) return found;

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
  const cleanProd: Product = {
    ...product,
    img: product.img || '/assets/img/products/S.T Dupont/Lacquered lighter cohiba 60 black.webp'
  };

  try {
    const row = {
      id: cleanProd.id,
      name: cleanProd.name,
      category_id: cleanProd.category,
      price: cleanProd.priceNum,
      price_formatted: cleanProd.price || (new Intl.NumberFormat('vi-VN').format(cleanProd.priceNum) + 'đ'),
      badge: cleanProd.badge || null,
      image_url: cleanProd.img,
      description: cleanProd.desc,
      specs: cleanProd.specs || {},
      in_stock: true
    };

    if (isEditing) {
      const { error } = await supabase.from('products').update(row).eq('id', cleanProd.id);
      if (error) console.warn('Supabase update info:', error.message);
    } else {
      const { error } = await supabase.from('products').insert([row]);
      if (error) console.warn('Supabase insert info:', error.message);
    }
  } catch (err) {
    console.warn('saveProductToSupabase info:', err);
  }

  // Always update local persistent storage so new product is guaranteed to display
  try {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('tiemlua_custom_products');
      let list: Product[] = local ? JSON.parse(local) : [];
      if (isEditing) {
        list = list.map(p => p.id === cleanProd.id ? cleanProd : p);
      } else {
        list = [cleanProd, ...list.filter(p => p.id !== cleanProd.id)];
      }
      localStorage.setItem('tiemlua_custom_products', JSON.stringify(list));
    }
  } catch (e) {
    console.warn('Error saving local custom product:', e);
  }

  return { success: true };
}

export async function deleteProductFromSupabase(id: string) {
  try {
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) console.warn('Supabase delete info:', error.message);
  } catch (err) {
    console.warn('Error deleteProductFromSupabase:', err);
  }

  try {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem('tiemlua_custom_products');
      if (local) {
        let list: Product[] = JSON.parse(local);
        list = list.filter(p => p.id !== id);
        localStorage.setItem('tiemlua_custom_products', JSON.stringify(list));
      }
    }
  } catch (e) {
    console.warn('Error deleting local custom product:', e);
  }

  return { success: true };
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

    if (orderErr) console.warn('Error inserting order:', orderErr.message);

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
      if (itemsErr) console.warn('Error inserting order items:', itemsErr.message);
    }

    return { success: true };
  } catch (err) {
    console.warn('Supabase createOrder error:', err);
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
    console.warn('Error fetchOrdersFromSupabase:', err);
    return [];
  }
}

export async function updateOrderStatusInSupabase(orderId: string, status: string) {
  try {
    const { error } = await supabase.from('orders').update({ status }).eq('id', orderId);
    if (error) console.warn('Error updating order status:', error.message);
    return { success: true };
  } catch (err) {
    console.warn('Error updateOrderStatusInSupabase:', err);
    return { success: false, error: err };
  }
}
