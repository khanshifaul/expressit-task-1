"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BiSolidShapes } from "react-icons/bi";
import { FaGlobeAsia } from "react-icons/fa";
import { FaDisplay } from "react-icons/fa6";
import {
  MdCurrencyExchange,
  MdOutlineEditLocation,
  MdOutlineEmail,
} from "react-icons/md";
import { z } from "zod";

const COUNTRIES = ["Bangladesh", "India", "USA", "UK"];
const CATEGORIES = ["Fashion", "Electronics", "Groceries", "Home & Garden"];
const CURRENCIES = [
  { value: "BDT", label: "BDT (Taka)" },
  { value: "USD", label: "USD (US Dollar)" },
  { value: "EUR", label: "EUR (Euro)" },
  { value: "INR", label: "INR (Indian Rupee)" },
];

const formSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters long"),
  domain: z
    .string()
    .min(3, "Domain must be at least 3 characters")
    .regex(
      /^(?!-)[a-z0-9-]+(?<!-)$/,
      "Domain can only contain lowercase letters, numbers, and hyphens (-), but cannot start or end with a hyphen, can't contain whitespace"
    )
    .refine(async (value) => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/domains/check/${value}.expressitbd.com`
        );

        return !response.data.data.taken;
      } catch {
        return false;
      }
    }, "Domain is already taken"),
  country: z
    .string()
    .default("Bangladesh")
    .refine((val) => val === "Bangladesh", {
      message: "Invalid country: Currently only Bangladesh is allowed",
    }),
  category: z.string().default("Fashion"),
  currency: z
    .enum(["BDT", "USD", "EUR", "INR"])
    .default("BDT")
    .refine((val) => val === "BDT", {
      message: "Invalid currency: Currently only BDT is allowed",
    }),
  email: z.string().email("Invalid email address"),
});

type FormValues = z.infer<typeof formSchema>;

export default function StoreCreation() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainStatus, setDomainStatus] = useState<boolean | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [formMessageType, setFormMessageType] = useState<
    "error" | "success" | null
  >(null);

  const {
    control,
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      domain: "",
      country: "Bangladesh",
      category: "Fashion",
      currency: "BDT",
      email: "",
    },
  });

  const domainValue = watch("domain");

  useEffect(() => {
    const checkDomain = async () => {
      if (domainValue && domainValue.length >= 3) {
        setDomainChecking(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/domains/check/${domainValue}.expressitbd.com`
          );
          const taken = response.data.data.taken;
          setDomainStatus(taken);
          await trigger("domain");
        } catch {
          setDomainStatus(null);
        } finally {
          setDomainChecking(false);
        }
      }
    };

    const timeoutId = setTimeout(checkDomain, 500);
    return () => clearTimeout(timeoutId);
  }, [domainValue, trigger]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const storeData = {
        name: data.name,
        domain: data.domain,
        country: data.country,
        category: data.category,
        currency: data.currency,
        email: data.email,
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/task/stores/create`,
        storeData
      );

      setFormMessage(response.data.message || "Store created successfully!");
      setFormMessageType("success");
    } catch (error) {
      if (error instanceof Error) {
        setFormMessage(error.message);
      } else {
        setFormMessage("Error creating store");
      }
      setFormMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col justify-center items-center">
      <div className="container-2xl mx-auto bg-white rounded-lg shadow-md flex flex-col items-start gap-5 p-4">
        <div className="w-full">
          <h1 className="text-2xl font-bold mb-4">Create a store</h1>
          <p className="text-gray-600 border-b-2 pb-2">
            Add your basic store information and complete the setup
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-2 md:space-y-4 w-full"
        >
          {/* Store Name */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <label className="flex items-start gap-2 font-medium">
              <FaDisplay className="text-blue-700 text-md md:text-lg lg:text-xl shrink-0" />
              <div className="flex flex-col">
                <span className="text-black font-semibold">
                  {`Give your online store a name`}
                </span>
                <span className="text-sm text-gray-500">
                  {`A great store name is a big part of your success. Make sure it aligns with your brand and products.`}
                </span>
              </div>
            </label>
            <div>
              <input
                {...register("name")}
                placeholder="How'd you like to call your store?"
                className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.name.message}
                </p>
              )}
            </div>
          </div>

          {/* Domain Field */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <label className="flex items-start gap-2 font-medium">
              <FaGlobeAsia className="text-blue-700 text-md md:text-lg lg:text-xl shrink-0" />
              <div className="flex flex-col">
                <span className="text-black font-semibold">
                  {`Your online store domain`}
                </span>
                <span className="text-sm text-gray-500">
                  {`A SEO-friendly store name is a crucial part of your success. Make sure it aligns with your brand and products.`}
                </span>
              </div>
            </label>
            <div className="relative flex-1 rounded-md shadow-sm">
              <input
                {...register("domain")}
                placeholder="Enter your domain name"
                className="w-full pr-24 rounded-md border-gray-300 border focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 bg-transparent pointer-events-none">
                .expressitbd.com
              </span>
              <div className="mt-2 flex items-center">
                {domainChecking ? (
                  <span className="text-gray-500 text-sm">
                    Checking availability...
                  </span>
                ) : errors.domain ? (
                  <span className="text-red-500 text-sm">
                    {errors.domain.message}
                  </span>
                ) : domainStatus === false ? (
                  <span className="text-green-500 text-sm">
                    Domain available!
                  </span>
                ) : domainStatus === true ? (
                  <span className="text-red-500 text-sm">
                    Domain is already taken!
                  </span>
                ) : null}
              </div>
            </div>
          </div>

          {/* Country Field */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <label
              htmlFor="country"
              className="flex items-start gap-2 font-medium"
            >
              <MdOutlineEditLocation className="text-blue-700 text-md md:text-lg lg:text-xl shrink-0" />
              <div className="flex flex-col">
                <span className="text-black font-semibold">
                  {`Where's your store located?`}
                </span>
                <span className="text-sm text-gray-500">
                  {`Set your store's default location so we can optimize store access and speed for your customers.`}
                </span>
              </div>
            </label>
            <div>
              <Controller
                name="country"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="country"
                    className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  >
                    {COUNTRIES.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
          </div>

          {/* Category Field */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <label
              htmlFor="category"
              className="flex items-start gap-2 font-medium"
            >
              <BiSolidShapes className="text-blue-700 text-md md:text-lg lg:text-xl shrink-0" />
              <div className="flex flex-col">
                <span className="text-black font-semibold">
                  {`What's your Category?`}
                </span>
                <span className="text-sm text-gray-500">
                  {`Set your store's default category so that we can optimize store access and speed for your customers.`}
                </span>
              </div>
            </label>
            <div>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="category"
                    className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                )}
              />
            </div>
          </div>

          {/* Currency Field */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <label
              htmlFor="currency"
              className="flex items-start gap-2 font-medium"
            >
              <MdCurrencyExchange className="text-blue-700 text-md md:text-lg lg:text-xl shrink-0" />
              <div className="flex flex-col">
                <span className="text-black font-semibold">
                  {`Choose store currency`}
                </span>
                <span className="text-sm text-gray-500">
                  {`This is the main currency you wish to sell in.`}
                </span>
              </div>
            </label>
            <div>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <select
                    {...field}
                    id="currency"
                    className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                  >
                    {CURRENCIES.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                )}
              />
              {errors.currency && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.currency.message}
                </p>
              )}
            </div>
          </div>

          {/* Email Field */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <label className="flex items-start gap-2 font-medium">
              <MdOutlineEmail className="text-blue-700 text-md md:text-lg lg:text-xl shrink-0" />
              <div className="flex flex-col">
                <span className="text-black font-semibold">
                  {`Store contact email`}
                </span>
                <span className="text-sm text-gray-500">
                  {`This is the email you'll use to send notifications to and receive orders from customers.`}
                </span>
              </div>
            </label>
            <div>
              <input
                {...register("email")}
                placeholder="you@example.com"
                className="mt-1 block w-full rounded-md border-gray-300 border shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-row gap-2 justify-end items-center">
            <div>
              {formMessage && (
                <p
                  className={`text-sm ${
                    formMessageType === "error"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {formMessage}
                </p>
              )}
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-fit bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSubmitting ? "Creating..." : "Create store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
