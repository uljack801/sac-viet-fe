"use client"

import { FormCapital } from "@/app/user/[userID]/components/address/FormCapital"
import { FormDistrict } from "@/app/user/[userID]/components/address/FormDistrict"
import { FormCommune } from "@/app/user/[userID]/components/address/FormCommune"
import React, { useEffect, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const FormSchema = z.object({
    detail: z.string().min(1),
})

export function FormAddressSeller({
    setValueAddress,
    setCheckUpdateAdd,
}: {
    setValueAddress: React.Dispatch<React.SetStateAction<string | undefined>>;
    setCheckUpdateAdd?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
    const [valueCapital, setValueCapital] = useState('')
    const [checkCapital, setCheckCapital] = useState(false)
    const [valueDistrict, setValueDistrict] = useState('')
    const [checkDistrict, setCheckDistrict] = useState(false)
    const [valueCommune, setValueCommune] = useState('')

    useEffect(() => {
        if (valueCapital !== '') {
            setCheckCapital(true)
        }
        if (valueDistrict !== '' && valueCapital !== '') {
            setCheckDistrict(true)
        }
    }, [valueCapital, valueDistrict])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            detail: "",
        },
    })
    function handleSave() {
        const data = form.getValues();
        const isValid = form.trigger();
        isValid.then(valid => {
            if (valid) {
                const fullAddress = `${data.detail}, ${valueCommune}`;
                setValueAddress(fullAddress);
                if (setCheckUpdateAdd) setCheckUpdateAdd(true);
            }
        });
    }


    return (
        <div>
            <div className="w-full flex">
                <FormCapital setValueCapital={setValueCapital} />
                <FormDistrict setValueDistrict={setValueDistrict} valueCapital={valueCapital} checkCapital={checkCapital} />
                <FormCommune checkDistrict={checkDistrict} setValueCommnune={setValueCommune} valueDistrict={valueDistrict} />
            </div>
            <div className="w-full">
                <Form {...form}>
                    <form >
                        <FormField
                            control={form.control}
                            name="detail"
                            render={({ field }) => (
                                <FormItem className="mt-2">
                                    <FormLabel>Địa chỉ chi tiết</FormLabel>
                                    <FormControl>
                                        <Input placeholder="nhập địa chỉ chi tiết" {...field} disabled={valueCommune === ''} />
                                    </FormControl>
                                    <FormDescription>
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button className="bg-[#C95050] text-white hover:bg-[#c9505098] mt-10" disabled={valueCommune === ''} type="button" onClick={(handleSave)}>Lưu</Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}
