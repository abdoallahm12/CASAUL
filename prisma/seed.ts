import { db } from "@/lib/db";

async function main() {
  console.log("Seeding database...");

  // Clean existing data
  await db.product.deleteMany();
  await db.category.deleteMany();

  // Create categories
  const categories = await Promise.all([
    db.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Electronics",
        description: "Latest gadgets and tech devices",
      },
    }),
    db.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Fashion",
        description: "Trendy clothing and accessories",
      },
    }),
    db.category.create({
      data: {
        name: "Home & Kitchen",
        slug: "home-kitchen",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Home+%26+Kitchen",
        description: "Everything for your home",
      },
    }),
    db.category.create({
      data: {
        name: "Books",
        slug: "books",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Books",
        description: "Best sellers and new releases",
      },
    }),
    db.category.create({
      data: {
        name: "Sports & Outdoors",
        slug: "sports-outdoors",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Sports+%26+Outdoors",
        description: "Gear for every adventure",
      },
    }),
    db.category.create({
      data: {
        name: "Beauty & Personal Care",
        slug: "beauty-personal-care",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Beauty",
        description: "Skincare, makeup and more",
      },
    }),
    db.category.create({
      data: {
        name: "Toys & Games",
        slug: "toys-games",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Toys+%26+Games",
        description: "Fun for all ages",
      },
    }),
    db.category.create({
      data: {
        name: "Automotive",
        slug: "automotive",
        image: "https://placehold.co/600x400/f5f5f5/999?text=Automotive",
        description: "Car parts and accessories",
      },
    }),
  ]);

  const [electronics, fashion, homeKitchen, books, sportsOutdoors, beauty, toysGames, automotive] = categories;

  // Create products
  const products = [
    // Electronics (4 products)
    {
      name: "Wireless Noise-Cancelling Headphones",
      slug: "wireless-noise-cancelling-headphones",
      description: "Experience pure audio bliss with these premium wireless headphones. Active noise cancellation blocks out the world while 40-hour battery life keeps the music going. Perfect for commuters, remote workers, and audiophiles alike.",
      price: 249.99,
      originalPrice: 299.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Headphones"]),
      categoryId: electronics.id,
      stock: 85,
      rating: 4.7,
      reviewCount: 342,
      featured: true,
    },
    {
      name: '4K Ultra HD Smart TV 55"',
      slug: "4k-ultra-hd-smart-tv-55",
      description: "Stunning 4K HDR display with Dolby Vision brings cinema-quality visuals to your living room. Built-in smart platform gives instant access to all your favorite streaming apps. Slim bezel design looks elegant on any wall or stand.",
      price: 599.99,
      originalPrice: 749.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Smart+TV"]),
      categoryId: electronics.id,
      stock: 42,
      rating: 4.5,
      reviewCount: 218,
      featured: true,
    },
    {
      name: "Portable Bluetooth Speaker",
      slug: "portable-bluetooth-speaker",
      description: "Take the party anywhere with this rugged, waterproof Bluetooth speaker. Delivers 360-degree sound with deep bass despite its compact size. 12-hour battery life ensures the music never stops at your outdoor gatherings.",
      price: 79.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Speaker"]),
      categoryId: electronics.id,
      stock: 150,
      rating: 4.3,
      reviewCount: 156,
      featured: false,
    },

    // Fashion (3 products)
    {
      name: "Organic Cotton T-Shirt",
      slug: "organic-cotton-t-shirt",
      description: "Soft, breathable organic cotton tee that feels great and is kind to the planet. Pre-shrunk fabric maintains its fit wash after wash. Available in a range of earth-toned colors that pair with everything.",
      price: 34.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Cotton+Tee"]),
      categoryId: fashion.id,
      stock: 200,
      rating: 4.4,
      reviewCount: 89,
      featured: false,
    },
    {
      name: "Leather Crossbody Bag",
      slug: "leather-crossbody-bag",
      description: "Handcrafted from genuine full-grain leather, this crossbody bag combines timeless style with everyday functionality. Multiple interior pockets keep essentials organized while the adjustable strap ensures comfort all day long.",
      price: 129.99,
      originalPrice: 159.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Crossbody+Bag"]),
      categoryId: fashion.id,
      stock: 65,
      rating: 4.6,
      reviewCount: 203,
      featured: true,
    },
    {
      name: "Classic Aviator Sunglasses",
      slug: "classic-aviator-sunglasses",
      description: "Iconic aviator style with polarized lenses that reduce glare and protect your eyes. Lightweight metal frame with spring hinges for a comfortable, secure fit. UV400 protection keeps your eyes safe on the brightest days.",
      price: 59.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Aviator+Sunglasses"]),
      categoryId: fashion.id,
      stock: 120,
      rating: 4.2,
      reviewCount: 67,
      featured: false,
    },

    // Home & Kitchen (3 products)
    {
      name: "Stainless Steel Chef's Knife",
      slug: "stainless-steel-chefs-knife",
      description: "Professional-grade 8-inch chef's knife forged from high-carbon stainless steel. Ergonomic pakkawood handle provides a comfortable, slip-resistant grip during extended prep sessions. Precision-honed edge makes slicing, dicing, and chopping effortless.",
      price: 89.99,
      originalPrice: 119.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Chefs+Knife"]),
      categoryId: homeKitchen.id,
      stock: 95,
      rating: 4.8,
      reviewCount: 412,
      featured: true,
    },
    {
      name: "Ceramic Non-Stick Cookware Set",
      slug: "ceramic-non-stick-cookware-set",
      description: "Complete 10-piece cookware set with eco-friendly ceramic coating that releases food effortlessly. Oven-safe up to 450°F with riveted silicone handles for a cool, comfortable grip. Includes pots, pans, and lids for every cooking need.",
      price: 179.99,
      originalPrice: 229.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Cookware+Set"]),
      categoryId: homeKitchen.id,
      stock: 38,
      rating: 4.5,
      reviewCount: 276,
      featured: false,
    },
    {
      name: "Smart WiFi Air Purifier",
      slug: "smart-wifi-air-purifier",
      description: "HEPA H13 filter captures 99.97% of airborne particles including dust, pollen, and pet dander. Control settings and monitor air quality from your phone with the companion app. Whisper-quiet operation makes it perfect for bedrooms and offices.",
      price: 199.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Air+Purifier"]),
      categoryId: homeKitchen.id,
      stock: 72,
      rating: 4.4,
      reviewCount: 134,
      featured: false,
    },

    // Books (3 products)
    {
      name: "The Art of Productivity",
      slug: "the-art-of-productivity",
      description: "Master your time and achieve more with proven strategies from top performers. This bestselling guide covers everything from morning routines to deep work techniques. Transform your daily habits and unlock your full potential.",
      price: 18.99,
      originalPrice: 24.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Productivity+Book"]),
      categoryId: books.id,
      stock: 180,
      rating: 4.3,
      reviewCount: 445,
      featured: false,
    },
    {
      name: "World Atlas: A Visual Journey",
      slug: "world-atlas-a-visual-journey",
      description: "Explore every corner of the globe through stunning satellite imagery and detailed maps. Features cultural insights, geographical wonders, and fascinating facts about 195 countries. A beautiful coffee table book and educational resource in one.",
      price: 45.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=World+Atlas"]),
      categoryId: books.id,
      stock: 55,
      rating: 4.7,
      reviewCount: 92,
      featured: false,
    },
    {
      name: "Coding for Beginners",
      slug: "coding-for-beginners",
      description: "Start your programming journey with this approachable guide that assumes no prior experience. Learn Python through hands-on projects that build real-world skills step by step. Includes access to online exercises and a supportive community forum.",
      price: 29.99,
      originalPrice: 34.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Coding+Book"]),
      categoryId: books.id,
      stock: 130,
      rating: 4.5,
      reviewCount: 328,
      featured: false,
    },

    // Sports & Outdoors (3 products)
    {
      name: "Insulated Water Bottle 32oz",
      slug: "insulated-water-bottle-32oz",
      description: "Double-wall vacuum insulation keeps drinks cold for 24 hours or hot for 12 hours. Made from food-grade stainless steel that's BPA-free and won't retain flavors. Leak-proof lid and durable powder-coated finish stand up to daily adventures.",
      price: 34.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Water+Bottle"]),
      categoryId: sportsOutdoors.id,
      stock: 175,
      rating: 4.6,
      reviewCount: 389,
      featured: false,
    },
    {
      name: "Yoga Mat with Alignment Lines",
      slug: "yoga-mat-with-alignment-lines",
      description: "Extra-thick 6mm eco-friendly TPE yoga mat with body alignment system for proper positioning. Non-slip texture on both sides provides stability on any floor surface. Lightweight and includes a carrying strap for easy transport to the studio.",
      price: 49.99,
      originalPrice: 64.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Yoga+Mat"]),
      categoryId: sportsOutdoors.id,
      stock: 88,
      rating: 4.4,
      reviewCount: 167,
      featured: false,
    },
    {
      name: "Trail Running Shoes",
      slug: "trail-running-shoes",
      description: "Aggressive traction outsole grips loose dirt, mud, and rocky terrain with confidence. Responsive cushioning absorbs impact on long downhill stretches while maintaining ground feel. Breathable mesh upper keeps feet cool on warm trail days.",
      price: 119.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Trail+Shoes"]),
      categoryId: sportsOutdoors.id,
      stock: 56,
      rating: 4.5,
      reviewCount: 213,
      featured: true,
    },

    // Beauty & Personal Care (3 products)
    {
      name: "Vitamin C Brightening Serum",
      slug: "vitamin-c-brightening-serum",
      description: "Potent 20% Vitamin C serum with hyaluronic acid for brighter, more even-looking skin. Clinically proven to reduce dark spots and fine lines in just 4 weeks. Lightweight, fast-absorbing formula works beautifully under moisturizer and makeup.",
      price: 28.99,
      originalPrice: 39.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Vitamin+C+Serum"]),
      categoryId: beauty.id,
      stock: 140,
      rating: 4.6,
      reviewCount: 487,
      featured: true,
    },
    {
      name: "Organic Shea Butter Moisturizer",
      slug: "organic-shea-butter-moisturizer",
      description: "Deeply nourishing face and body moisturizer made with raw, unrefined shea butter. Rich in vitamins A and E to soothe dry, sensitive skin without clogging pores. Gentle enough for daily use and perfect for the whole family.",
      price: 22.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Shea+Moisturizer"]),
      categoryId: beauty.id,
      stock: 110,
      rating: 4.3,
      reviewCount: 198,
      featured: false,
    },
    {
      name: "Electric Facial Cleansing Brush",
      slug: "electric-facial-cleansing-brush",
      description: "Sonic vibration technology delivers a deep cleanse that removes 99.5% of dirt, oil, and makeup. Soft silicone bristles are hygienic, gentle on skin, and never need replacing. Waterproof design means you can use it in the shower without worry.",
      price: 45.99,
      originalPrice: 59.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Cleansing+Brush"]),
      categoryId: beauty.id,
      stock: 78,
      rating: 4.4,
      reviewCount: 156,
      featured: false,
    },

    // Toys & Games (3 products)
    {
      name: "Wooden Building Block Set",
      slug: "wooden-building-block-set",
      description: "100-piece natural wood building blocks in vibrant, non-toxic colors inspire creative play. Develops spatial awareness, fine motor skills, and imaginative thinking in children ages 3 and up. Smooth-sanded edges and durable construction ensure years of safe fun.",
      price: 39.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Building+Blocks"]),
      categoryId: toysGames.id,
      stock: 92,
      rating: 4.7,
      reviewCount: 234,
      featured: false,
    },
    {
      name: "Strategy Board Game Collection",
      slug: "strategy-board-game-collection",
      description: "Award-winning strategy game that's easy to learn but offers deep, replayable gameplay. Beautifully illustrated cards and premium wooden pieces make every session feel special. Perfect for game nights with 2-5 players, ages 10 and up.",
      price: 54.99,
      originalPrice: 69.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Board+Game"]),
      categoryId: toysGames.id,
      stock: 45,
      rating: 4.8,
      reviewCount: 312,
      featured: false,
    },
    {
      name: "Remote Control Racing Car",
      slug: "remote-control-racing-car",
      description: "High-speed RC car reaches up to 25 mph with responsive 2.4GHz remote control. Off-road rubber tires and independent suspension handle grass, gravel, and pavement with ease. Rechargeable battery provides 30 minutes of racing per charge.",
      price: 64.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=RC+Racing+Car"]),
      categoryId: toysGames.id,
      stock: 63,
      rating: 4.2,
      reviewCount: 87,
      featured: false,
    },

    // Automotive (3 products)
    {
      name: "Dash Camera with Night Vision",
      slug: "dash-camera-with-night-vision",
      description: "Full HD 1080p dash cam with wide-angle lens and enhanced night vision for clear footage 24/7. Loop recording and G-sensor automatically save footage of incidents. Easy suction-cup mount installs in seconds without any tools required.",
      price: 69.99,
      originalPrice: 89.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Dash+Camera"]),
      categoryId: automotive.id,
      stock: 105,
      rating: 4.3,
      reviewCount: 189,
      featured: false,
    },
    {
      name: "Portable Car Jump Starter",
      slug: "portable-car-jump-starter",
      description: "Compact lithium-ion jump starter packs enough power to start vehicles up to 6.0L gas or 3.0L diesel. Doubles as a USB power bank and emergency flashlight with SOS mode. Safety features include spark-proof clamps and reverse polarity protection.",
      price: 89.99,
      originalPrice: null,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Jump+Starter"]),
      categoryId: automotive.id,
      stock: 70,
      rating: 4.6,
      reviewCount: 276,
      featured: false,
    },
    {
      name: "Leather Car Seat Covers",
      slug: "leather-car-seat-covers",
      description: "Premium faux leather seat covers protect your seats while adding a luxurious look to any vehicle. Universal fit design with adjustable straps works on most cars, trucks, and SUVs. Easy to clean—just wipe spills away with a damp cloth.",
      price: 149.99,
      originalPrice: 189.99,
      images: JSON.stringify(["https://placehold.co/600x600/f5f5f5/999?text=Seat+Covers"]),
      categoryId: automotive.id,
      stock: 33,
      rating: 4.1,
      reviewCount: 98,
      featured: false,
    },
  ];

  for (const product of products) {
    await db.product.create({ data: product });
  }

  console.log(`Seeded ${categories.length} categories and ${products.length} products.`);
  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
