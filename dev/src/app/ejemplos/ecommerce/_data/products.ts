export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  description: string;
  specs: { label: string; value: string }[];
}

export const CATEGORIES = ["Audio", "Mochilas", "Calzado", "Relojes", "Hogar"] as const;

export const PRODUCTS: Product[] = [
  {
    id: "auriculares-aura",
    name: "Auriculares inalámbricos Aura",
    category: "Audio",
    price: 89,
    rating: 4.6,
    stock: 14,
    description:
      "Auriculares over-ear con cancelación de ruido activa y 30 horas de batería. Ideales para viajes largos y llamadas.",
    specs: [
      { label: "Autonomía", value: "30 h" },
      { label: "Cancelación de ruido", value: "Activa" },
      { label: "Conectividad", value: "Bluetooth 5.3" },
      { label: "Peso", value: "245 g" },
    ],
  },
  {
    id: "parlante-boom-mini",
    name: "Parlante portátil Boom Mini",
    category: "Audio",
    price: 59,
    rating: 4.3,
    stock: 22,
    description:
      "Parlante resistente al agua (IPX7) con graves potenciados y 12 horas de reproducción continua.",
    specs: [
      { label: "Resistencia", value: "IPX7" },
      { label: "Autonomía", value: "12 h" },
      { label: "Potencia", value: "20 W" },
      { label: "Conectividad", value: "Bluetooth 5.1" },
    ],
  },
  {
    id: "mochila-voyager",
    name: "Mochila urbana Voyager 20L",
    category: "Mochilas",
    price: 74,
    rating: 4.7,
    stock: 8,
    description:
      "Mochila para notebook de hasta 15\", tela impermeable y compartimento acolchado. Pensada para el día a día.",
    specs: [
      { label: "Capacidad", value: "20 L" },
      { label: "Compartimento notebook", value: "Hasta 15\"" },
      { label: "Material", value: "Poliéster ripstop" },
      { label: "Impermeable", value: "Sí" },
    ],
  },
  {
    id: "mochila-nimbus",
    name: "Mochila de día Nimbus",
    category: "Mochilas",
    price: 54,
    rating: 4.2,
    stock: 3,
    description:
      "Mochila liviana plegable de 15L, perfecta como equipaje extra o para salidas cortas de fin de semana.",
    specs: [
      { label: "Capacidad", value: "15 L" },
      { label: "Peso", value: "180 g" },
      { label: "Plegable", value: "Sí" },
      { label: "Material", value: "Nylon ripstop" },
    ],
  },
  {
    id: "zapatillas-pulse",
    name: "Zapatillas running Pulse",
    category: "Calzado",
    price: 129,
    rating: 4.8,
    stock: 17,
    description:
      "Amortiguación de espuma reactiva y suela de alto agarre. Diseñadas para entrenamientos diarios de alta intensidad.",
    specs: [
      { label: "Drop", value: "8 mm" },
      { label: "Peso", value: "265 g" },
      { label: "Suela", value: "Goma de alto agarre" },
      { label: "Uso recomendado", value: "Running en ruta" },
    ],
  },
  {
    id: "zapatillas-drift",
    name: "Zapatillas urbanas Drift",
    category: "Calzado",
    price: 99,
    rating: 4.1,
    stock: 0,
    description:
      "Diseño urbano minimalista con plantilla de memory foam. Este modelo está agotado por el momento.",
    specs: [
      { label: "Plantilla", value: "Memory foam" },
      { label: "Estilo", value: "Urbano" },
      { label: "Cierre", value: "Cordones" },
      { label: "Uso recomendado", value: "Uso diario" },
    ],
  },
  {
    id: "reloj-orbit",
    name: "Reloj inteligente Orbit",
    category: "Relojes",
    price: 149,
    rating: 4.5,
    stock: 6,
    description:
      "Smartwatch con monitor de frecuencia cardíaca, GPS integrado y batería de hasta 7 días.",
    specs: [
      { label: "Autonomía", value: "7 días" },
      { label: "GPS", value: "Integrado" },
      { label: "Resistencia al agua", value: "5 ATM" },
      { label: "Pantalla", value: "AMOLED 1.4\"" },
    ],
  },
  {
    id: "reloj-meridian",
    name: "Reloj clásico Meridian",
    category: "Relojes",
    price: 189,
    rating: 4.9,
    stock: 4,
    description:
      "Reloj analógico de acero inoxidable con movimiento de cuarzo japonés y cristal de zafiro.",
    specs: [
      { label: "Movimiento", value: "Cuarzo japonés" },
      { label: "Cristal", value: "Zafiro" },
      { label: "Caja", value: "Acero inoxidable" },
      { label: "Resistencia al agua", value: "3 ATM" },
    ],
  },
  {
    id: "lampara-lumen",
    name: "Lámpara de escritorio Lumen",
    category: "Hogar",
    price: 39,
    rating: 4.0,
    stock: 30,
    description:
      "Lámpara LED regulable con tres temperaturas de color y carga USB-C para tu celular.",
    specs: [
      { label: "Temperaturas de color", value: "3" },
      { label: "Puerto USB-C", value: "Sí" },
      { label: "Brillo máximo", value: "800 lm" },
      { label: "Material", value: "Aluminio" },
    ],
  },
  {
    id: "set-tazas-terra",
    name: "Set de tazas Terra (x4)",
    category: "Hogar",
    price: 29,
    rating: 4.4,
    stock: 25,
    description:
      "Juego de 4 tazas de cerámica esmaltada, aptas para microondas y lavavajillas.",
    specs: [
      { label: "Piezas", value: "4" },
      { label: "Material", value: "Cerámica esmaltada" },
      { label: "Apto microondas", value: "Sí" },
      { label: "Apto lavavajillas", value: "Sí" },
    ],
  },
];

export function getProduct(id: string) {
  return PRODUCTS.find((p) => p.id === id);
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
