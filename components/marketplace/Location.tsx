import {Select, SelectItem, SharedSelection} from "@nextui-org/react";

interface LocationProps {
    selectedKeys?: string[]
    onSelectionChange?: ((keys: SharedSelection) => void) | undefined,
    disabled?: boolean
}

function Location({selectedKeys, onSelectionChange, disabled}: LocationProps) {
    return (
        <div className={"flex flex-col gap-2"}>
            <Select
                id={"location"}
                name={"location"}
                isDisabled={disabled}
                aria-label={"Location"}
                label={<p className={"text-lg font-semibold text-black"}>Location</p>}
                labelPlacement={"outside"}
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