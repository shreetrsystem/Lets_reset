import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items, address, total, orderNotes, discountCode } = body;

    // Create order in DB via Prisma
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        address, // Stringified address or specific format
        orderNotes,
        discountCode,
        status: "paid", // For demo simulator, we assume payment success
        items: {
          create: items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      },
      include: {
        items: true,
      }
    });

    return Response.json(order);
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
