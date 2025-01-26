import { EditorFormProps } from "@/lib/types";
import { summarySchema, SummaryValue } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function SummaryForm({
	resumeData,
	setResumeData,
}: EditorFormProps) {
	const form = useForm<SummaryValue>({
		resolver: zodResolver(summarySchema),
		defaultValues: {
			summary: resumeData.summary,
		},
	});

	useEffect(() => {
		// This provides real-time validation for react-hook-form without the need to submit. Useful for images
		const { unsubscribe } = form.watch(async (values) => {
			const isValid = await form.trigger();
			if (!isValid) return;
			// Update resume data

			setResumeData({
				...resumeData,
				summary: values.summary,
			});
		});

		return unsubscribe;
	}, [form, resumeData, setResumeData]);

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Professional Summary</h2>
				<p className="text-sm text-muted-foreground">Tell us about yourself</p>
			</div>
			<Form {...form}>
				<form className="space-y-3">
					<FormField
						control={form.control}
						name="summary"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Professional Summary</FormLabel>
								<FormControl>
									<Textarea
										rows={5}
										{...field}
										placeholder="I am a dedicated Software Engineer with 3yrs of experience."
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</form>
			</Form>
		</div>
	);
}
