import {Checkbox, CheckboxGroup} from "@nextui-org/react";

interface ProjectTypeProps {
    value: string[];
    onValueChange: ((value: string[]) => void) | undefined
}

function ProjectType(
    {value = ["open", "roof"], onValueChange}: ProjectTypeProps
) {
    return (
        <CheckboxGroup
            name={"projectType"}
            label={<p className={"text-lg font-bold text-black"}>Project Type</p>}
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