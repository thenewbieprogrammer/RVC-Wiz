import { redirect } from "@remix-run/node";

export async function loader() {
  return redirect("/voice-clone");
}

export default function Index() {
  return null;
}