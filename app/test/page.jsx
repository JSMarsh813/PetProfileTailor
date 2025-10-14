export default async function TestSlow() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <p> test </p>;
}
