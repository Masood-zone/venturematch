export type LayoutProps<T extends string = string> = {
  children: React.ReactNode;
  params: Record<T, string>;
};

export type PageProps<T extends string = string> = {
  params: Promise<Record<T, string>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};
