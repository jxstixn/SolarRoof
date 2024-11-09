import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center text-zinc-800 font-bold text-md pt-60">
        <Image
            className={"absolute -left-11 top-1/3 rounded-3xl shadow-xl " +
            "hover:transform hover:scale-105 transition-transform duration-300"}
            src={"/images/dalle1.webp"} alt={"Solar Roof"} width={400} height={400}/>
        <h1 className="text-6xl font-extrabold">Less roof,</h1>
        <h1 className="text-6xl font-extrabold">more solar.</h1>
    </div>
  );
}
