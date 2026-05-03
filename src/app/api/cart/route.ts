import { db } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'

// Helper to parse product images in cart items
function parseCartItemImages(cart: Record<string, unknown>) {
  if (!cart) return cart
  const items = (cart.items as Record<string, unknown>[]) || []
  return {
    ...cart,
    items: items.map((item) => ({
      ...item,
      product: item.product
        ? {
            ...(item.product as Record<string, unknown>),
            images: JSON.parse(
              (item.product as Record<string, unknown>).images as string
            ),
          }
        : item.product,
    })),
  }
}

// GET /api/cart - Get cart by sessionId
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const sessionId = searchParams.get('sessionId')

    if (!sessionId) {
      return NextResponse.json(
        { error: 'sessionId is required' },
        { status: 400 }
      )
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    if (!cart) {
      return NextResponse.json({ cart: null })
    }

    const parsedCart = parseCartItemImages(
      cart as unknown as Record<string, unknown>
    )

    return NextResponse.json({ cart: parsedCart })
  } catch (error) {
    console.error('Error fetching cart:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cart' },
      { status: 500 }
    )
  }
}

// POST /api/cart - Add item to cart
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, productId, quantity = 1 } = body

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'sessionId and productId are required' },
        { status: 400 }
      )
    }

    // Verify product exists
    const product = await db.product.findUnique({ where: { id: productId } })
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    // Get or create cart
    let cart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
        },
      },
    })

    if (!cart) {
      cart = await db.cart.create({
        data: { sessionId },
        include: {
          items: {
            include: {
              product: {
                include: { category: true },
              },
            },
          },
        },
      })
    }

    // Check if item already exists in cart
    const existingItem = cart.items.find(
      (item) => item.productId === productId
    )

    if (existingItem) {
      // Update quantity
      await db.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: existingItem.quantity + quantity },
      })
    } else {
      // Add new item
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          quantity,
        },
      })
    }

    // Fetch updated cart
    const updatedCart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    const parsedCart = parseCartItemImages(
      updatedCart as unknown as Record<string, unknown>
    )

    return NextResponse.json({ cart: parsedCart })
  } catch (error) {
    console.error('Error adding to cart:', error)
    return NextResponse.json(
      { error: 'Failed to add item to cart' },
      { status: 500 }
    )
  }
}

// PUT /api/cart - Update cart item quantity
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, productId, quantity } = body

    if (!sessionId || !productId || quantity === undefined) {
      return NextResponse.json(
        { error: 'sessionId, productId, and quantity are required' },
        { status: 400 }
      )
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
    })

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    if (quantity <= 0) {
      // Remove item if quantity is 0
      await db.cartItem.deleteMany({
        where: { cartId: cart.id, productId },
      })
    } else {
      // Update quantity
      const cartItem = await db.cartItem.findFirst({
        where: { cartId: cart.id, productId },
      })

      if (!cartItem) {
        return NextResponse.json(
          { error: 'Cart item not found' },
          { status: 404 }
        )
      }

      await db.cartItem.update({
        where: { id: cartItem.id },
        data: { quantity },
      })
    }

    // Fetch updated cart
    const updatedCart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    const parsedCart = parseCartItemImages(
      updatedCart as unknown as Record<string, unknown>
    )

    return NextResponse.json({ cart: parsedCart })
  } catch (error) {
    console.error('Error updating cart item:', error)
    return NextResponse.json(
      { error: 'Failed to update cart item' },
      { status: 500 }
    )
  }
}

// DELETE /api/cart - Remove cart item
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json()
    const { sessionId, productId } = body

    if (!sessionId || !productId) {
      return NextResponse.json(
        { error: 'sessionId and productId are required' },
        { status: 400 }
      )
    }

    const cart = await db.cart.findUnique({
      where: { sessionId },
    })

    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 })
    }

    await db.cartItem.deleteMany({
      where: { cartId: cart.id, productId },
    })

    // Fetch updated cart
    const updatedCart = await db.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: {
            product: {
              include: { category: true },
            },
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    })

    const parsedCart = parseCartItemImages(
      updatedCart as unknown as Record<string, unknown>
    )

    return NextResponse.json({ cart: parsedCart })
  } catch (error) {
    console.error('Error removing cart item:', error)
    return NextResponse.json(
      { error: 'Failed to remove cart item' },
      { status: 500 }
    )
  }
}
