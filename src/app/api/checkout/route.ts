import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// POST /api/checkout - Create order from cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      sessionId,
      email,
      firstName,
      lastName,
      address,
      city,
      state,
      zipCode,
      country = 'US',
      phone = '',
      paymentId,
    } = body

    if (!sessionId || !email || !firstName || !lastName || !address || !city || !state || !zipCode) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get cart with items
    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    })

    if (!cart || cart.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty or not found' },
        { status: 400 }
      )
    }

    // Validate stock availability
    const outOfStockItems = cart.items.filter(
      (item) => item.quantity > item.product.stock
    )
    if (outOfStockItems.length > 0) {
      return NextResponse.json(
        {
          error: 'Some items are out of stock',
          outOfStockItems: outOfStockItems.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            requested: item.quantity,
            available: item.product.stock,
          })),
        },
        { status: 400 }
      )
    }

    // Calculate totals
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const tax = Math.round(subtotal * 0.08 * 100) / 100
    const shipping = subtotal >= 50 ? 0 : 9.99
    const total = Math.round((subtotal + tax + shipping) * 100) / 100

    // Create order with items
    const order = await db.order.create({
      data: {
        sessionId,
        email,
        firstName,
        lastName,
        address,
        city,
        state,
        zipCode,
        country,
        phone,
        paymentId,
        subtotal,
        tax,
        shipping,
        total,
        status: 'pending',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            productName: item.product.name,
            productImage: JSON.parse(item.product.images)[0] || '',
            price: item.product.price,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    // Clear cart items after order creation
    await db.cartItem.deleteMany({
      where: { cartId: cart.id },
    })

    // Decrement stock for each purchased item
    for (const item of cart.items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      })
    }

    return NextResponse.json({ order })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}
