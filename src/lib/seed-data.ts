'use server';

import { db } from '@/lib/db';
import { cafe, participant, guestphoto } from '@/lib/db/schema';

/**
 * Seed data for development and testing purposes
 * Run this to populate the database with sample data
 */
export async function seedDatabase() {
  console.log('🌱 Seeding database...');

  try {
    // Clear existing data
    await db.delete(guestphoto);
    await db.delete(participant);  
    await db.delete(cafe);

    // Insert sample cafes
    const sampleCafes = await db.insert(cafe).values([
      {
        name: '스타벅스 강남점',
        address: '서울특별시 강남구 테헤란로 142',
        value: 5000,
      },
      {
        name: '블루보틀 성수점',
        address: '서울특별시 성동구 연무장5가길 6',
        value: 6000,
      },
      {
        name: '커피빈 홍대점',
        address: '서울특별시 마포구 양화로 160',
        value: 4500,
      },
      {
        name: '투썸플레이스 신촌점',
        address: '서울특별시 서대문구 신촌로 83',
        value: 5500,
      },
      {
        name: '할리스커피 이대점',
        address: '서울특별시 서대문구 이화여대길 52',
        value: 4000,
      },
    ]).returning();

    console.log('✅ Created sample cafes:', sampleCafes.length);

    // Insert sample participants
    const sampleParticipants = await db.insert(participant).values([
      {
        name: '김민수',
        instagram: 'minsu_kim',
        cafeId: sampleCafes[0].id,
      },
      {
        name: '박지영',
        instagram: 'jiyoung_park',
        cafeId: sampleCafes[1].id,
      },
      {
        name: '이서준',
        instagram: 'seojun_lee',
        cafeId: sampleCafes[2].id,
      },
      {
        name: '최유진',
        instagram: 'yujin_choi',
        cafeId: sampleCafes[0].id,
      },
      {
        name: '정하늘',
        instagram: null, // Some participants might not have Instagram
        cafeId: sampleCafes[3].id,
      },
      {
        name: '윤서현',
        instagram: 'seohyun_yoon',
        cafeId: sampleCafes[4].id,
      },
    ]).returning();

    console.log('✅ Created sample participants:', sampleParticipants.length);

    // Insert sample guest photos (using placeholder images)
    const samplePhotos = await db.insert(guestphoto).values([
      {
        imageUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[0].id,
        adminApproval: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[1].id,
        adminApproval: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[2].id,
        adminApproval: false, // Pending approval
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1497515114629-f71d768fd07c?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[0].id,
        adminApproval: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[3].id,
        adminApproval: false, // Pending approval
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1511081692775-05d0f180a065?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[4].id,
        adminApproval: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[1].id,
        adminApproval: true,
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=800&fit=crop&crop=center',
        cafeId: sampleCafes[2].id,
        adminApproval: false, // Pending approval
      },
    ]).returning();

    console.log('✅ Created sample guest photos:', samplePhotos.length);

    console.log('🎉 Database seeding completed successfully!');
    console.log(`
📊 Summary:
- Cafes: ${sampleCafes.length}
- Participants: ${sampleParticipants.length}  
- Guest Photos: ${samplePhotos.length}
  - Approved: ${samplePhotos.filter(p => p.adminApproval).length}
  - Pending: ${samplePhotos.filter(p => !p.adminApproval).length}
    `);

    return {
      success: true,
      data: {
        cafes: sampleCafes.length,
        participants: sampleParticipants.length,
        guestPhotos: samplePhotos.length,
      }
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Clear all data from the database
 */
export async function clearDatabase() {
  console.log('🧹 Clearing database...');
  
  try {
    await db.delete(guestphoto);
    await db.delete(participant);
    await db.delete(cafe);
    
    console.log('✅ Database cleared successfully!');
    return { success: true };
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}