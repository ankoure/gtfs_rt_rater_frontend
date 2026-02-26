import FeedsList from "../../../modules/feeds/FeedsList";

export default async function FeedsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const { page, q } = await searchParams;
  const pageNumber = Math.max(1, parseInt(page ?? "1", 10) || 1);
  return <FeedsList page={pageNumber} q={q ?? ""} />;
}
