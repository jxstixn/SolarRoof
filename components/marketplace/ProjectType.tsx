import {Checkbox, CheckboxGroup} from "@nextui-org/react";

interface ProjectTypeProps {
    value?: string[];
    onValueChange?: ((value: string[]) => void) | undefined,
    disabled?: boolean
}

function ProjectType(
    {value = ["open", "roof"], onValueChange, disabled}: ProjectTypeProps
) {
    return (
        <CheckboxGroup
            name={"projectType"}
            isDisabled={disabled}
            label={<p className={"text-lg font-semibold text-black" + (disabled ? " opacity-disabled" : "")}>Project Type</p>}
            value={value}
            onValueChange={onValueChange}
            classNames={{wrapper: "px-2"}}
        >
            <Checkbox value="open">
                <p className={"text-black"}>Open Space</p>
            </Checkbox>
            <Checkbox value="roof">
                <p className={"text-black"}>Roof Space</p>
            </Checkbox>
        </CheckboxGroup>
    )
}

export default ProjectType