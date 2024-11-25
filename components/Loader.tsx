import {Spinner} from "@nextui-org/react";

function Loader(className: {className?: string}) {
    return (
        <div
            className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white rounded-3xl px-12 py-8 gap-4 " + className}>
                <Spinner label="Loading..." classNames={{
                    label: "text-zinc-800"
                }} color={"primary"}/>
            </div>
        </div>
    );
}


export default Loader