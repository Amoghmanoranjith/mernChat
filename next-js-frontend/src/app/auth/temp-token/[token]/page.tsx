'use client';

import { useParams } from "next/navigation"

const page = () => {

  const { token } = useParams()
  return (
    <>
    <div>temp token verification page</div>
    <p>{token}</p>
    </>
  )
}

export default page