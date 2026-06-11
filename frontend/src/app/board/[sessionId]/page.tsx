"use client";
import BoardClient from "@/components/BoardClient";
import { use } from "react";

interface BoardPageProps {
  params: Promise<{ sessionId: string }>;
}

export default function BoardPage({ params }: BoardPageProps) {
  const { sessionId } = use(params);
  return <BoardClient sessionId={sessionId} />;
}
