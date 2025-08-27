import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Datos de rifas de ejemplo
const rifasData = [
  {
    nombre: "iPhone 15 Pro Max + AirPods Pro",
    descripcion: "¡Gana el último iPhone 15 Pro Max de 256GB en color Titanio Natural más unos AirPods Pro de segunda generación! El smartphone más avanzado de Apple con cámara profesional, chip A17 Pro y pantalla Super Retina XDR de 6.7 pulgadas.",
    precio_ticket: 25.00,
    total_tickets: 1000,
    fecha_inicio: new Date('2024-01-15T00:00:00'),
    fecha_fin: new Date('2024-02-15T23:59:59'),
    estado: 'activa',
    imagen_url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&h=600&fit=crop',
    premio_principal: "iPhone 15 Pro Max 256GB + AirPods Pro",
    segundo_premio: "iPad Air 10.9 pulgadas",
    tercer_premio: "Apple Watch Series 9",
    cuarto_premio: "AirPods 3ra Generación",
    categoria: "Tecnología",
    reglas: "• Debes ser mayor de 18 años\n• Solo residentes en Venezuela\n• Un ticket por persona\n• El sorteo se realizará en vivo por Instagram\n• El ganador tiene 48 horas para reclamar el premio"
  },
  {
    nombre: "PlayStation 5 + 3 Juegos AAA",
    descripcion: "¡La consola más deseada del momento! PlayStation 5 con lector de discos, 3 juegos AAA a elegir (Spider-Man 2, God of War Ragnarök, Horizon Forbidden West), control DualSense adicional y tarjeta PlayStation Store de $100.",
    precio_ticket: 20.00,
    total_tickets: 1500,
    fecha_inicio: new Date('2024-01-10T00:00:00'),
    fecha_fin: new Date('2024-02-28T23:59:59'),
    estado: 'activa',
    imagen_url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&h=600&fit=crop',
    premio_principal: "PlayStation 5 + 3 Juegos + Control Extra",
    segundo_premio: "Nintendo Switch OLED",
    tercer_premio: "Xbox Series S",
    cuarto_premio: "Auriculares Gaming SteelSeries",
    categoria: "Gaming",
    reglas: "• Debes ser mayor de 18 años\n• Solo residentes en Venezuela\n• Máximo 5 tickets por persona\n• Sorteo público en vivo\n• Entrega a domicilio incluida"
  },
  {
    nombre: "MacBook Air M2 + Accesorios",
    descripcion: "¡Perfecta para estudiantes y profesionales! MacBook Air con chip M2, 8GB RAM, 256GB SSD en color Midnight, más Magic Mouse, Magic Keyboard numérico, funda premium y stand ajustable.",
    precio_ticket: 30.00,
    total_tickets: 800,
    fecha_inicio: new Date('2024-01-20T00:00:00'),
    fecha_fin: new Date('2024-03-20T23:59:59'),
    estado: 'activa',
    imagen_url: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=600&fit=crop',
    premio_principal: "MacBook Air M2 + Kit Completo",
    segundo_premio: "iPad Pro 11 pulgadas",
    tercer_premio: "iPhone 14",
    cuarto_premio: "Apple TV 4K",
    categoria: "Tecnología",
    reglas: "• Debes ser mayor de 18 años\n• Solo residentes en Venezuela\n• Máximo 3 tickets por persona\n• Incluye garantía oficial Apple\n• Sorteo supervisado por notario"
  },
  {
    nombre: "Samsung Galaxy S24 Ultra + Galaxy Buds",
    descripcion: "¡El flagship de Samsung! Galaxy S24 Ultra de 512GB con S Pen incluido, cámara de 200MP, pantalla Dynamic AMOLED 2X de 6.8 pulgadas, más Galaxy Buds Pro y cargador inalámbrico rápido.",
    precio_ticket: 22.00,
    total_tickets: 1200,
    fecha_inicio: new Date('2024-01-25T00:00:00'),
    fecha_fin: new Date('2024-03-25T23:59:59'),
    estado: 'activa',
    imagen_url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&h=600&fit=crop',
    premio_principal: "Samsung Galaxy S24 Ultra 512GB + Accesorios",
    segundo_premio: "Samsung Galaxy Tab S9",
    tercer_premio: "Samsung Galaxy Watch 6",
    cuarto_premio: "Samsung Galaxy Buds Pro",
    categoria: "Tecnología",
    reglas: "• Debes ser mayor de 18 años\n• Solo residentes en Venezuela\n• Máximo 4 tickets por persona\n• Sorteo en vivo por YouTube\n• Garantía oficial Samsung incluida"
  },
  {
    nombre: "Tesla Model 3 2024 - ¡Auto Eléctrico!",
    descripcion: "¡El premio más grande de RifasPlus! Tesla Model 3 Standard Range Plus 2024, completamente eléctrico, con autopilot, pantalla táctil de 15 pulgadas, carga rápida y 0 emisiones. ¡Incluye seguro por 1 año!",
    precio_ticket: 50.00,
    total_tickets: 5000,
    fecha_inicio: new Date('2024-02-01T00:00:00'),
    fecha_fin: new Date('2024-06-01T23:59:59'),
    estado: 'activa',
    imagen_url: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&h=600&fit=crop',
    premio_principal: "Tesla Model 3 2024 + Seguro 1 año",
    segundo_premio: "Motocicleta Yamaha MT-07",
    tercer_premio: "Bicicleta Eléctrica Premium",
    cuarto_premio: "$5,000 USD en efectivo",
    categoria: "Vehículos",
    reglas: "• Debes ser mayor de 21 años\n• Licencia de conducir vigente\n• Solo residentes en Venezuela\n• Máximo 10 tickets por persona\n• Sorteo notariado y transmitido en vivo\n• Incluye trámites de transferencia"
  }
]

async function insertRifas() {
  try {
    console.log('🚀 Conectando a Supabase...')
    
    // Verificar conexión
    const { data: testData, error: testError } = await supabase
      .from('t_rifas')
      .select('count')
      .limit(1)
    
    if (testError) {
      console.error('❌ Error de conexión:', testError.message)
      return
    }
    
    console.log('✅ Conexión exitosa a Supabase')
    console.log('📝 Insertando rifas...')
    
    // Insertar rifas una por una para mejor control de errores
    for (let i = 0; i < rifasData.length; i++) {
      const rifa = rifasData[i]
      console.log(`📦 Insertando rifa ${i + 1}/${rifasData.length}: ${rifa.nombre}`)
      
      const { data, error } = await supabase
        .from('t_rifas')
        .insert([rifa])
        .select()
      
      if (error) {
        console.error(`❌ Error insertando rifa "${rifa.nombre}":`, error.message)
      } else {
        console.log(`✅ Rifa "${rifa.nombre}" insertada exitosamente`)
      }
    }
    
    console.log('🎉 ¡Proceso completado!')
    
    // Mostrar resumen
    const { data: totalRifas, error: countError } = await supabase
      .from('t_rifas')
      .select('id_rifa')
    
    if (!countError) {
      console.log(`📊 Total de rifas en la base de datos: ${totalRifas.length}`)
    }
    
  } catch (error) {
    console.error('💥 Error general:', error.message)
  }
}

// Ejecutar el script
insertRifas()
