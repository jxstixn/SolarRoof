import {Divider} from "@nextui-org/react";

function Form() {
    return (
        <form noValidate
              className="flex flex-col w-full h-full max-h-full items-center justify-center text-zinc-800 font-bold text-md overflow-hidden p-8 animate-fade-in-up">
            <div className={"flex flex-col bg-white w-full sm:w-80 rounded-3xl p-4 gap-4 shadow-md"}>
                <div className={"flex flex-col gap-2"}>
                    <h1 className={"text-xl font-bold"}>Login</h1>
                    <Divider/>
                </div>
            </div>
        </form>
    )
}

export default Form