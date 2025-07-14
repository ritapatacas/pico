import { supabase } from '@/lib/supabaseClient'
import type { Product } from '@/lib/types'

// Legacy product data from JSON file
export interface LegacyProduct {
  key: string
  name: string
  mainImage: string
  backgroundImage: string
  embaladoOptions: Array<{
    size: string
    price: number
    kgPrice: number
  }>
  precoGranelPorKg: number
  packagedImage: string
  bulkImage: string
  detailsContent: {
    varieties: string
    location: string
    productionMode: string
    harvestSeason: string
  }
  pricesContent: {
    packaged: Array<{
      size: string
      price: number
    }>
    bulk: number
  }
}

/**
 * Get all active products from database
 */
export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .order('name')

  if (error) {
    throw error
  }

  return data || []
}

/**
 * Get product by key
 */
export async function getProductByKey(key: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('key', key)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw error
  }

  return data
}

/**
 * Get product ID by product key
 */
export async function getProductIdByKey(productKey: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('products')
    .select('id')
    .eq('key', productKey)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw error
  }

  return data?.id || null
}

/**
 * Get multiple product IDs by product keys
 */
export async function getProductIdsByKeys(productKeys: string[]): Promise<Record<string, string>> {
  if (productKeys.length === 0) return {}

  console.log('Looking for product keys:', productKeys);

  const { data, error } = await supabase
    .from('products')
    .select('id, key')
    .in('key', productKeys)
    .eq('is_active', true)

  if (error) {
    console.error('Error fetching product IDs:', error);
    throw error
  }

  console.log('Products found in database:', data);

  const result: Record<string, string> = {}
  data?.forEach(product => {
    result[product.key] = product.id
  })

  console.log('Product ID mapping:', result);
  return result
}

/**
 * Get product by ID
 */
export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Not found
    }
    throw error
  }

  return data
}

/**
 * Create a new product
 */
export async function createProduct(productData: {
  key: string
  name: string
  main_image?: string
  background_image?: string
  weight: number
  price: number
}): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .insert([{
      ...productData,
      is_active: true,
    }])
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Update a product
 */
export async function updateProduct(
  id: string,
  updates: Partial<Product>
): Promise<Product> {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}

/**
 * Delete a product (soft delete by setting is_active to false)
 */
export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase
    .from('products')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    throw error
  }
}

/**
 * Migrate legacy product data to database
 * This function can be used to populate the products table from the JSON file
 */
export async function migrateLegacyProducts(legacyProducts: LegacyProduct[]): Promise<void> {
  for (const legacyProduct of legacyProducts) {
    // Create base product
    const baseProduct = await createProduct({
      key: `${legacyProduct.key}_125`,
      name: `${legacyProduct.name} 125g`,
      main_image: legacyProduct.mainImage,
      background_image: legacyProduct.backgroundImage,
      weight: 0.125,
      price: legacyProduct.embaladoOptions.find(opt => opt.size === '125g')?.price || 0,
    })

    // Create other size variants
    for (const option of legacyProduct.embaladoOptions) {
      if (option.size === '125g') continue // Already created

      const weight = parseFloat(option.size.replace('g', '')) / 1000 // Convert to kg
      await createProduct({
        key: `${legacyProduct.key}_${option.size.replace('g', '')}`,
        name: `${legacyProduct.name} ${option.size}`,
        main_image: legacyProduct.mainImage,
        background_image: legacyProduct.backgroundImage,
        weight,
        price: option.price,
      })
    }

    // Create bulk product (1kg)
    await createProduct({
      key: `${legacyProduct.key}_1000`,
      name: `${legacyProduct.name} Granel 1kg`,
      main_image: legacyProduct.bulkImage,
      background_image: legacyProduct.bulkImage,
      weight: 1.0,
      price: legacyProduct.precoGranelPorKg,
    })
  }
} 