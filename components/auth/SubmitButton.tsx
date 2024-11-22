"use client"
import {useFormStatus} from 'react-dom'
import {Button} from "@nextui-org/react";

function SubmitButton({name, loading}: { name: string, loading?: boolean }) {
    const {pending} = useFormStatus()

    return (
        <Button
            isLoading={pending || loading}
            type={"submit"}
            color={"primary"}
            className={"font-bold shadow-md"}>
            {name}
        </Button>
    )
}

export default SubmitButton