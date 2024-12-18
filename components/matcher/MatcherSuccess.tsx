import { motion } from 'framer-motion';
import Image from "next/image";

function MatcherSuccess() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
                duration: 0.4,
                scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
            }}
            className={"flex flex-col py-20 px-10 items-center justify-center gap-4"}
        >
            <Image src={"/congrats.gif"} alt={"Congrats"} height={50} width={50} unoptimized/>
            <h1 className={"text-4xl font-bold"}>Matched!</h1>
            <p className={"text-lg font-normal text-center"}>
                You&apos;ve successfully matched with the investor. They will be in touch with you shortly.
            </p>
        </motion.div>
    )
}

export default MatcherSuccess;