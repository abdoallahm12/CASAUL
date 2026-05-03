import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const categories = await db.category.findMany({
      include: {
        _count: {
          select: { products: true },
        },
      },
      orderBy: { name: 'asc' },
    })

    const categoriesWithCount = categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      image: category.image,
      description: category.description,
      createdAt: category.createdAt,
      updatedAt: category.updatedAt,
      productCount: category._count.products,
    }))

    return NextResponse.json({ categories: categoriesWithCount })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
