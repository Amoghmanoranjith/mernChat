import Link from "next/link";

export default function NotFound() {
  return (
    <div className="bg-background w-screen h-screen p-4 flex justify-center">
      <div className="h-fit justify-center flex mt-36 flex-col gap-y-10 rounded-sm items-center">
        <div className="flex flex-col items-center gap-y-4">
          <h4 className="text-text text-7xl font-extrabold">404</h4>
          <h4 className="text-text font-medium text-5xl">
            Oops! looks like you landed on a wrong page 😺
          </h4>
        </div>
        <Link href='/'>
          <button className="text-text text-xl bg-secondary-dark px-6 py-2 rounded-md">
            Return to mern chat
          </button>
        </Link>
      </div>
    </div>
  );
}
