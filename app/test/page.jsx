// app/_test-slow/page.tsx

import LoadingSkeleton from "@/components/LoadingScreen";
export default async function TestSlow() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <LoadingSkeleton />;
}
