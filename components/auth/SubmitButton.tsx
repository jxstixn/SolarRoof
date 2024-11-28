"use client"
import {useFormStatus} from 'react-dom'
import {Button} from "@nextui-org/react";

function SubmitButton({name, loading, className}: { name: string, loading?: boolean, className?: string }) {
    const {pending} = useFormStatus()

    return (
        <Button
            isLoading={pending || loading}
            type={"submit"}
            color={"primary"}
            className={"font-bold shadow-md " + className}
        >
            {name}
        </Button>
    )
}

export default SubmitButton