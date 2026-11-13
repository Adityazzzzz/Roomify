import puter from "@heyputer/puter.js";
import {ROOMIFY_RENDER_PROMPT} from "./constants";

export const fetchAsDataUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }

  const blob = await response.blob();

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generate3DView = async ({ sourceImage, style = "modern", view = "top-down", feedback = "", rooms = [] }: Generate3DViewParams) => {
    const dataUrl = sourceImage.startsWith('data:')
        ? sourceImage
        : await fetchAsDataUrl(sourceImage);

    const base64Data = dataUrl.split(',')[1];
    const mimeType = dataUrl.split(';')[0].split(':')[1];

    if(!mimeType || !base64Data) throw new Error('Invalid source image payload');

    const roomBrief = rooms.length
        ? `ROOM PROGRAM (only furnish these rooms): ${rooms.map((room) => `${room.name} (${room.type}), ${room.floor} floor, ${room.walls} walls, ${room.furniture} furniture`).join("; ")}.`
        : "";
    const viewBrief: Record<RenderView, string> = {
        "top-down": "Orthographic, strictly top-down architectural plan render.",
        dollhouse: "A clean 45-degree dollhouse cutaway view, while preserving the exact room layout.",
        interior: "A realistic eye-level interior perspective from the most representative main room.",
        night: "Orthographic top-down architectural render at dusk with warm practical interior lighting.",
    };
    const styleBrief: Record<DesignStyle, string> = {
        modern: "modern minimal, warm oak, restrained neutral palette",
        scandinavian: "Scandinavian, pale timber, soft daylight, natural textiles",
        industrial: "industrial, concrete, black steel, exposed texture",
        luxury: "quiet luxury, refined stone, custom millwork, layered lighting",
        traditional: "timeless traditional, warm timber, classic detailing",
        empty: "unfurnished architectural visualization; show only finishes, walls, doors, and fixed fixtures",
    };
    const prompt = `${ROOMIFY_RENDER_PROMPT}\n\nDESIGN DIRECTION: ${styleBrief[style]}.\nVIEW: ${viewBrief[view]}\n${roomBrief}\nUSER REFINEMENT: ${feedback || "None."}`;

    const response = await puter.ai.txt2img(prompt, {
        provider: "gemini",
        model: "gemini-3-pro-image-preview",
        input_image: base64Data,
        input_image_mime_type: mimeType,
        ratio: { w: 1024, h: 1024 },
    });

    const rawImageUrl = (response as HTMLImageElement).src ?? null;

    if (!rawImageUrl) return { renderedImage: null, renderedPath: undefined };

    const renderedImage = rawImageUrl.startsWith('data:')
    ? rawImageUrl : await fetchAsDataUrl(rawImageUrl);

    return { renderedImage, renderedPath: undefined };
}
