import {Divider} from "@nextui-org/react";
import Form from "@/components/contact/Form";

function Page() {
    return (
        <div
            className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full lg:w-[800px] rounded-3xl p-4 gap-4 shadow-md overflow-scroll"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-xl font-bold"}>Contact</h1>
                    <Divider/>
                    <Form/>
                </div>
            </div>
        </div>
    );

}

export default Page;