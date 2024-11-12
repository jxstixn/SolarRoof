import {Select, SelectItem, SharedSelection} from "@nextui-org/react";

interface LocationProps {
    selectedKeys: string[]
    onSelectionChange: ((keys: SharedSelection) => void) | undefined
}

function Location({selectedKeys, onSelectionChange}: LocationProps) {
    return (
        <div className={"flex flex-col gap-2"}>
            <p className={"text-lg font-bold text-black"}>Location</p>
            <Select
                className="max-w-xs"
                aria-label={"Location"}
                placeholder="Search for a location"
                selectionMode={"multiple"}
                selectedKeys={selectedKeys}
                onSelectionChange={onSelectionChange}
            >
                <SelectItem key={"france"} value={"france"}>
                    {"France"}
                </SelectItem>
                <SelectItem key={"germany"} value={"germany"}>
                    {"Germany"}
                </SelectItem>
                <SelectItem key={"italy"} value={"italy"}>
                    {"Italy"}
                </SelectItem>
                <SelectItem key={"spain"} value={"spain"}>
                    {"Spain"}
                </SelectItem>
            </Select>
        </div>
    )
}

export default Location