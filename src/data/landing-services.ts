export interface LandingService {
  slug: string;
  name: string;
  category: string;
  copy: string;
  mark: string;
  tone: string;
  headline: string;
  detail: string;
  points: string[];
}

export const serviceModules: LandingService[] = [
  {
    slug: 'signal',
    name: 'Signal',
    category: 'STATISTICAL RESEARCH',
    copy: 'Valida tus ideas con datos, replay y modelos que separan una hipótesis de una señal.',
    mark: 'S',
    tone: 'lime',
    headline: 'Medir antes de creer.',
    detail: 'Signal convierte una idea en una investigación reproducible: datasets históricos, replay walk-forward y modelos calibrados para entender cuándo una hipótesis se sostiene.',
    points: ['Datos sin leakage', 'Replay walk-forward', 'Modelos calibrados'],
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    category: 'MACRO CONTEXT',
    copy: 'El contexto macro que cambia el significado de cada movimiento.',
    mark: 'A',
    tone: 'blue',
    headline: 'Ningún activo se mueve solo.',
    detail: 'Atlas conecta indicadores macro, factores y régimen para que entiendas el clima que rodea al mercado antes de interpretar un precio aislado.',
    points: ['Contexto macro', 'Factores de mercado', 'Regímenes económicos'],
  },
  {
    slug: 'lens',
    name: 'Lens',
    category: 'COMPANY FUNDAMENTALS',
    copy: 'Mira la empresa detrás del ticker: salud financiera, calidad y valor.',
    mark: 'L',
    tone: 'paper',
    headline: 'Mirar más allá del gráfico.',
    detail: 'Lens reúne filings y métricas comparables para entender márgenes, liquidez, deuda, caja y flujo de caja sin perder de vista la calidad de los datos.',
    points: ['Salud financiera', 'Ratios comparables', 'Resultados y balance'],
  },
  {
    slug: 'wave',
    name: 'Wave',
    category: 'PRICE + STRUCTURE',
    copy: 'Lee la estructura del precio con tendencia, niveles, Fibonacci y volumen.',
    mark: 'W',
    tone: 'dark',
    headline: 'El precio también cuenta una historia.',
    detail: 'Wave transforma el movimiento del precio en una lectura estructurada con pivots, patrones, Fibonacci, Fan y Volume Profile.',
    points: ['Estructura de mercado', 'Fibonacci y niveles', 'Volumen y price action'],
  },
  {
    slug: 'flux',
    name: 'Flux',
    category: 'OPTIONS CONTEXT',
    copy: 'Haz visible la presión que rodea al precio con opciones y volatilidad.',
    mark: 'F',
    tone: 'orange',
    headline: 'Ver la presión antes de decidir.',
    detail: 'Flux convierte el mercado de opciones en contexto útil: walls, Max Pain, GEX, expected move, volatilidad, skew y term structure.',
    points: ['Opciones y GEX', 'Open interest', 'Volatilidad implícita'],
  },
  {
    slug: 'cortex',
    name: 'Cortex',
    category: 'FINANCIAL MEMORY',
    copy: 'Conserva el contexto para que cada análisis empiece más lejos.',
    mark: 'C',
    tone: 'violet',
    headline: 'Recordar también es analizar.',
    detail: 'Cortex recuerda eventos, relaciones y contexto temporal para que las nuevas lecturas puedan aprovechar lo que ya ocurrió.',
    points: ['Memoria temporal', 'Relaciones entre eventos', 'Búsqueda contextual'],
  },
  {
    slug: 'reflex',
    name: 'Reflex',
    category: 'REVIEW INTELLIGENCE',
    copy: 'Convierte cada resultado en aprendizaje para mejorar lo que viene.',
    mark: 'R',
    tone: 'mint',
    headline: 'Cada resultado deja algo que aprender.',
    detail: 'Reflex revisa los resultados, atribuye outcomes y convierte la experiencia en propuestas versionadas para hacer mejor el siguiente análisis.',
    points: ['Revisión de resultados', 'Atribución', 'Mejora continua'],
  },
];

export const visionService: LandingService = {
  slug: 'vision',
  name: 'Vision',
  category: 'EVIDENCE PRESENTATION',
  copy: 'Convierte evidencia calculada en gráficos autónomos que se pueden revisar y compartir.',
  mark: 'V',
  tone: 'gold',
  headline: 'Ver también es entender.',
  detail: 'Vision convierte las lecturas de OPES en gráficos claros y autónomos con overlays de precio, Fibonacci y volumen que puedes revisar y compartir.',
  points: ['Gráficos con contexto', 'Fibonacci y volumen', 'Exportación visual'],
};

export const decisionLayer: LandingService = {
  slug: 'opes-intelligence',
  name: 'OPES Intelligence',
  category: 'ANALYTICAL CONVERGENCE',
  copy: 'Converge evidencia y contradicciones en una recomendación auditable.',
  mark: 'O',
  tone: 'ink',
  headline: 'Donde todo empieza a tener sentido.',
  detail: 'OPES Intelligence reúne las lecturas de cada inteligencia, pone en primer plano lo que encaja y lo que contradice, y te entrega una visión clara del siguiente paso.',
  points: ['Contexto conectado', 'Contradicciones visibles', 'Siguiente paso claro'],
};

export const linkService: LandingService = {
  slug: 'link',
  name: 'Link',
  category: 'DATA + CONNECTIVITY',
  copy: 'Conecta las fuentes que importan y convierte el ruido del mundo en contexto.',
  mark: '↗',
  tone: 'coral',
  headline: 'El mundo produce ruido. Link encuentra el contexto.',
  detail: 'Link conecta las fuentes que importan, contrasta sus señales y las convierte en datos listos para que cada inteligencia pueda entender mejor el mercado.',
  points: ['Macro y sectores', 'Empresa y mercado', 'Contexto contrastado'],
};

export const landingServices = [...serviceModules, linkService, visionService, decisionLayer];
