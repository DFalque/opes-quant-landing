export interface LandingService {
  slug: string;
  name: string;
  category: string;
  copy: string;
  mark: string;
  tone: string;
  state: string;
  headline: string;
  detail: string;
  points: string[];
}

export const serviceModules: LandingService[] = [
  {
    slug: 'signal',
    name: 'Signal',
    category: 'STATISTICAL RESEARCH',
    copy: 'Research reproducible para probar hipótesis de mercado sin leakage.',
    mark: 'S',
    tone: 'lime',
    state: 'RESEARCH',
    headline: 'Medir antes de creer.',
    detail: 'Signal trabaja con datasets PIT, replay walk-forward y modelos base para separar una hipótesis prometedora de una señal que solo sobrevivió al pasado.',
    points: ['Dataset sin leakage', 'Replay walk-forward', 'Calibración y estabilidad'],
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    category: 'MACRO CONTEXT',
    copy: 'El entorno macro que cambia el significado de cada precio.',
    mark: 'A',
    tone: 'blue',
    state: 'READ-ONLY',
    headline: 'Ningún activo se mueve solo.',
    detail: 'Atlas organiza métricas macro de USA, factores y régimen en una lectura trazable para entender el clima en el que se mueve el mercado.',
    points: ['13 métricas macro', 'Seis factores', 'Régimen descriptivo'],
  },
  {
    slug: 'lens',
    name: 'Lens',
    category: 'COMPANY FUNDAMENTALS',
    copy: 'La salud financiera que hay detrás de cada empresa.',
    mark: 'L',
    tone: 'paper',
    state: 'READ-ONLY',
    headline: 'Mirar más allá del gráfico.',
    detail: 'Lens interpreta snapshots issuer-level y series comparables para evaluar márgenes, liquidez, deuda, caja y flujo de caja sin inventar datos faltantes.',
    points: ['Hechos con provenance', 'Ratios comparables', 'Estados COMPLETE / PARTIAL'],
  },
  {
    slug: 'wave',
    name: 'Wave',
    category: 'PRICE + STRUCTURE',
    copy: 'Tendencia, niveles, Fibonacci y volumen en una lectura determinista.',
    mark: 'W',
    tone: 'dark',
    state: 'EVIDENCE',
    headline: 'El precio también cuenta una historia.',
    detail: 'Wave lee la estructura del precio con pivots, HH/HL/LH/LL, Fibonacci, Fan y Volume Profile para producir evidencia, no promesas.',
    points: ['Estructura de mercado', 'Fibonacci y Pitchfan', 'Volumen y niveles'],
  },
  {
    slug: 'flux',
    name: 'Flux',
    category: 'OPTIONS CONTEXT',
    copy: 'Volatilidad, liquidez y posicionamiento alrededor del precio.',
    mark: 'F',
    tone: 'orange',
    state: 'EVIDENCE',
    headline: 'Leer la presión sin inventarla.',
    detail: 'Flux reúne contexto de opciones: walls, Max Pain, GEX proxy, expected move, IV/HV, skew y term structure alrededor del precio.',
    points: ['Walls y Max Pain', 'GEX y expected move', 'Volatilidad y liquidez'],
  },
  {
    slug: 'cortex',
    name: 'Cortex',
    category: 'FINANCIAL MEMORY',
    copy: 'La memoria para que cada análisis empiece con contexto, no desde cero.',
    mark: 'C',
    tone: 'violet',
    state: 'ISOLATED',
    headline: 'Recordar también es analizar.',
    detail: 'Cortex conserva eventos, relaciones y provenance para recuperar contexto temporal y semántico de cada análisis.',
    points: ['Memoria temporal', 'Provenance exacta', 'Retrieval contextual'],
  },
  {
    slug: 'reflex',
    name: 'Reflex',
    category: 'REVIEW INTELLIGENCE',
    copy: 'Feedback versionado para revisar resultados y proponer mejoras.',
    mark: 'R',
    tone: 'mint',
    state: 'BOOTSTRAP',
    headline: 'Cada resultado deja una pregunta.',
    detail: 'Reflex está pensado para atribuir outcomes y convertir la revisión humana en propuestas versionadas, fuera del hot path.',
    points: ['Outcomes', 'Propuestas versionadas', 'Revisión humana'],
  },
];

export const visionService: LandingService = {
  slug: 'vision',
  name: 'Vision',
  category: 'EVIDENCE PRESENTATION',
  copy: 'Convierte evidencia calculada en gráficos autónomos que se pueden revisar y compartir.',
  mark: 'V',
  tone: 'gold',
  state: 'RENDERER',
  headline: 'Ver también es entender.',
  detail: 'Vision presenta overlays recibidos de Wave y Flux en HTML/SVG; valida, renderiza y exporta, pero no calcula indicadores ni decide.',
  points: ['KLineChart y SVG', 'Overlays recibidos', 'Exportación local'],
};

export const decisionLayer: LandingService = {
  slug: 'opes-intelligence',
  name: 'OPES Intelligence',
  category: 'ANALYTICAL CONVERGENCE',
  copy: 'Converge evidencia y contradicciones en una recomendación auditable.',
  mark: 'O',
  tone: 'ink',
  state: 'SHADOW',
  headline: 'Donde las lecturas se ponen a prueba.',
  detail: 'OPES Intelligence coordina el fan-out y fan-in de las inteligencias, valida identidad, freshness, provenance y contradicciones, y produce una recomendación analysis-only.',
  points: ['Fan-in determinista', 'Contradicciones', 'Recomendación auditable'],
};

export const linkService: LandingService = {
  slug: 'link',
  name: 'Link',
  category: 'DATA + CONNECTIVITY',
  copy: 'Conecta proveedores y devuelve datos normalizados, trazables y read-only.',
  mark: '↗',
  tone: 'coral',
  state: 'DATA / READ-ONLY',
  headline: 'El mundo produce ruido. Link encuentra el contexto.',
  detail: 'Link conecta proveedores externos y devuelve datos normalizados con freshness, provenance y policy explícitas para que las demás inteligencias puedan razonar sobre ellos.',
  points: ['Provider policy', 'Freshness y provenance', 'Datos normalizados'],
};

export const landingServices = [...serviceModules, linkService, visionService, decisionLayer];
