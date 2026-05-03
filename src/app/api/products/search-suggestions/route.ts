import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q') || ''

    if (q.length < 2) {
      return NextResponse.json({ suggestions: [] })
    }

    const products = await db.product.findMany({
      where: {
        name: { contains: q },
      },
      include: { category: true },
      orderBy: { rating: 'desc' },
      take: 6,
    })

    const suggestions = products.map((product) => {
      let images: string[] = []
      try {
        images = JSON.parse(product.images)
      } catch {
        images = []
      }

      return {
        id: product.id,
        name: product.name,
        price: product.price,
        image: images[0] || '',
        category: product.category.name,
      }
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Error fetching search suggestions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
