import { AIGelRecognitionResult, AINailDesignAnalysis, Gel } from '../types';

/**
 * AI Vision Architecture abstraction layer
 * Flexible for Gemini Vision, OpenAI GPT Vision or local ONNX model
 */
export const aiVisionService = {
  /**
   * Analyze photo of gel bottles and identify manufacturers, shade names, numbers
   */
  async recognizeGelBottles(
    photoBase64: string,
    existingGels: Gel[] = []
  ): Promise<AIGelRecognitionResult[]> {
    try {
      // Simulate/Interface with Gemini Vision model
      // This architecture can be wired directly to `@google/genai` or API proxy
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mocked AI Vision detection result demo
      const result: AIGelRecognitionResult = {
        manufacturer: 'Indigo',
        name: 'Mineral Base',
        shade: 'Natural Blush',
        codeNumber: 'MB-01',
        confidenceScore: 0.94,
        suggestedGel: {
          manufacturer: 'Indigo',
          name: 'Mineral Base',
          shade: 'Natural Blush',
          codeNumber: 'MB-01',
          hexColor: '#f472b6',
          gelType: 'base',
          volumeMl: 13,
          note: 'AI rozpoznaný gél z fotografie',
        },
      };

      // Check if gel matches existing DB
      const match = existingGels.find(
        (g) =>
          g.manufacturer.toLowerCase() === result.manufacturer?.toLowerCase() &&
          (g.codeNumber?.toLowerCase() === result.codeNumber?.toLowerCase() ||
            g.shade.toLowerCase() === result.shade?.toLowerCase())
      );

      if (match) {
        result.matchedGelId = match.id;
      }

      return [result];
    } catch (err) {
      console.error('AI Gel recognition failed:', err);
      return [];
    }
  },

  /**
   * Analyze nail photo to detect style, techniques, primary colors and tags
   */
  async analyzeNailDesign(photoBase64: string): Promise<AINailDesignAnalysis> {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));

      return {
        designType: 'Babyboomer / Francúzska manikúra',
        primaryColors: ['#fbcfe8', '#ffffff', '#f472b6'],
        suggestedTechniques: ['Mliečny gél', 'Ombre špongiou', 'Lesklý top'],
        detectedTags: ['Babyboomer', 'Jemné', 'Mandľové nechty', 'Svadobné'],
        rawAnalysis: 'Detegovaný babyboomer dizajn s plynulým prechodom do bielej.',
      };
    } catch (err) {
      console.error('AI Nail design analysis failed:', err);
      return {
        detectedTags: ['Neznámy dizajn'],
      };
    }
  },
};
