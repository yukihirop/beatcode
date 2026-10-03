// og/<lang>/<page>.png: each page's card for link previews (og.ts), written when the site is built
import type { APIRoute, GetStaticPaths } from "astro";
import { ogCards, ogPng, ogSvg } from "../../og";

export const getStaticPaths: GetStaticPaths = () => Object.keys(ogCards).map((slug) => ({ params: { slug } }));

export const GET: APIRoute = ({ params }) => {
  const card = ogCards[params.slug!];
  if (!card) return new Response(null, { status: 404 });
  return new Response(ogPng(ogSvg(card)) as Uint8Array<ArrayBuffer>, { headers: { "Content-Type": "image/png" } });
};
