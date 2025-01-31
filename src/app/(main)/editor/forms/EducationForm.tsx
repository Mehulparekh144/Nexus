import { EditorFormProps } from "@/lib/types";
import { educationSchema, EducationValues } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { GripHorizontal, Minus, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
	closestCenter,
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

export default function EducationForm({
	resumeData,
	setResumeData,
}: EditorFormProps) {
	const form = useForm<EducationValues>({
		resolver: zodResolver(educationSchema),
		defaultValues: {
			educations: resumeData.educations || [],
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
				educations:
					values.educations?.filter((education) => education !== undefined) ||
					[],
			});
		});

		return unsubscribe;
	}, [form, resumeData, setResumeData]);

	const { fields, append, remove, move } = useFieldArray({
		control: form.control,
		name: "educations",
	});

	// Sortable fields
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Handles the drag end event for the sortable fields
	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id != over.id) {
			const oldIndex = fields.findIndex((field) => field.id === active.id);
			const newIndex = fields.findIndex((field) => field.id === over.id);
			move(oldIndex, newIndex);
			return arrayMove(fields, oldIndex, newIndex);
		}
	};

	return (
		<div className="max-w-xl mx-auto space-y-6">
			<div className="space-y-1.5 text-center">
				<h2 className="text-2xl font-semibold">Education</h2>
				<p className="text-sm text-muted-foreground">
					Enter your work experiences below
				</p>
			</div>
			<Form {...form}>
				<form className="space-y-3">
					<DndContext
						sensors={sensors}
						onDragEnd={handleDragEnd}
						collisionDetection={closestCenter}
						modifiers={[restrictToVerticalAxis]}
					>
						<SortableContext
							items={fields}
							strategy={verticalListSortingStrategy}
						>
							{fields.map((field, index) => (
								<EducationItem
									id={field.id}
									key={field.id}
									form={form}
									remove={remove}
									index={index}
								/>
							))}
						</SortableContext>
					</DndContext>

					<div className="flex justify-center">
						<Button
							type="button"
							onClick={() =>
								append({
									degree: "",
									school: "",
									endDate: "",
									startDate: "",
								})
							}
						>
							<Plus /> Add
						</Button>
					</div>
				</form>
			</Form>
		</div>
	);
}

interface EducationItemProps {
	id: string;
	form: UseFormReturn<EducationValues>;
	index: number;
	remove: (index: number) => void;
}

function EducationItem({ id, form, index, remove }: EducationItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });
	return (
		<div
			ref={setNodeRef}
			className={cn(
				"space-y-3 border rounded-md bg-background p-3",
				isDragging && "bg-muted shadow-xl z-50"
			)}
			style={{
				transform: CSS.Transform.toString(transform),
				transition,
				opacity: isDragging ? 0.5 : 1,
			}}
		>
			<div className="flex justify-between gap-2">
				<span className="font-semibold">Education {index + 1} </span>
				<GripHorizontal
					{...attributes}
					{...listeners}
					className="size-5 cursor-grab text-muted-foreground"
				/>
			</div>

			<FormField
				control={form.control}
				name={`educations.${index}.degree`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>Degree</FormLabel>
						<FormControl>
							<Input {...field} autoFocus />
						</FormControl>
					</FormItem>
				)}
			/>
			<FormField
				control={form.control}
				name={`educations.${index}.school`}
				render={({ field }) => (
					<FormItem>
						<FormLabel>School</FormLabel>
						<FormControl>
							<Input {...field} />
						</FormControl>
					</FormItem>
				)}
			/>
			<div className="grid grid-cols-2 gap-3">
				<FormField
					control={form.control}
					name={`educations.${index}.startDate`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Start Date</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="date"
									value={field.value?.slice(0, 10)} // Only keeps the date as we store date time in our db
								/>
							</FormControl>
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name={`educations.${index}.endDate`}
					render={({ field }) => (
						<FormItem>
							<FormLabel>End Date</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="date"
									value={field.value?.slice(0, 10)} // Only keeps the date as we store date time in our db
								/>
							</FormControl>
						</FormItem>
					)}
				/>
			</div>
			<FormDescription>
				Leave <span className="font-semibold">end date</span> empty if you study
				here currently.
			</FormDescription>

			<Button
				variant={"destructive"}
				type="button"
				onClick={() => remove(index)}
			>
				<Minus /> Remove
			</Button>
		</div>
	);
}
