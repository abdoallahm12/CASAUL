export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description: string;
  images: { front: string };
  sizes: string[];
  colors: ProductColor[];
  materials: string[];
  care: string[];
  madeIn: string;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  products: string[];
  totalPrice: number;
  discount: number;
  image: string;
}

export interface SiteSettings {
  phone: string;
  address: string;
  email: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCtaText: string;
}

export const defaultProducts: Product[] = [
  {
    id: "shirt_001",
    name: "Classic Oxford Shirt",
    category: "shirts",
    price: 245,
    currency: "EUR",
    description: "Crafted from premium Egyptian cotton, this Oxford shirt features mother-of-pearl buttons and a timeless fit that embodies refined elegance. The long-staple cotton ensures exceptional softness and durability, while the classic button-down collar adds a touch of understated sophistication.",
    images: { front: "/images/products/shirt-oxford-white.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "White", hex: "#FDFBF7" },
      { name: "Navy", hex: "#1a2332" },
      { name: "Sky Blue", hex: "#87CEEB" },
    ],
    materials: ["Cotton 100%"],
    care: ["Dry clean recommended", "Iron medium heat"],
    madeIn: "Italy",
  },
  {
    id: "shirt_002",
    name: "Linen Camp Collar Shirt",
    category: "shirts",
    price: 195,
    currency: "EUR",
    description: "Breathable Belgian linen shirt with a relaxed camp collar, perfect for warm-weather sophistication. The natural linen fabric develops a beautiful patina over time, making each shirt uniquely yours. Features genuine horn buttons and French seams throughout.",
    images: { front: "/images/products/shirt-linen-navy.png" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Navy", hex: "#1a2332" },
      { name: "Sand", hex: "#C2B280" },
      { name: "White", hex: "#FDFBF7" },
    ],
    materials: ["Linen 100%"],
    care: ["Machine wash cold", "Hang dry", "Iron while damp"],
    madeIn: "Portugal",
  },
  {
    id: "trouser_001",
    name: "Tailored Chino Trousers",
    category: "trousers",
    price: 285,
    currency: "EUR",
    description: "Impeccably tailored chinos in premium stretch cotton, featuring a flat front and a silhouette that transitions effortlessly from boardroom to weekend. The fabric is sourced from a heritage mill in Lancashire and treated with a subtle peached finish for exceptional comfort.",
    images: { front: "/images/products/trouser-chinos-beige.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Beige", hex: "#C2B280" },
      { name: "Navy", hex: "#1a2332" },
      { name: "Olive", hex: "#6B8E23" },
    ],
    materials: ["Cotton 97%", "Elastane 3%"],
    care: ["Machine wash cold", "Iron medium heat"],
    madeIn: "England",
  },
  {
    id: "trouser_002",
    name: "Wool Dress Trousers",
    category: "trousers",
    price: 365,
    currency: "EUR",
    description: "Luxurious Super 120s wool trousers with a natural taper and half-lined construction for an impeccable drape. These trousers feature a extended waistband closure and side adjusters for a refined, belt-free aesthetic that speaks to traditional tailoring excellence.",
    images: { front: "/images/products/trouser-wool-grey.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Charcoal", hex: "#3D3D3D" },
      { name: "Navy", hex: "#1a2332" },
    ],
    materials: ["Wool 100%"],
    care: ["Dry clean only", "Steam press"],
    madeIn: "Italy",
  },
  {
    id: "shoes_001",
    name: "Penny Loafers",
    category: "shoes",
    price: 395,
    currency: "EUR",
    description: "Handcrafted Italian penny loafers in full-grain calfskin with a Goodyear welt construction. These shoes represent the pinnacle of casual elegance, built on a classic last that has been refined over generations. The hand-burnished finish ensures each pair is uniquely distinguished.",
    images: { front: "/images/products/shoes-loafers-brown.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cognac", hex: "#8B4513" },
      { name: "Navy", hex: "#1a2332" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    materials: ["Calfskin leather", "Leather sole"],
    care: ["Polish regularly", "Use shoe trees", "Rotate wear"],
    madeIn: "Italy",
  },
  {
    id: "shoes_002",
    name: "Oxford Cap-Toe Shoes",
    category: "shoes",
    price: 445,
    currency: "EUR",
    description: "The quintessential Oxford shoe, hand-lasted and finished with a mirror-polished cap toe. Crafted from the finest box calf leather on a sleek, elongated last. The Blake stitch construction ensures a refined profile that belies its robust construction and years of wear ahead.",
    images: { front: "/images/products/shoes-oxford-black.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Black", hex: "#1a1a1a" },
      { name: "Dark Brown", hex: "#3E2723" },
    ],
    materials: ["Box calf leather", "Leather sole", "Cork midsole"],
    care: ["Polish with cream", "Use shoe trees", "Rest between wears"],
    madeIn: "England",
  },
  {
    id: "blazer_001",
    name: "Navy Wool Blazer",
    category: "shirts",
    price: 595,
    currency: "EUR",
    description: "An impeccably constructed navy blazer in Italian Super 110s wool, featuring patch pockets and a soft shoulder that captures the essence of continental elegance. The half-canvas construction provides beautiful roll to the lapel while ensuring the jacket moves naturally with the wearer.",
    images: { front: "/images/products/blazer-navy.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Navy", hex: "#1a2332" },
      { name: "Charcoal", hex: "#3D3D3D" },
    ],
    materials: ["Wool 100%", "Bemberg lining"],
    care: ["Dry clean only", "Steam press", "Hang on wooden hanger"],
    madeIn: "Italy",
  },
  {
    id: "accessory_001",
    name: "Leather Belt & Watch Set",
    category: "accessories",
    price: 320,
    currency: "EUR",
    description: "A curated set featuring a hand-stitched cognac leather belt with a solid brass buckle, paired with a Swiss-made automatic dress watch on a matching strap. The belt is cut from a single piece of full-grain leather, while the watch features a sapphire crystal and 40-hour power reserve.",
    images: { front: "/images/products/accessory-belt-watch.png" },
    sizes: ["S", "M", "L", "XL"],
    colors: [
      { name: "Cognac", hex: "#8B4513" },
      { name: "Black", hex: "#1a1a1a" },
    ],
    materials: ["Full-grain leather", "Brass hardware", "Swiss movement"],
    care: ["Leather conditioner monthly", "Polish hardware"],
    madeIn: "Switzerland",
  },
  {
    id: "shirt_003",
    name: "Silk Polo Shirt",
    category: "shirts",
    price: 275,
    currency: "EUR",
    description: "Luxurious silk-cashmere blend polo with a refined knit structure that maintains its shape through years of wear. The natural luster of the silk fiber provides a subtle sheen that catches light beautifully, while the cashmere adds an impossibly soft hand feel that must be experienced.",
    images: { front: "/images/products/polo-silk-cream.png" },
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: [
      { name: "Cream", hex: "#F5F3EE" },
      { name: "Navy", hex: "#1a2332" },
      { name: "Forest", hex: "#2C4A3E" },
    ],
    materials: ["Silk 70%", "Cashmere 30%"],
    care: ["Dry clean recommended", "Store folded"],
    madeIn: "Scotland",
  },
];

export const defaultCollections: Collection[] = [
  {
    id: "weekend_001",
    name: "The Weekend Gentleman",
    description:
      "A carefully curated ensemble for the man who values understated elegance on his days of leisure. Each piece seamlessly transitions from a morning stroll to an afternoon at the club.",
    products: ["shirt_002", "trouser_001", "shoes_001"],
    totalPrice: 875,
    discount: 0.1,
    image: "/images/collections/weekend-gentleman.png",
  },
  {
    id: "office_001",
    name: "The Office Classic",
    description:
      "Command the boardroom with timeless sophistication. This collection pairs impeccable tailoring with luxurious fabrics for the discerning professional who understands that true power dresses quietly.",
    products: ["shirt_001", "trouser_002", "shoes_002", "blazer_001"],
    totalPrice: 1650,
    discount: 0.12,
    image: "/images/collections/office-classic.png",
  },
  {
    id: "summer_001",
    name: "Summer Riviera",
    description:
      "Inspired by the effortless elegance of the Côte d'Azur, this collection captures the essence of Mediterranean sophistication with breathable linens and sun-kissed hues.",
    products: ["shirt_002", "trouser_001", "shoes_001", "shirt_003"],
    totalPrice: 1070,
    discount: 0.08,
    image: "/images/collections/summer-riviera.png",
  },
  {
    id: "autumn_001",
    name: "Autumn Gentleman",
    description:
      "As the leaves turn, so does the wardrobe. Rich textures and warm tones define this collection, perfect for crisp mornings and fireside evenings alike.",
    products: ["blazer_001", "trouser_002", "shirt_001", "accessory_001"],
    totalPrice: 1625,
    discount: 0.1,
    image: "/images/collections/autumn-gentleman.png",
  },
];

export const defaultSiteSettings: SiteSettings = {
  phone: "+44 20 7946 0958",
  address: "23 Bond Street, Mayfair, London W1S 4ET",
  email: "concierge@casual.com",
  logo: "CASUAL",
  primaryColor: "#B8956A",
  secondaryColor: "#1a2332",
  accentColor: "#6B2C3E",
  heroTitle: "Timeless Elegance,",
  heroSubtitle: "Crafted for the Discerning",
  heroCtaText: "Explore Collection",
};
