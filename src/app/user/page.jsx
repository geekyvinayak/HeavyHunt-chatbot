import React, { Suspense } from 'react'
import UserPanel from './tempcomponent'

const page = () => {
  return (
    <Suspense fallback={<div>Loading user inquiries...</div>}>
      <UserPanel />
    </Suspense>
  )
}

export default page