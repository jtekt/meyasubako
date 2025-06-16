import { useNavigate } from "@solidjs/router";

export default function Home() {
  const navigate = useNavigate();
  navigate("/items");
  return <main>Redirecting...</main>;
}
