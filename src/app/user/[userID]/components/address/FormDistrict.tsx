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
    district  : z.string(),
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
export function FormDistrict({setValueDistrict, valueCapital , checkCapital}: {setValueDistrict: React.Dispatch<React.SetStateAction<string>>, valueCapital: string , checkCapital: boolean}) {
  const [dataDistrict, setDataDistrict] = useState<DataDistrictType[]>();

  useEffect(() => {
    fetch("/quan_huyen.json")
      .then((res) => res.json())
      .then((json) => {
        if (json && typeof json === "object") {
          const firstEntry = Object.values(json);
          setDataDistrict(firstEntry as DataDistrictType[]);
        }
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);
  
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const selectedDistrict = form.watch("district");
  useEffect(() => {
    if (selectedDistrict) {
        setValueDistrict(selectedDistrict); 
    }
  }, [selectedDistrict ,setValueDistrict]);  

  return (
    <div className="w-full mr-5">
    <Form {...form}>
      <form >
        <FormField
          control={form.control}
          name="district"
          render={({ field }) => (
            <FormItem >
              <FormLabel className="mb-2">Quận/Huyện</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!checkCapital}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn quận/huyện" className="w-full " />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                    {dataDistrict?.map(( value,idx) =>{ 
                        if(valueCapital === value.parent_code){
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
