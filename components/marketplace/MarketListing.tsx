import Image from "next/image";
import { getUrl } from 'aws-amplify/storage';
import {useEffect, useState} from "react";

function MarketListing({className, title, image, solarScore}: { className?: string, image?: string | null, title: string, solarScore?: number | null }) {
    const [imageSrc, setImageSrc] = useState<string>();

    useEffect(() => {
        const fetchImageSrc = async () => {
            if (image) {
                const imageUrl = await getUrl({path: image});
                console.log(imageUrl);
                setImageSrc(imageUrl.url.toString());
            }
        }
        fetchImageSrc().then()
    }, [image]);

    function computeSolarScoreColor(solarScore?: number | null) {
        // rank them from 1 to 5 with 1 being the worst and 5 being the best
        // this should look like a progress bar with 5 different colors
        // 1 - red, 2 - orange, 3 - yellow, 4 - light green, 5 - dark green
        const colors= ["bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-300", "bg-green-500"];

        if (!solarScore) {
            return (
                <div className={"w-full h-2 bg-gray-300 rounded-full"}/>
            )
        }

        return (
            <div className={"flex flex-row gap-1"}>
                {Array.from({length: 5}, (_, i) => {
                    return (
                        // first one should be rounded on the left, last one should be rounded on the right
                        <div key={i} className={`w-full h-2 ${i < solarScore ? colors[solarScore - 1] : "bg-gray-300"}
                        ${i === 0 ? "rounded-l-full" : ""} ${i === 4 ? "rounded-r-full" : ""}
                        `}/>
                    )
                })}
            </div>
        )
    }

    return (
        <div className={"flex flex-col bg-white w-full sm:w-80 max-h-[500px] rounded-3xl p-4 shadow-xl gap-3 transform-all hover:scale-105 duration-300 " + className}>
            <div className={"relative max-w-full w-full max-h-64 h-48"}>
                <Image
                    className={"rounded-2xl shadow-md object-center object-cover"}
                       src={imageSrc || "/CameraIcon.svg"}
                    alt={"Market Listing"}
                    fill
                />
            </div>
            <h1 className={"text-xl font-bold"}>{title}</h1>
            <p key={"description"} className={"font-normal text-sm"}>
                This listing is a great opportunity to install solar panels on your roof. The solar score is a measure of how much sunlight your roof gets.
                For more information, please contact us.
            </p>
            <div className={"flex flex-col gap-1"}>
                <span className={"text-lg"}>Solar Score:</span>
                {computeSolarScoreColor(solarScore)}
            </div>
        </div>
    )
}

export default MarketListing