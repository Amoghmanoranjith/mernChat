'use client';
import Lottie from "lottie-react"

type PropTypes = {
    animationData:unknown
}

export const Animation = ({animationData}:PropTypes) => {
  return (
    <Lottie loop={false} animationData={animationData}/>
  )
}
