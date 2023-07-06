import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen gap-y-1 flex flex-col justify-center text-white items-center bg-dark-layer-1">
      <h2>Page Not Found</h2>
      <p>Could not find requested resource</p>
      <p>
        <Link href="/" className="hover:text-blue-400">
          Back To Home
        </Link>
      </p>
    </div>
  )
}
