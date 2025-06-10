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
  city: z.string()
});

export type DataCapitalType = {
  code: string;
  name: string;
  name_with_type: string;
  slug: string;
  type: string;
};

export function FormCapital({setValueCapital}: {setValueCapital: React.Dispatch<React.SetStateAction<string>>}) {
  const [dataCapital, setDataCapital] = useState<DataCapitalType[]>();

  useEffect(() => {
    fetch("/tinh_tp.json")
      .then((res) => res.json())
      .then((json) => {
        if (json && typeof json === "object") {
          const firstEntry = Object.values(json);
          setDataCapital(firstEntry as DataCapitalType[]);
        }
      })
      .catch((err) => console.error("Lỗi khi tải dữ liệu:", err));
  }, []);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const selectedCity = form.watch("city");
  useEffect(() => {
    if (selectedCity) {
      setValueCapital(selectedCity); 
    }
  }, [selectedCity ,setValueCapital]);  
  return (
    <div className="w-full mr-5">
      <Form {...form}>
        <form >
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mb-2">Thành phố</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn thành phố" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent  className="w-full h-60"  >
                      {dataCapital?.map((value, idx) => {
                        return (
                          <SelectItem value={value.code} key={idx}>
                            {value.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
        </form>
      </Form>
    </div>
  );
}
