import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="appfooter">
      <div>
        <a href="https://doodcats.com" target="_blank" rel="noopener noreferrer">
          DOODCATS
        </a>
        <span className="ms-1">&copy; 2022 creativeLabs.</span>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
