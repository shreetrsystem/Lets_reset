import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const products = [
  {
    id: "cranberry",
    name: "Cranberry",
    description: "Crisp, tart, and wildly refreshing.",
    image: "/cranberry.png",
    price: 4.99,
    stock: 100,
    nutrition: {
      calories: 35,
      sugar: "7g",
      cultures: "2 Billion CFUs",
      ingredients: "Filtered water, kombucha culture (yeast and bacteria cultures), organic black tea, organic cane sugar, organic cold-pressed cranberry juice."
    }
  },
  {
    id: "jamun",
    name: "Spiced Jamun",
    description: "Deep, earthy, with a familiar kick.",
    image: "/jamun.png",
    price: 4.99,
    stock: 100,
    nutrition: {
      calories: 40,
      sugar: "9g",
      cultures: "2 Billion CFUs",
      ingredients: "Filtered water, kombucha culture, organic green tea, organic cane sugar, organic jamun puree, organic cinnamon, organic clove."
    }
  },
  {
    id: "peach",
    name: "Coffee Peach",
    description: "An unexpected spark to start your day.",
    image: "/peach.png",
    price: 5.49,
    stock: 100,
    nutrition: {
      calories: 45,
      sugar: "11g",
      cultures: "2 Billion CFUs",
      ingredients: "Filtered water, kombucha culture, organic fair-trade coffee beans, organic cane sugar, organic cold-pressed peach juice."
    }
  },
]

async function main() {
  console.log('Start seeding...')
  for (const p of products) {
    const product = await prisma.product.upsert({
      where: { id: p.id },
      update: p,
      create: p,
    })
    console.log(`Upserted product: ${product.name}`)
  }
  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
