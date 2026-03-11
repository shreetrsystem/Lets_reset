import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      include: {
        addresses: true,
        _count: {
          select: { orders: true }
        }
      }
    });

    if (!profile) {
      // Auto-create profile if missing
      const newProfile = await prisma.profile.create({
        data: {
          id: user.id,
          email: user.email!,
          fullName: user.user_metadata?.full_name || "",
        },
        include: {
          addresses: true,
          _count: {
            select: { orders: true }
          }
        }
      });
      return Response.json(newProfile);
    }

    return Response.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { firstName, lastName, displayName, phone } = await req.json();

    const profile = await prisma.profile.upsert({
      where: { id: user.id },
      update: { 
        firstName, 
        lastName, 
        displayName,
        phone,
        fullName: `${firstName} ${lastName}`.trim(),
      },
      create: {
        id: user.id,
        email: user.email!,
        firstName,
        lastName,
        displayName,
        phone,
        fullName: `${firstName} ${lastName}`.trim(),
      }
    });

    return Response.json(profile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
