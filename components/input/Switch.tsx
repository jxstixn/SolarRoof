import {cn, Switch as NextSwitch} from "@nextui-org/react";
import {ChangeEventHandler} from "react";

interface SwitchProps {
    checked?: boolean
    onChange?: ChangeEventHandler<HTMLInputElement>| undefined
}

function Switch({checked, onChange}: SwitchProps) {
    return (
        <NextSwitch
            checked={checked}
            onChange={onChange}
            classNames={{
                base: cn(
                    "inline-flex flex-row-reverse max-w-md bg-content1 items-center",
                    "justify-between cursor-pointer rounded-lg gap-2 border-2 border-transparent",
                ),
                wrapper: "p-0 h-4 overflow-visible",
                thumb: cn("w-6 h-6 border-2 shadow-lg",
                    "group-data-[hover=true]:border-primary",
                    //selected
                    "group-data-[selected=true]:ml-6",
                    // pressed
                    "group-data-[pressed=true]:w-7",
                    "group-data-[selected]:group-data-[pressed]:ml-4",
                ),
            }}
        />
    )
}

export default Switch