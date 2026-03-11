import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    // Simple admin check: Check if email is from a specific domain or user ID
    // In production, you'd use a 'role' column in the Profile table.
    const isAdmin = user?.email?.endsWith("@letsreset.com") || user?.email === "admin@example.com";

    if (!isAdmin) {
      return new Response("Unauthorized", { status: 401 });
    }

    const [orders, products, profiles] = await Promise.all([
       prisma.order.findMany({ include: { profile: true }, orderBy: { createdAt: 'desc' } }),
       prisma.product.findMany(),
       prisma.profile.findMany({ include: { _count: { select: { orders: true } } } }),
    ]);

    return Response.json({ orders, products, profiles });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
