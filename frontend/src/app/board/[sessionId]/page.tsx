import BoardClient from "@/components/BoardClient";

interface BoardPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function BoardPage({ params }: BoardPageProps) {
  const { sessionId } = await params;
  return <BoardClient sessionId={sessionId} />;
}
