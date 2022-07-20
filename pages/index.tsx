import { Canvas } from '@react-three/fiber'
import type { NextPage } from 'next'
import Head from 'next/head'

const Home: NextPage = () => {
  return (
    <>
      <h1 className='text-3xl'>Hello world</h1>
      <Canvas>
        <mesh receiveShadow={true} castShadow={true}>
        <boxBufferGeometry />
        <meshPhysicalMaterial  color={"white"} />
    </mesh>
      </Canvas>
    </>
  )
}

export default Home
