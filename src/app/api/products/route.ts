import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search') || ''
    const category = searchParams.get('category') || ''
    const sort = searchParams.get('sort') || 'newest'
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '12', 10)

    const where: Record<string, unknown> = {}

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ]
    }

    if (category) {
      where.category = { slug: category }
    }

    if (sort === 'featured') {
      where.featured = true
    }

    const orderBy: Record<string, string> = (() => {
      switch (sort) {
        case 'price_asc':
          return { price: 'asc' }
        case 'price_desc':
          return { price: 'desc' }
        case 'rating':
          return { rating: 'desc' }
        case 'newest':
        default:
          return { createdAt: 'desc' }
      }
    })()

    const total = await db.product.count({ where })
    const totalPages = Math.ceil(total / limit)
    const skip = (page - 1) * limit

    const products = await db.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip,
      take: limit,
    })

    const parsedProducts = products.map((product) => ({
      ...product,
      images: JSON.parse(product.images),
    }))

    return NextResponse.json({
      products: parsedProducts,
      total,
      page,
      totalPages,
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}
