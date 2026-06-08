import { TIKVAH_CATEGORIES, type TikvahServiceCategory, type TikvahServiceItem } from "@/data/tikvah-services";

export const slugify = (str: string): string =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export const findCategory = (categoryId: string): TikvahServiceCategory | undefined =>
  TIKVAH_CATEGORIES.find((c) => c.id === categoryId);

export const findItem = (
  categoryId: string,
  itemSlug: string,
): { category: TikvahServiceCategory; item: TikvahServiceItem } | undefined => {
  const category = findCategory(categoryId);
  if (!category) return undefined;
  const item = category.items.find((i) => slugify(i.title) === itemSlug);
  if (!item) return undefined;
  return { category, item };
};

export const itemHref = (categoryId: string, item: TikvahServiceItem) =>
  `/ecosistema/${categoryId}/${slugify(item.title)}`;

export const categoryHref = (categoryId: string) => `/ecosistema/${categoryId}`;
