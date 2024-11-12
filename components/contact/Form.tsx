"use client"
import {Autocomplete, AutocompleteItem, Button, Input, Textarea} from "@nextui-org/react";
import React, {useRef, useState} from "react";
import Camera from "@/components/icons/Camera";
import {uploadData} from "@aws-amplify/storage";
import Image from "next/image";
import {generateClient} from "@aws-amplify/api";
import {Schema} from "@/amplify/data/resource";

const client = generateClient<Schema>();

function Form() {
    const fileInput = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState<File[]>([]);
    const [formData, setFormData] = useState({
        givenName: "",
        familyName: "",
        name: "",
        email: "",
        country: "",
        street: "",
        postalCode: "",
        city: "",
        description: ""
    });
    const [invalidInputs, setInvalidInputs] = useState({
        givenName: false,
        familyName: false,
        name: false,
        email: false,
        country: false,
        street: false,
        postalCode: false,
        city: false,
        description: false
    })

    const validateInputs = () => {
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        const validEmail = emailRegex.test(formData.email);
        const validGivenName = formData.givenName.length > 0;
        const validFamilyName = formData.familyName.length > 0;
        const validCountry = formData.country.length > 0;
        const validStreet = formData.street.length > 0;
        const validPostalCode = formData.postalCode.length > 0;
        const validCity = formData.city.length > 0;
        const validName = formData.name.length > 0;

        setInvalidInputs({
            givenName: !validGivenName,
            familyName: !validFamilyName,
            email: !validEmail,
            country: !validCountry,
            street: !validStreet,
            postalCode: !validPostalCode,
            city: !validCity,
            name: !validName,
            description: false
        });

        return validEmail && validGivenName && validFamilyName && validCountry && validStreet && validPostalCode && validCity;
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        if (!validateInputs()) {
            setLoading(false);
            return;
        }

        const res = await fetch("/api/contact", {
            method: "POST",
            body: JSON.stringify(formData)
        });

        if (!res.ok) {
            const {errors} = await res.json();
            console.error(errors);
            alert("An error occurred. Please try again later.");
            setLoading(false);
            return;
        }

        const {listingId} = await res.json();

        try {
            await uploadImages(listingId);
        } catch (error) {
            console.error(error);
            alert("An error occurred during image upload. Please try again later.");
        }

        setLoading(false);
        setFormData({
            givenName: "",
            familyName: "",
            email: "",
            country: "",
            street: "",
            postalCode: "",
            city: "",
            name: "",
            description: ""
        })
        setImages([]);
    }

    const uploadImages = async (listingId: string) => {
        try {
            const promises = images.map(async (image) => {
                uploadData({
                    data: image,
                    path: `listings/${listingId}/${image.name}`
                });
            });

            await Promise.all(promises);

            await client.models.Listing.update({
                id: listingId,
                images: images.map((image) => `listings/${listingId}/${image.name}`)
            });
        } catch (error) {
            throw error;
        }
    }

    return (
        <form noValidate onSubmit={handleSubmit}
              className={"flex flex-col w-full h-full max-h-full gap-4"}>
            <div className={"flex flex-col w-full h-full max-h-full gap-4"}>
                <h2 className={"text-md font-bold"}>Personal Information</h2>
                <div className={"flex flex-row gap-4"}>
                    <Input
                        id={"givenName"}
                        name={"givenName"}
                        autoComplete={"given-name"}
                        label={"Given Name"}
                        placeholder={"Enter your given name"}
                        type={"text"}
                        onChange={(event) => {
                            setFormData({
                                ...formData,
                                givenName: event.target.value
                            });
                            setInvalidInputs({
                                ...invalidInputs,
                                givenName: false
                            });
                        }}
                        isInvalid={invalidInputs.givenName}
                        errorMessage={invalidInputs.givenName ? "Please enter a valid given name" : ""}
                        required
                    />
                    <Input
                        id={"familyName"}
                        name={"familyName"}
                        autoComplete={"family-name"}
                        label={"Family Name"}
                        placeholder={"Enter your family name"}
                        type={"text"}
                        onChange={(event) => {
                            setFormData({
                                ...formData,
                                familyName: event.target.value
                            });
                            setInvalidInputs({
                                ...invalidInputs,
                                familyName: false
                            });
                        }}
                        isInvalid={invalidInputs.familyName}
                        errorMessage={invalidInputs.familyName ? "Please enter a valid family name" : ""}
                        required
                    />
                </div>
                <Input
                    id={"email"}
                    name={"email"}
                    autoComplete={"email"}
                    label={"Email"}
                    placeholder={"Email"}
                    type={"email"}
                    onChange={(event) => {
                        setFormData({
                            ...formData,
                            email: event.target.value
                        });
                        setInvalidInputs({
                            ...invalidInputs,
                            email: false
                        });
                    }}
                    isInvalid={invalidInputs.email}
                    errorMessage={invalidInputs.email ? "Please enter a valid email" : ""}
                    required
                />
                <h2 className={"text-md font-bold"}>Property Information</h2>
                <div className={"flex flex-col lg:flex-row gap-4"}>
                    <div className={"flex flex-col w-full h-full max-h-full gap-4"}>
                        <Autocomplete
                            id={"country"}
                            name={"country"}
                            autoComplete={"country"}
                            label={"Country"}
                            placeholder={"Country"}
                            type={"text"}
                            onSelectionChange={(event) => {
                                setFormData({
                                    ...formData,
                                    country: event?.toString() || ""
                                });
                                setInvalidInputs({
                                    ...invalidInputs,
                                    country: false
                                });
                            }}
                            isInvalid={invalidInputs.country}
                            errorMessage={invalidInputs.country ? "Please enter a valid country" : ""}
                            required
                        >
                            <AutocompleteItem
                                key={"Germany"}
                                value={"Germany"}
                            >Germany</AutocompleteItem>
                            <AutocompleteItem
                                key={"France"}
                                value={"France"}
                            >France</AutocompleteItem>
                            <AutocompleteItem
                                key={"Italy"}
                                value={"Italy"}
                            >Italy</AutocompleteItem>
                            <AutocompleteItem
                                key={"Spain"}
                                value={"Spain"}
                            >Spain</AutocompleteItem>
                        </Autocomplete>
                        <Input
                            id={"street"}
                            name={"street"}
                            autoComplete={"street-address"}
                            label={"Street"}
                            placeholder={"Street"}
                            type={"text"}
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    street: event.target.value
                                });
                                setInvalidInputs({
                                    ...invalidInputs,
                                    street: false
                                });
                            }}
                            isInvalid={invalidInputs.street}
                            errorMessage={invalidInputs.street ? "Please enter a valid street" : ""}
                            required
                        />
                        <div className={"flex flex-row gap-4"}>
                            <Input
                                id={"postalCode"}
                                name={"postalCode"}
                                autoComplete={"postal-code"}
                                label={"Zip"}
                                placeholder={"Zip"}
                                type={"text"}
                                className={"w-32"}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        postalCode: event.target.value
                                    });
                                    setInvalidInputs({
                                        ...invalidInputs,
                                        postalCode: false
                                    });
                                }}
                                isInvalid={invalidInputs.postalCode}
                                errorMessage={invalidInputs.postalCode ? "Please enter a valid zip" : ""}
                                required
                            />
                            <Input
                                id={"city"}
                                name={"city"}
                                autoComplete={"address-level2"}
                                label={"City"}
                                placeholder={"City"}
                                type={"text"}
                                className={"w-full"}
                                onChange={(event) => {
                                    setFormData({
                                        ...formData,
                                        city: event.target.value
                                    });
                                    setInvalidInputs({
                                        ...invalidInputs,
                                        city: false
                                    });
                                }}
                                isInvalid={invalidInputs.city}
                                errorMessage={invalidInputs.city ? "Please enter a valid city" : ""}
                                required
                            />
                        </div>
                    </div>
                    <div className={"flex flex-col w-full h-full max-h-full gap-4"}>
                        <Input
                            id={"name"}
                            name={"name"}
                            label={"Name"}
                            placeholder={"Name"}
                            type={"text"}
                            className={"w-full"}
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    name: event.target.value
                                });
                                setInvalidInputs({
                                    ...invalidInputs,
                                    name: false
                                });
                            }}
                            isInvalid={invalidInputs.name}
                            errorMessage={invalidInputs.name ? "Please enter a valid name" : ""}
                            required
                        />
                        <Textarea
                            id={"description"}
                            name={"description"}
                            autoComplete={"description"}
                            label={"Description"}
                            placeholder={"Description"}
                            classNames={{
                                base: "lg:flex-1",
                                inputWrapper: "lg:flex-1"
                            }}
                            onChange={(event) => {
                                setFormData({
                                    ...formData,
                                    description: event.target.value
                                });
                                setInvalidInputs({
                                    ...invalidInputs,
                                    description: false
                                });
                            }}
                            isInvalid={invalidInputs.description}
                            errorMessage={invalidInputs.description ? "Please enter a description" : ""}
                            required
                        />
                    </div>
                </div>
                <h2 className={"text-md font-bold"}>Images</h2>
                <div className={"flex flex-row w-full gap-4"}>
                    <Button
                        onClick={() => fileInput.current?.click()}
                        isIconOnly={true}
                        className={"bg-default-100 data-[hover=true]:bg-default-200 group-data-[focus=true]:bg-default-100 w-full h-52"}
                        startContent={
                            images[0] ?
                                <Image
                                    fill={true}
                                    src={URL.createObjectURL(images[0])}
                                    alt={"Image"}
                                    className={"object-cover w-full h-full"}
                                /> :

                                <Camera
                                    className={"fill-zinc-500"} height={24} width={24}/>
                        }
                        color={"primary"}
                    />
                    <input
                        type={"file"}
                        accept={"image/*"}
                        ref={fileInput}
                        multiple={true}
                        className={"hidden"}
                        onChange={(event) => {
                            const files = event.target.files;
                            if (files) {
                                setImages(Array.from(files));
                            }
                        }}
                    />
                </div>
            </div>
            <Button
                isLoading={loading}
                type={"submit"}
                className={"w-full min-h-10 font-bold"}
                color={"primary"}
            >Submit</Button>
        </form>
    )
}

export default Form