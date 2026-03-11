import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { cart } = await req.json();

    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: { cart },
    });

    return Response.json(profile);
  } catch (error) {
    console.error("Error syncing cart:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { cart: true },
    });

    return Response.json(profile?.cart || { items: [] });
  } catch (error) {
    console.error("Error fetching cart sync:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
