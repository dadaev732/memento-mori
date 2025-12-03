/**
 * SVG element creation helpers
 */

const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Create an SVG element with attributes
 */
export function createSVGElement(tag: string, attrs: Record<string, string | number>): SVGElement {
    const el = document.createElementNS(SVG_NS, tag);

    for (const [key, value] of Object.entries(attrs)) {
        el.setAttribute(key, String(value));
    }

    return el;
}
