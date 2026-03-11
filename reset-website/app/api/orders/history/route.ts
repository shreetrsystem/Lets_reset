import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: user.id,
      },
      include: {
        items: {
          include: {
            product: true,
          }
        }
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return Response.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
