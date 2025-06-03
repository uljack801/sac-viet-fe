"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";

const FormSchema = z.object({
    commune  : z.string(),
});

export type DataDistrictType ={
code: string
name: string,
name_with_type: string,
parent_code:string,
path:string,
path_with_type:string,
slug:string,
type: string
}
export function FormCommune({setValueCommnune, valueDistrict , checkDistrict}: {setValueCommnune: React.Dispatch<React.SetStateAction<string>>, valueDistrict: string , checkDistrict: boolean}) {
  const [dataCommune, setDataCommune] = useState<DataDistrictType[]>();
    
  useEffect(() => {
    fetch("/xa_phuong.json")
      .then((res) => res.json())
      .then((json) => {
        if (json && typeof json === "object") {
          const firstEntry = Object.values(json);
          setDataCommune(firstEntry as DataDistrictType[]);
        }
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const selectedCommune = form.watch("commune");
  useEffect(() => {
    if (selectedCommune) {
        dataCommune?.map((value) => {
            if(value.code === selectedCommune){
                setValueCommnune(value.path_with_type)
            }
        })
    }
  }, [selectedCommune ,setValueCommnune, dataCommune]);  

  return (
    <div className="w-full">
    <Form {...form}>
      <form >
        <FormField
          control={form.control}
          name="commune"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="mb-2">Xã/Phường</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!checkDistrict}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn phường/xã" className="w-full" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {dataCommune?.map(( value,idx) =>{ 
                        if(valueDistrict === value.parent_code){
                            return(
                                <SelectItem value={value.code} key={idx}>{value.name}</SelectItem>
                            )
                        }
                    })}
                
                </SelectContent>
              </Select>
              <FormDescription>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
    </div>
  );
}
