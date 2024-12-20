import {Checkbox, CheckboxGroup} from "@nextui-org/react";

interface RoofTypeProps {
    value?: string[];
    onValueChange?: ((value: string[]) => void) | undefined,
    disabled?: boolean
}

function RoofType(
    {value = ["open", "roof"], onValueChange, disabled}: RoofTypeProps
) {
    return (
        <CheckboxGroup
            name={"roofType"}
            isDisabled={disabled}
            label={<p className={"text-lg font-semibold text-black" + (disabled ? " opacity-disabled" : "")}>Roof Type</p>}
            value={value || undefined}
            onValueChange={onValueChange}
            classNames={{wrapper: "px-2"}}
        >
            <Checkbox value="flat">
                <p className={"text-black"}>Flat</p>
            </Checkbox>
            <Checkbox value="sloped">
                <p className={"text-black"}>Sloped</p>
            </Checkbox>
            <Checkbox value="pitched">
                <p className={"text-black"}>Pitched</p>
            </Checkbox>
        </CheckboxGroup>
    )
}

export default RoofType