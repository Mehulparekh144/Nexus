import { Metadata } from "next";
import ResumeEditor from "./ResumeEditor";

export const metadata : Metadata = {
  title : "Build your resume"
}

export default function EditorPage(){
  return <ResumeEditor/>
}