"use client";
import { ReactTyped } from "react-typed";
import travel from "../assets/travel.jpg";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const handleClick = () => {
    router.push("/search");
  }
  return (
    <div className="w-full min-h-screen relative bg-cover bg-center" style={{ backgroundImage: `url(${travel.src})` }}>
      <ReactTyped className="absolute left-1/2 top-1/4 transform -translate-x-1/2 -translate-y-1/2 text-red-500 bg-slate-200/40 rounded-lg p-2 text-2xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold whitespace-nowrap" strings={["Hey There!", "Turn the forecast into a mood!", "Your weather-ready playlist is here!"]} typeSpeed={100} loop={false} />
      <Button className="absolute text-xl md:text-2xl lg:text-3xl p-4 md:p-6 lg:p-8 rounded-lg left-1/2 bottom-1/4 transform -translate-x-1/2" onClick={handleClick}>Get Started</Button>
    </div>
  );
}
