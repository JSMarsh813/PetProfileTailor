import Login from "@components/login";

export default async function LoginScreen() {
  // server check logic moved entirely to login component, to avoid crashes of the two session checks fighting eachother

  return <Login />;
}
