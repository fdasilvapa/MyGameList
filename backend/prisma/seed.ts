import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Iniciando o Seed do Banco de Dados...')

  // --- 1. PLATAFORMAS ---
  const platforms = [
    { name: 'PC (Steam/Epic)', slug: 'pc' },
    { name: 'PlayStation 5', slug: 'ps5' },
    { name: 'PlayStation 4', slug: 'ps4' },
    { name: 'Xbox Series X|S', slug: 'xbox-series' },
    { name: 'Nintendo Switch', slug: 'switch' },
  ]

  console.log('🎮 Criando Plataformas...')
  
  for (const platform of platforms) {
    // 1. Verifica se já existe pelo slug
    const existingPlatform = await prisma.platform.findFirst({
      where: { slug: platform.slug }
    })

    // 2. Se não existir, cria
    if (!existingPlatform) {
      await prisma.platform.create({
        data: platform
      })
      console.log(`   + Plataforma criada: ${platform.name}`)
    } else {
      console.log(`   . Plataforma já existe: ${platform.name}`)
    }
  }

  // --- 2. JOGOS ---
  const games = [
    {
      title: 'The Witcher 3: Wild Hunt',
      slug: 'the-witcher-3',
      releaseYear: 2015,
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co1wyy.jpg',
      description: 'Geralt de Rívia em busca de Ciri.'
    },
    {
      title: 'Elden Ring',
      slug: 'elden-ring',
      releaseYear: 2022,
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co4jni.jpg',
      description: 'Oceano de lágrimas e dificuldade.'
    },
    {
      title: 'Hollow Knight',
      slug: 'hollow-knight',
      releaseYear: 2017,
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co37bs.jpg',
      description: 'Insetos, metroidvania e arte linda.'
    },
    {
      title: 'Cyberpunk 2077',
      slug: 'cyberpunk-2077',
      releaseYear: 2020,
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/co848y.jpg',
      description: 'Acorde samurai, temos uma cidade para queimar.'
    },
    {
      title: 'Stardew Valley',
      slug: 'stardew-valley',
      releaseYear: 2016,
      coverUrl: 'https://images.igdb.com/igdb/image/upload/t_cover_big/xpmm7540tz2m69l3033.jpg',
      description: 'Plantar nabos e relaxar.'
    }
  ]

  console.log('💿 Criando Jogos...')
  
  for (const game of games) {
    await prisma.game.upsert({
      where: { externalId: game.slug }, 
      update: {}, 
      create: {
        title: game.title,
        slug: game.slug,
        externalId: game.slug, 
        releaseYear: game.releaseYear,
        coverUrl: game.coverUrl,
        // description: game.description 
      }
    })
  }

  console.log('✅ Seed concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
