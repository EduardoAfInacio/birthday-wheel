"use client";

import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useRouter } from "next/navigation";
import { useUserStore } from "../lib/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    email: z.string().email("Invalid email address"),
    phone: z.string()
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 11, "Phone number have 11 digits and must be valid"),
    store: z.string().min(1, "Select a store!"),
})

type FormData = z.infer<typeof formSchema>

function phoneMask(value: string) {
  return value
    .replace(/\D/g, "")           
    .replace(/^(\d{2})(\d)/, "($1) $2")
    .replace(/(\d{5})(\d)/, "$1-$2")
    .slice(0, 15)
}

const STORES = [
  { label: "Loja Centro", value: "centro" },
  { label: "Loja Shopping Norte", value: "shopping_norte" },
  { label: "Loja Shopping Sul", value: "shopping_sul" },
  { label: "Loja Bairro", value: "bairro" },
]

export default function RegisterForm() {
    const router = useRouter();
    const setName = useUserStore((state) => state.setName);

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            store: "",
        },
    })

    function onSubmit(values: FormData) {
        console.log(values);
        setName(values.name);
        router.push("/wheel");
    }

    return (
        <Card className="w-[400px] shadow-xl bg-white/95 backdrop-blur">
            <CardHeader>
                <CardTitle className="text-center text-xl text-gray-800">Cadastre-se</CardTitle>
                <p className="text-center text-sm text-gray-500">Preencha com seus dados para concorrer!</p>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Complete name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Write your name..." {...field}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Email address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Write your email..." {...field}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                        <FormField
                            control={form.control}
                            name="phone"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Phone number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="(99) 99999-9999"
                                               value={field.value}
                                               onChange={(e) => {
                                                const masked = phoneMask(e.target.value)
                                                field.onChange(masked)
                                               }}></Input>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}/>
                        <FormField
                            control={form.control}
                            name="store"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel>Store</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>

                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a store" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {STORES.map((store) => (
                                                <SelectItem key={store.value} value={store.value}>
                                                    {store.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}/>

                        <Button type="submit"
                                className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
                                    Submit
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}