import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json(
        { error: 'productId query parameter is required' },
        { status: 400 }
      )
    }

    const reviews = await db.review.findMany({
      where: { productId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ reviews })
  } catch (error) {
    console.error('Error fetching reviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { productId, rating, title, comment, authorName } = body

    if (!productId || !rating) {
      return NextResponse.json(
        { error: 'productId and rating are required' },
        { status: 400 }
      )
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Rating must be between 1 and 5' },
        { status: 400 }
      )
    }

    const review = await db.review.create({
      data: {
        productId,
        rating: parseInt(String(rating), 10),
        title: title || '',
        comment: comment || '',
        authorName: authorName || 'Anonymous',
      },
    })

    // Update product rating and reviewCount
    const allReviews = await db.review.findMany({
      where: { productId },
      select: { rating: true },
    })

    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0)
    const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0

    await db.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(avgRating * 10) / 10,
        reviewCount: allReviews.length,
      },
    })

    return NextResponse.json({ review }, { status: 201 })
  } catch (error) {
    console.error('Error creating review:', error)
    return NextResponse.json(
      { error: 'Failed to create review' },
      { status: 500 }
    )
  }
}
