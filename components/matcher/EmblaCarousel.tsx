import React, {useCallback, useEffect, useState} from 'react'
import {EmblaCarouselType, EmblaOptionsType} from 'embla-carousel'
import useEmblaCarousel from 'embla-carousel-react'
import './embla.css'
import Image from "next/image";
import {Button} from "@nextui-org/react";

type UsePrevNextButtonsType = {
    prevBtnDisabled: boolean
    nextBtnDisabled: boolean
    onPrevButtonClick: () => void
    onNextButtonClick: () => void
}

const usePrevNextButtons = (
    emblaApi: EmblaCarouselType | undefined
): UsePrevNextButtonsType => {
    const [prevBtnDisabled, setPrevBtnDisabled] = useState(true)
    const [nextBtnDisabled, setNextBtnDisabled] = useState(true)

    const onPrevButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollPrev()
    }, [emblaApi])

    const onNextButtonClick = useCallback(() => {
        if (!emblaApi) return
        emblaApi.scrollNext()
    }, [emblaApi])

    const onSelect = useCallback((emblaApi: EmblaCarouselType) => {
        setPrevBtnDisabled(!emblaApi.canScrollPrev())
        setNextBtnDisabled(!emblaApi.canScrollNext())
    }, [])

    useEffect(() => {
        if (!emblaApi) return

        onSelect(emblaApi)
        emblaApi.on('reInit', onSelect).on('select', onSelect)
    }, [emblaApi, onSelect])

    return {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    }
}


const OPTIONS: EmblaOptionsType = {loop: true}

interface EmblaCarouselProps {
    slides: string[],
    title: string,
}

function EmblaCarousel({slides, title}: EmblaCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel(OPTIONS)

    const {
        prevBtnDisabled,
        nextBtnDisabled,
        onPrevButtonClick,
        onNextButtonClick
    } = usePrevNextButtons(emblaApi)

    return (
        <section className="embla">
            <div className="overflow-hidden" ref={emblaRef}>
                <div className="flex touch-pan-y touch-pinch-zoom -ml-1">
                    {slides.map((index) => (
                        <div className="embla__slide" key={index}>
                            <Image
                                key={index}
                                className={"rounded-2xl shadow-md object-center object-cover"}
                                src={index}
                                alt={"Market Listing"}
                                height={300}
                                width={300}
                            />
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-row w-full justify-between items-center pt-2">
                <h1 className={"text-xl font-bold"}>{title}</h1>
                <div className="hidden sm:flex flex-row gap-2">
                    <Button
                        onClick={onPrevButtonClick}
                        isDisabled={prevBtnDisabled}
                        className={"bg-transparent hover:bg-default-100"}
                        size={"sm"}
                        endContent={
                            <svg className="size-4" viewBox="0 0 532 532">
                                <path
                                    fill="currentColor"
                                    d="M355.66 11.354c13.793-13.805 36.208-13.805 50.001 0 13.785 13.804 13.785 36.238 0 50.034L201.22 266l204.442 204.61c13.785 13.805 13.785 36.239 0 50.044-13.793 13.796-36.208 13.796-50.002 0a5994246.277 5994246.277 0 0 0-229.332-229.454 35.065 35.065 0 0 1-10.326-25.126c0-9.2 3.393-18.26 10.326-25.2C172.192 194.973 332.731 34.31 355.66 11.354Z"
                                />
                            </svg>}
                        isIconOnly
                    ></Button>
                    <Button
                        onClick={onNextButtonClick}
                        isDisabled={nextBtnDisabled}
                        className={"bg-transparent hover:bg-default-100"}
                        size={"sm"}
                        endContent={
                            <svg className="size-4" viewBox="0 0 532 532">
                                <path
                                    fill="currentColor"
                                    d="M176.34 520.646c-13.793 13.805-36.208 13.805-50.001 0-13.785-13.804-13.785-36.238 0-50.034L330.78 266 126.34 61.391c-13.785-13.805-13.785-36.239 0-50.044 13.793-13.796 36.208-13.796 50.002 0 22.928 22.947 206.395 206.507 229.332 229.454a35.065 35.065 0 0 1 10.326 25.126c0 9.2-3.393 18.26-10.326 25.2-45.865 45.901-206.404 206.564-229.332 229.52Z"
                                />
                            </svg>}
                        isIconOnly
                    ></Button>
                </div>
            </div>
        </section>
    )
}

export default EmblaCarousel
