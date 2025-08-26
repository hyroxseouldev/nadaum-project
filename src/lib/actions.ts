"use server";

import { db } from "@/lib/db";
import { cafe, guestphoto, participant } from "@/lib/db/schema";
import { eq, desc, asc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import type { Cafe, Guestphoto, Participant } from "@/lib/db/schema";

// Guest Photo Actions
export async function getGuestPhotos(page = 0, cafeId?: string, limit = 20) {
  try {
    let query = db
      .select({
        id: guestphoto.id,
        imageUrl: guestphoto.imageUrl,
        cafeId: guestphoto.cafeId,
        createdAt: guestphoto.createdAt,
        adminApproval: guestphoto.adminApproval,
        cafe: {
          id: cafe.id,
          name: cafe.name,
          address: cafe.address,
        },
      })
      .from(guestphoto)
      .leftJoin(cafe, eq(guestphoto.cafeId, cafe.id))
      .where(eq(guestphoto.adminApproval, true))
      .orderBy(desc(guestphoto.createdAt))
      .limit(limit)
      .offset(page * limit);

    if (cafeId) {
      query = db
        .select({
          id: guestphoto.id,
          imageUrl: guestphoto.imageUrl,
          cafeId: guestphoto.cafeId,
          createdAt: guestphoto.createdAt,
          adminApproval: guestphoto.adminApproval,
          cafe: {
            id: cafe.id,
            name: cafe.name,
            address: cafe.address,
          },
        })
        .from(guestphoto)
        .leftJoin(cafe, eq(guestphoto.cafeId, cafe.id))
        .where(
          and(eq(guestphoto.adminApproval, true), eq(guestphoto.cafeId, cafeId))
        )
        .orderBy(desc(guestphoto.createdAt))
        .limit(limit)
        .offset(page * limit);
    }

    const photos = await query;
    const hasMore = photos.length === limit;

    return {
      data: photos,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    };
  } catch (error) {
    console.error("Error fetching guest photos:", error);
    throw new Error("게스트 포토를 가져오는 중 오류가 발생했습니다.");
  }
}

export async function createGuestPhoto(
  imageUrl: string,
  cafeId: string,
  _metadata?: object
) {
  try {
    const [newPhoto] = await db
      .insert(guestphoto)
      .values({
        imageUrl,
        cafeId,
        adminApproval: true, // 관리자 승인 필요
      })
      .returning();

    revalidatePath("/");
    revalidatePath("/admin");

    return newPhoto;
  } catch (error) {
    console.error("Error creating guest photo:", error);
    throw new Error("게스트 포토 생성 중 오류가 발생했습니다.");
  }
}

export async function updateGuestPhoto(id: string, data: Partial<Guestphoto>) {
  try {
    const [updatedPhoto] = await db
      .update(guestphoto)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(guestphoto.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/admin");

    return updatedPhoto;
  } catch (error) {
    console.error("Error updating guest photo:", error);
    throw new Error("게스트 포토 수정 중 오류가 발생했습니다.");
  }
}

export async function deleteGuestPhoto(id: string) {
  try {
    await db.delete(guestphoto).where(eq(guestphoto.id, id));

    revalidatePath("/");
    revalidatePath("/admin");

    return true;
  } catch (error) {
    console.error("Error deleting guest photo:", error);
    throw new Error("게스트 포토 삭제 중 오류가 발생했습니다.");
  }
}

// Cafe Actions
export async function getCafes(): Promise<Cafe[]> {
  try {
    const cafes = await db.select().from(cafe).orderBy(asc(cafe.name));

    return cafes;
  } catch (error) {
    console.error("Error fetching cafes:", error);
    throw new Error("카페 목록을 가져오는 중 오류가 발생했습니다.");
  }
}

export async function createCafe(
  name: string,
  address: string,
  value?: number
) {
  try {
    const [newCafe] = await db
      .insert(cafe)
      .values({
        name,
        address,
        value,
      })
      .returning();

    revalidatePath("/admin");

    return newCafe;
  } catch (error) {
    console.error("Error creating cafe:", error);
    throw new Error("카페 생성 중 오류가 발생했습니다.");
  }
}

// Participant Actions
export async function getParticipants(search?: string): Promise<Participant[]> {
  try {
    const query = db
      .select({
        id: participant.id,
        name: participant.name,
        instagram: participant.instagram,
        cafeId: participant.cafeId,
        createdAt: participant.createdAt,
        updatedAt: participant.updatedAt,
        cafe: {
          id: cafe.id,
          name: cafe.name,
          address: cafe.address,
        },
      })
      .from(participant)
      .leftJoin(cafe, eq(participant.cafeId, cafe.id))
      .orderBy(asc(participant.name));

    const participants = await query;

    // 클라이언트 사이드에서 검색 필터링 (search 파라미터가 있을 경우)
    if (search) {
      return participants.filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.instagram?.toLowerCase().includes(search.toLowerCase()) ||
          p.cafe?.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    return participants;
  } catch (error) {
    console.error("Error fetching participants:", error);
    throw new Error("참가자 목록을 가져오는 중 오류가 발생했습니다.");
  }
}

export async function createParticipant(
  name: string,
  instagram: string,
  cafeId: string
) {
  try {
    const [newParticipant] = await db
      .insert(participant)
      .values({
        name,
        instagram,
        cafeId,
      })
      .returning();

    revalidatePath("/contact");
    revalidatePath("/admin");

    return newParticipant;
  } catch (error) {
    console.error("Error creating participant:", error);
    throw new Error("참가자 생성 중 오류가 발생했습니다.");
  }
}

// Admin-specific actions
export async function getAllGuestPhotos(page = 0, limit = 20) {
  try {
    const photos = await db
      .select({
        id: guestphoto.id,
        imageUrl: guestphoto.imageUrl,
        cafeId: guestphoto.cafeId,
        createdAt: guestphoto.createdAt,
        adminApproval: guestphoto.adminApproval,
        cafe: {
          id: cafe.id,
          name: cafe.name,
          address: cafe.address,
        },
      })
      .from(guestphoto)
      .leftJoin(cafe, eq(guestphoto.cafeId, cafe.id))
      .orderBy(desc(guestphoto.createdAt))
      .limit(limit)
      .offset(page * limit);

    const hasMore = photos.length === limit;

    return {
      data: photos,
      hasMore,
      nextPage: hasMore ? page + 1 : null,
    };
  } catch (error) {
    console.error("Error fetching all guest photos:", error);
    throw new Error("관리자 게스트 포토를 가져오는 중 오류가 발생했습니다.");
  }
}

export async function approveGuestPhoto(id: string) {
  try {
    const [approvedPhoto] = await db
      .update(guestphoto)
      .set({ adminApproval: true, updatedAt: new Date() })
      .where(eq(guestphoto.id, id))
      .returning();

    revalidatePath("/");
    revalidatePath("/admin");

    return approvedPhoto;
  } catch (error) {
    console.error("Error approving guest photo:", error);
    throw new Error("게스트 포토 승인 중 오류가 발생했습니다.");
  }
}
