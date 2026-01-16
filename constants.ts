
import { ChecklistItem } from './types';

export const COLORS = {
  primary: 'bg-blue-100 text-blue-800',
  secondary: 'bg-green-100 text-green-800',
  accent: 'bg-blue-500 hover:bg-blue-600 text-white',
  bg: 'bg-slate-50',
  pastelBlue: '#E0F2FE',
  pastelGreen: '#DCFCE7'
};

export const CHECKLIST_DOC: ChecklistItem[] = [
  { id: 'P-01', point: 'Planos y diagrama unifilar del SFV', reference: '690-4(a), 110-3(b)', type: 'DOC', criteria: 'Se entrega plano/unifilar del SFV y coincide con el alcance.' },
  { id: 'P-02', point: 'Identificación/agrupamiento de conductores', reference: '690-4(b)(1)–(4)', type: 'DOC', criteria: 'En planos se identifica FV-DC, salida FV, entrada/salida inversor.' },
  { id: 'P-04', point: 'Cálculo de tensión máxima del string', reference: '690-7, 110-3(b)', type: 'DOC', criteria: 'Vmax por temperatura mínima no excede tensión nominal.' },
  { id: 'P-07', point: 'Protección contra sobrecorriente', reference: '690-9(a), Art. 240', type: 'DOC', criteria: 'Se especifican OCPD con valores justificados.' },
  { id: 'P-13', point: 'Medio de desconexión FV del edificio', reference: '690-14(c)(1)', type: 'DOC', criteria: 'Cerca del punto de entrada, accesible y no en baños.' },
];

export const CHECKLIST_CAMPO: ChecklistItem[] = [
  { id: 'C-01', point: 'Equipos instalados conforme a fabricante', reference: '110-3(b)', type: 'VIS', criteria: 'Montaje/ventilación coinciden con manuales.' },
  { id: 'C-02', point: 'Ejecución mecánica', reference: '110-12', type: 'VIS', criteria: 'Instalación limpia, sin daño mecánico o bordes cortantes.' },
  { id: 'C-06', point: 'Canalización requerida >30 V', reference: '690-31(a)', type: 'VIS', criteria: 'Circuitos FV accesibles con Vmax >30 V están en canalización.' },
  { id: 'C-13', point: 'Ubicación desconectador FV', reference: '690-14(c)(1)', type: 'VIS', criteria: 'Exterior o interior cerca entrada; accesible; no en baños.' },
  { id: 'C-21', point: 'Electrodo adicional de tierra', reference: '250-53(a)(2)', type: 'MED/DOC', criteria: 'Resistencia ≤25 Ω o electrodo adicional.' },
];

export const SYSTEM_PROMPT = `
Eres "SolarCheck AI", un asistente experto en ingeniería fotovoltaica y cumplimiento normativo para México bajo la NOM-001-SEDE-2012 vigente (Art. 690 y 705).
Tu objetivo es ayudar a instaladores y diseñadores a verificar que sus sistemas residenciales e industriales cumplan con la normativa.

Capacidades:
1. Analizar fotos de instalaciones para detectar posibles faltas normativas.
2. Sugerir correcciones técnicas basadas en la NOM.
3. Evaluar puntos de las listas de inspección (P-XX para proyecto, C-XX para campo, INT-XX para interconexión).
4. Generar diagramas o representaciones visuales cuando se solicite.

Siempre responde en español, de forma profesional, clara y citando los artículos específicos de la NOM-001-SEDE-2012 cuando sea posible.
Si ves una imagen, busca componentes como conductores, canalizaciones, medios de desconexión, inversores o estructuras y evalúa su estado visual.
`;
