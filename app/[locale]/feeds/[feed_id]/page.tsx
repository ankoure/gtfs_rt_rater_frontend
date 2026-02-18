import FeedDetails from "../../../../modules/feedDetail/FeedDetails";

export default async function FeedDetailPage({
  params,
}: {
  params: Promise<{ feed_id: string }>;
}) {
  const { feed_id } = await params;
  return <FeedDetails feedId={feed_id} />;
}
