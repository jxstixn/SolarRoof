"use client"
import {useFormStatus} from 'react-dom'
import {Button} from "@nextui-org/react";

function MatcherButton({name, loading, className}: { name: string, loading?: boolean, className?: string }) {
    const {pending} = useFormStatus()

    return (
        <Button
            isLoading={pending || loading}
            isDisabled={pending || loading}
            fullWidth
            type={"submit"}
            variant={"flat"}
            color={"success"}
            className={"font-bold shadow-sm " + className}
        >
            {name}
        </Button>
    )
}

export default MatcherButton