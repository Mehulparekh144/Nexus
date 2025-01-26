import { EditorFormProps } from "@/lib/types";
import { skillsSchema, SkillsValue } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export default function SkillsForm({
	resumeData,
	setResumeData,
}: EditorFormProps) {
	const form = useForm<SkillsValue>({
		resolver: zodResolver(skillsSchema),
		defaultValues: {
			skills: resumeData.skills || [],
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
				skills:
					values.skills
						?.filter((skill) => skill !== undefined)
						.map((skill) => skill.trim())
						.filter((skill) => skill !== "") || [],
			});
		});

		return unsubscribe;
	}, [form, resumeData, setResumeData]);

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Skills</h2>
				<p className="text-sm text-muted-foreground">Showcase your abilities</p>
			</div>
			<Form {...form}>
				<form className="space-y-3">
					<FormField
						control={form.control}
						name="skills"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="sr-only">Skills</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										placeholder="e.g. React.js, Next.js, Machine Learning..."
										onChange={(e) => {
											const skills = e.target.value.split(",");
											field.onChange(skills);
										}}
									/>
								</FormControl>
								<FormDescription>
									Seperate each skill with a coma.
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
