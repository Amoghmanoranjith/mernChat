'use client';
import Lottie from "lottie-react"

type PropTypes = {
    animationData:unknown
}

export const LottieAnimation = ({animationData}:PropTypes) => {
  return (
    <Lottie loop={false} animationData={animationData}/>
  )
}
