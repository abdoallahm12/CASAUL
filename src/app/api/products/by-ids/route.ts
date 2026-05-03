import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const idsParam = searchParams.get('ids') || ''

    if (!idsParam.trim()) {
      return NextResponse.json({ products: [] })
    }

    const ids = idsParam
      .split(',')
      .map((id) => id.trim())
      .filter((id) => id.length > 0)

    if (ids.length === 0) {
      return NextResponse.json({ products: [] })
    }

    const products = await db.product.findMany({
      where: {
        id: { in: ids },
      },
      include: { category: true },
    })

    const parsedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images),
    }))

    // Preserve the order of the requested IDs
    const productMap = new Map(parsedProducts.map((p) => [p.id, p]))
    const orderedProducts = ids
      .map((id) => productMap.get(id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined)

    return NextResponse.json({ products: orderedProducts })
  } catch (error) {
    console.error('Error fetching products by IDs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products by IDs' },
      { status: 500 }
    )
  }
}
