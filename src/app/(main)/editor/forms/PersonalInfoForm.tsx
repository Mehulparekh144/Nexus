import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { personalInfoSchema, PersonalInfoValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import countryList from "@/data/country_dial_info.json";
import { EditorFormProps } from "@/lib/types";

export default function PersonalInfoForm({resumeData , setResumeData} : EditorFormProps) {
	const [dialCode, setDialCode] = React.useState<string>("--");
	const form = useForm<PersonalInfoValues>({
		resolver: zodResolver(personalInfoSchema),
		defaultValues: {
			firstName: resumeData.firstName || "",
			lastName: resumeData.lastName || "",
			jobTitle: resumeData.jobTitle || "",
			city: resumeData.city || "",
			country: resumeData.country || "",
			phone: resumeData.phone?.split("-")[1] || "",
			email: resumeData.email || "",
		},
	});

	function getCountryCode(country: string) {
		return countryList.find((item) => item.name === country)?.dial_code;
	}

	useEffect(() => {
		if(resumeData.country){
			setDialCode(getCountryCode(resumeData.country) ?? "--");
		}
	} , [resumeData]);

	useEffect(() => {
		// This provides real-time validation for react-hook-form without the need to submit. Useful for images
		const { unsubscribe } = form.watch(async (values) => {
			const isValid = await form.trigger();
			if (!isValid) return;
			// Update resume data

			const { country } = values;
			if (country) {
				setDialCode(getCountryCode(country) ?? "--");
			}

			if(values.phone && dialCode !== '--'){
				values.phone = `${dialCode}-${values.phone}`;
			}

			setResumeData({
				...resumeData , 
				...values
			});
			
		});

		return unsubscribe;
	}, [form , resumeData , setResumeData]);

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Personal Info</h2>
				<p className="text-sm text-muted-foreground">Tell us about yourself</p>
			</div>
			<Form {...form}>
				<form className="space-y-3">
					<FormField
						control={form.control}
						name="photo"
						render={({ field: { value, ...fieldValues } }) => (
							<FormItem>
								<FormLabel>Photo</FormLabel>
								<FormControl>
									<Input
										{...fieldValues}
										type="file"
										accept="image/*"
										onChange={(e) => {
											const file = e.target.files?.[0];
											fieldValues.onChange(file);
										}}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="firstName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>First Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Jane" autoFocus />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="lastName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Last Name</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Doe" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="jobTitle"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Job Title</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Software Engineer" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div className="grid grid-cols-2 gap-3">
						<FormField
							control={form.control}
							name="city"
							render={({ field }) => (
								<FormItem>
									<FormLabel>City</FormLabel>
									<FormControl>
										<Input {...field} placeholder="Boston" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="country"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Country</FormLabel>
									<FormControl>
										{/* <Input {...field} placeholder="USA" /> */}
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Country" />
											</SelectTrigger>
											<SelectContent>
												{countryList.map((item) => (
													<SelectItem key={item.code} value={item.name}>
														{item.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormField
						control={form.control}
						name="phone"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Phone</FormLabel>
								<FormControl>
									<div className="flex items-center ">
										<span className="px-2 py-[0.32rem] border rounded-l-md bg-zinc-900">
											{dialCode}
										</span>
										<Input
											{...field}
											type="tel"
											className="flex-1 rounded-l-none rounded-r-md"
											placeholder="Enter phone number"
										/>
									</div>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
										<Input
											{...field}
											type="email"
											className="flex-1 rounded-r-md"
											placeholder="Enter email"
										/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
}
