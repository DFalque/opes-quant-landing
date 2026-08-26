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
    category: 'PREDICTIVE ML',
    copy: 'Modelos que aprenden del pasado para anticipar escenarios.',
    mark: 'S',
    tone: 'lime',
    headline: 'Aprender del pasado para mirar hacia delante.',
    detail: 'Signal estudia la historia de los mercados para detectar patrones y construir escenarios probables. No adivina: ayuda a entender qué puede pasar.',
    points: ['Patrones del pasado', 'Escenarios probables', 'Señales que se actualizan'],
  },
  {
    slug: 'atlas',
    name: 'Atlas',
    category: 'MACRO + SECTORS',
    copy: 'El pulso de la economía y los sectores que mueven el mercado.',
    mark: 'A',
    tone: 'blue',
    headline: 'Ningún activo se mueve solo.',
    detail: 'Atlas pone cada oportunidad en su mapa: economía, bancos centrales, geopolítica y sectores. Porque el contexto cambia el significado de cada precio.',
    points: ['Macro global', 'Rotación sectorial', 'Contexto económico'],
  },
  {
    slug: 'lens',
    name: 'Lens',
    category: 'FUNDAMENTAL VALUE',
    copy: 'El valor real que hay detrás del precio de cada empresa.',
    mark: 'L',
    tone: 'paper',
    headline: 'Mirar más allá del gráfico.',
    detail: 'Lens analiza la empresa que hay detrás de cada ticker: calidad, resultados, balance y valoración para entender qué estás comprando.',
    points: ['Calidad de negocio', 'Valoración', 'Resultados y balance'],
  },
  {
    slug: 'wave',
    name: 'Wave',
    category: 'MARKET STRUCTURE',
    copy: 'Lo que el precio, el volumen y la estructura están contando.',
    mark: 'W',
    tone: 'dark',
    headline: 'El precio también cuenta una historia.',
    detail: 'Wave lee el movimiento del mercado: tendencia, niveles, Fibonacci, volumen y patrones para entender dónde está el precio y hacia dónde puede ir.',
    points: ['Price action', 'Fibonacci y niveles', 'Volumen y estructura'],
  },
  {
    slug: 'flux',
    name: 'Flux',
    category: 'DERIVATIVES + POSITIONING',
    copy: 'Dónde está el dinero y la presión que todavía no ves en el precio.',
    mark: 'F',
    tone: 'orange',
    headline: 'Ver la presión antes de que aparezca.',
    detail: 'Flux observa derivados y posicionamiento para descubrir dónde se concentra la fuerza del mercado y qué niveles pueden importar.',
    points: ['Opciones y GEX', 'Open interest', 'Posicionamiento'],
  },
  {
    slug: 'cortex',
    name: 'Cortex',
    category: 'FINANCIAL MEMORY',
    copy: 'La memoria para que cada análisis empiece con contexto, no desde cero.',
    mark: 'C',
    tone: 'violet',
    headline: 'Recordar también es analizar.',
    detail: 'Cortex guarda y relaciona la historia de los mercados para recuperar rápidamente lo que ya ocurrió y encontrar conexiones que una lectura aislada no ve.',
    points: ['Memoria temporal', 'Relaciones entre eventos', 'Búsqueda inteligente'],
  },
  {
    slug: 'reflex',
    name: 'Reflex',
    category: 'FEEDBACK INTELLIGENCE',
    copy: 'Aprende de lo que ocurrió para que la siguiente decisión sea mejor.',
    mark: 'R',
    tone: 'mint',
    headline: 'Cada decisión deja algo que aprender.',
    detail: 'Reflex revisa los resultados de OPES y convierte la experiencia en feedback para mejorar los análisis que vienen después.',
    points: ['Revisión de resultados', 'Atribución', 'Mejora continua'],
  },
];

export const visionService: LandingService = {
  slug: 'vision',
  name: 'Vision',
  category: 'VISUAL INTELLIGENCE',
  copy: 'Convierte lo que analizan las demás inteligencias en algo que puedes ver.',
  mark: 'V',
  tone: 'gold',
  headline: 'Ver también es entender.',
  detail: 'Vision da forma visual al análisis de OPES: gráficos con Fibonacci, volumen profile y contexto para que los datos también se puedan leer de un vistazo.',
  points: ['Gráficos con contexto', 'Fibonacci y volumen', 'Una lectura visual'],
};

export const decisionLayer: LandingService = {
  slug: 'opes-intelligence',
  name: 'OPES Intelligence',
  category: 'THE DECISION LAYER',
  copy: 'La visión completa que convierte todas las lecturas en una decisión.',
  mark: 'O',
  tone: 'ink',
  headline: 'Donde toda la inteligencia se convierte en una decisión.',
  detail: 'OPES Intelligence reúne el contexto de todos los servicios, elige la estrategia que mejor encaja y define el siguiente paso: comprar, vender o esperar.',
  points: ['Contexto completo', 'Estrategia adecuada', 'Decisión clara'],
};

export const linkService: LandingService = {
  slug: 'link',
  name: 'Link',
  category: 'BROKER CONNECTION',
  copy: 'La conexión entre una decisión de OPES y el mercado.',
  mark: '↗',
  tone: 'coral',
  headline: 'Del análisis a la acción.',
  detail: 'Link es la capa que conecta OPES con los brokers para llevar una decisión autorizada al mercado. No decide: hace posible ejecutar.',
  points: ['Conexión con brokers', 'Ejecución controlada', 'Una decisión, una acción'],
};

export const landingServices = [...serviceModules, linkService, visionService, decisionLayer];
