import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { street1, apt, city, state, pin, isDefault } = await req.json();
    
    // Diagnostic check
    if (!(prisma as any).address && !(prisma as any).profile?.update?.({ data: { addresses: {} } })) {
       console.error("Prisma client check failed: 'address' or 'addresses' relation missing");
    }

    console.log("Saving address for user:", user.id, { street1, apt, city, state, pin, isDefault });

    // Use nested update on profile to ensure relation is handled correctly
    // and to bypass potential issues with direct address access if client is slightly out of sync
    const profile = await prisma.profile.update({
      where: { id: user.id },
      data: {
        addresses: {
          // If setting as default, unset others first in the same transaction
          ...(isDefault ? {
            updateMany: {
              where: { isDefault: true },
              data: { isDefault: false }
            }
          } : {}),
          create: {
            street1,
            apt,
            city,
            state,
            pin,
            isDefault: isDefault || false,
          }
        }
      },
      include: {
        addresses: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    const address = profile.addresses[0];
    return Response.json(address);
  } catch (error: any) {
    console.error("Error creating address:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await req.json();

    await prisma.address.delete({
      where: { 
        id,
        userId: user.id // Ensure user owns the address
      }
    });

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting address:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
