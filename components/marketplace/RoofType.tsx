import {Checkbox, CheckboxGroup} from "@nextui-org/react";

interface RoofTypeProps {
    value: string[];
    onValueChange: ((value: string[]) => void) | undefined
}

function RoofType(
    {value = ["open", "roof"], onValueChange}: RoofTypeProps
) {
    return (
        <CheckboxGroup
            name={"roofType"}
            label={<p className={"text-lg font-bold text-black"}>Roof Type</p>}
            value={value}
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