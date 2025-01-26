"use client";

import { useSearchParams } from "next/navigation";
import { steps } from "./steps";
import BreadCrumbs from "./BreadCrumbs";
import Footer from "./Footer";
import { useState } from "react";
import { ResumeValues } from "@/lib/validation";
import ResumePreviewSection from "./ResumePreviewSection";
import { cn } from "@/lib/utils";

export default function ResumeEditor() {
	const searchParams = useSearchParams();
	const currentStep = searchParams.get("step") || steps[0].key;

	const [showSmResumePreview, setShowSmResumePreview] =
		useState<boolean>(false);
	const [resumeData, setResumeData] = useState<ResumeValues>({});

	function setStep(key: string) {
		const newSearchParams = new URLSearchParams(searchParams);
		newSearchParams.set("step", key);
		// router.push makes a new request which can increase time of load whereas for history it just updates the state.
		window.history.pushState(null, "", `?${newSearchParams.toString()}`);
	}

	const FormComponent = steps.find(
		(step) => step.key === currentStep
	)?.component;

	return (
		<div className="flex grow flex-col">
			<header className="space-y-1.5 border-b px-3 py-5 text-center">
				<h1 className="text-2xl font-bold">Build Your Resume</h1>
			</header>
			<main className="relative grow">
				<div className="absolute bottom-0 top-0 flex w-full">
					<div
						className={cn(
							"w-full md:w-1/2 p-3 overflow-y-auto space-y-6 md:block",
							showSmResumePreview && "hidden"
						)}
					>
						<BreadCrumbs currentStep={currentStep} setCurrentStep={setStep} />
						{FormComponent && (
							<FormComponent
								resumeData={resumeData}
								setResumeData={setResumeData}
							/>
						)}
					</div>
					<div className="grow md:border-r" />
					<ResumePreviewSection
						resumeData={resumeData}
						setResumeData={setResumeData}
						className={cn(showSmResumePreview && "flex")}
					/>
				</div>
			</main>
			<Footer
				currentStep={currentStep}
				setCurrentStep={setStep}
				showSmResumePreview={showSmResumePreview}
				setShowSmResumePreview={setShowSmResumePreview}
			/>
		</div>
	);
}
